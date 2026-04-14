const axios = require('axios');

const WIKI_API = 'https://valorant.fandom.com/api.php';

// Rate limit: wait between wiki requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class WikiScrapeService {
  constructor() {
    this.cache = new Map();
    this.lastRequestTime = 0;
    this.minRequestInterval = 500; // ms between requests
  }

  async throttle() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minRequestInterval) {
      await delay(this.minRequestInterval - elapsed);
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Fetch a collection's wiki page and extract all skin VP prices.
   * Returns { "Skin Name": 1775, ... } or null if page not found.
   */
  async getCollectionPrices(collectionName) {
    // Check cache first
    if (this.cache.has(collectionName)) {
      return this.cache.get(collectionName);
    }

    const pageName = this.toWikiPageName(collectionName);

    await this.throttle();

    try {
      const response = await axios.get(WIKI_API, {
        params: {
          action: 'parse',
          page: pageName,
          format: 'json',
          prop: 'wikitext',
          redirects: true
        },
        timeout: 10000
      });

      if (response.data.error) {
        console.log(`  Wiki page not found: ${pageName}`);
        this.cache.set(collectionName, null);
        return null;
      }

      const wikitext = response.data.parse.wikitext['*'];
      const prices = this.parsePrices(wikitext);
      if (prices) {
        prices._bundleCost = this.parseBundleCost(wikitext);
      }
      this.cache.set(collectionName, prices);
      return prices;
    } catch (error) {
      console.log(`  Wiki fetch failed for ${pageName}: ${error.message}`);
      this.cache.set(collectionName, null);
      return null;
    }
  }

  /**
   * Convert collection name to wiki page name.
   * e.g. "Kohaku & Matsuba Collection" -> "Kohaku_%26_Matsuba_Collection"
   */
  toWikiPageName(collectionName) {
    return collectionName
      .replace(/ /g, '_')
      .replace(/&/g, '%26');
  }

  /**
   * Parse VP prices from wiki page wikitext.
   * Looks for {{VP|X,XXX}} patterns and associates them with skin names.
   */
  parsePrices(wikitext) {
    const prices = {};
    const lines = wikitext.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const vpMatch = lines[i].match(/\{\{VP\|([0-9,]+)\}\}/);
      if (!vpMatch) continue;

      const price = parseInt(vpMatch[1].replace(/,/g, ''), 10);
      if (isNaN(price)) continue;

      // Look backwards for the skin name
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const prev = lines[j];
        // Skip empty lines and lines that are just formatting
        if (!prev.trim() || prev.trim() === '|-') continue;

        // Extract name from wiki markup
        let name = prev
          .replace(/\[\[File:[^\]]*\]\]/g, '')
          .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
          .replace(/\[\[([^\]]+)\]\]/g, '$1')
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/'{2,}/g, '')
          .replace(/^\s*\|\s*/, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Clean up melee formatting like "Melee: Skin Name"
        name = name.replace(/^Melee:\s*/i, '');

        // Skip table headers and formatting
        if (!name || name.startsWith('!') || name.startsWith('{') || name.startsWith('style')) continue;

        if (name.length > 2 && name.length < 80) {
          prices[name] = price;
          break;
        }
      }
    }

    return Object.keys(prices).length > 0 ? prices : null;
  }

  /**
   * Extract bundle cost from wikitext.
   * Looks for |type= lines containing {{VP|X,XXX}} in the infobox.
   */
  parseBundleCost(wikitext) {
    // Match the bundle cost pattern: |type=*{{VP|X,XXX}} or similar
    const match = wikitext.match(/\|type\s*=\s*\*?\s*\{\{VP\|([0-9,]+)\}\}/);
    if (match) {
      return match[1].replace(/,/g, '');
    }
    return null;
  }

  /**
   * Look up a specific skin's price from its collection wiki page.
   * Uses fuzzy matching since wiki names may differ slightly from API names.
   */
  async getSkinPrice(collectionName, skinName) {
    const prices = await this.getCollectionPrices(collectionName);
    if (!prices) return null;

    // Exact match
    if (prices[skinName] !== undefined) return prices[skinName];

    // Case-insensitive match
    const skinLower = skinName.toLowerCase();
    for (const [wikiName, price] of Object.entries(prices)) {
      if (wikiName.toLowerCase() === skinLower) return price;
    }

    // Partial match - wiki name contains our name or vice versa
    for (const [wikiName, price] of Object.entries(prices)) {
      const wikiLower = wikiName.toLowerCase();
      if (wikiLower.includes(skinLower) || skinLower.includes(wikiLower)) {
        return price;
      }
    }

    return null;
  }
}

module.exports = new WikiScrapeService();
