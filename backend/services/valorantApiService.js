const axios = require('axios');

const VALORANT_API_BASE = 'https://valorant-api.com/v1';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Simple in-memory cache
const cache = new Map();

class ValorantApiService {
  constructor() {
    this.weaponsCache = null;
    this.contentTiersCache = null;
    this.lastWeaponsFetch = 0;
    this.lastContentTiersFetch = 0;
  }

  async fetchWithCache(url, cacheKey, cacheDuration = CACHE_DURATION) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    try {
      const response = await axios.get(url);
      const data = response.data.data;
      
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error.message);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log(`Using expired cache for ${cacheKey}`);
        return cached.data;
      }
      
      throw error;
    }
  }

  async getWeapons() {
    return this.fetchWithCache(`${VALORANT_API_BASE}/weapons`, 'weapons');
  }

  async getContentTiers() {
    return this.fetchWithCache(`${VALORANT_API_BASE}/contenttiers`, 'contentTiers');
  }

  mapRarityFromContentTier(contentTierUuid, contentTiers) {
    if (!contentTierUuid || !contentTiers) return 'Select';
    
    const tier = contentTiers.find(t => t.uuid === contentTierUuid);
    if (!tier) return 'Select';

    // Map based on tier ranking
    switch(tier.rank) {
      case 0: return 'Select';
      case 1: return 'Deluxe';
      case 2: return 'Premium';
      case 3: return 'Ultra';
      case 4: return 'Exclusive';
      default: return 'Select';
    }
  }

  calculatePrice(rarity) {
    const priceMap = {
      'Select': 875,
      'Deluxe': 1275,
      'Premium': 1775,
      'Ultra': 2475,
      'Exclusive': 4350
    };
    return priceMap[rarity] || 875;
  }

  transformSkinData(weapon, skin, contentTiers) {
    const rarity = this.mapRarityFromContentTier(skin.contentTierUuid, contentTiers);
    const cost = this.calculatePrice(rarity);

    // Transform chromas to color variants
    const colorVariants = skin.chromas ? skin.chromas.map(chroma => ({
      name: chroma.displayName,
      color: this.extractColorFromChroma(chroma) || '#ffffff'
    })) : [];

    return {
      id: this.generateId(weapon.uuid, skin.uuid),
      name: skin.displayName,
      weaponType: this.cleanWeaponName(weapon.displayName),
      rarity,
      cost,
      collection: this.extractCollection(skin.displayName),
      thumbnailUrl: this.getBestThumbnail(skin),
      imageUrl: this.getBestImage(skin),
      hasColorVariants: colorVariants.length > 1,
      hasAnimations: skin.levels && skin.levels.length > 1,
      colorVariants,
      description: `${skin.displayName} - ${rarity} skin for ${weapon.displayName}`
    };
  }

  generateId(weaponUuid, skinUuid) {
    // Use the skin UUID directly as it's unique
    // Convert to a shorter format but keep uniqueness
    return skinUuid.replace(/-/g, '');
  }

  cleanWeaponName(displayName) {
    // Remove any extra words and clean weapon names
    return displayName.replace(/^(.*?)(\s|$).*/, '$1');
  }

  extractCollection(skinName) {
    // Try to extract collection name from skin name
    const parts = skinName.split(' ');
    return parts.length > 1 ? `${parts[0]} Collection` : 'Standard Collection';
  }

  extractColorFromChroma(chroma) {
    // Try to extract color from chroma name or return default
    const name = chroma.displayName.toLowerCase();
    const colorMap = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'orange': '#FFA500',
      'black': '#000000',
      'white': '#FFFFFF',
      'gold': '#FFD700',
      'silver': '#C0C0C0'
    };

    for (const [color, hex] of Object.entries(colorMap)) {
      if (name.includes(color)) return hex;
    }
    
    return '#ffffff';
  }

  getBestImage(skin) {
    // Priority: fullRender > wallpaper > displayIcon
    if (skin.chromas && skin.chromas[0] && skin.chromas[0].fullRender) {
      return skin.chromas[0].fullRender;
    }
    
    if (skin.wallpaper) return skin.wallpaper;
    
    return skin.displayIcon;
  }

  getBestThumbnail(skin) {
    // For thumbnails, prefer fullRender over displayIcon for better quality
    if (skin.chromas && skin.chromas[0] && skin.chromas[0].fullRender) {
      return skin.chromas[0].fullRender;
    }
    
    // Check if skin has swatch (smaller but better quality than displayIcon)
    if (skin.chromas && skin.chromas[0] && skin.chromas[0].swatch) {
      return skin.chromas[0].swatch;
    }
    
    return skin.displayIcon;
  }

  async getAllSkins() {
    try {
      const [weapons, contentTiers] = await Promise.all([
        this.getWeapons(),
        this.getContentTiers()
      ]);

      const allSkins = [];

      weapons.forEach(weapon => {
        if (weapon.skins) {
          weapon.skins.forEach(skin => {
            // Skip base/default skins (they usually don't have contentTierUuid)
            if (!skin.contentTierUuid) return;
            
            const transformedSkin = this.transformSkinData(weapon, skin, contentTiers);
            allSkins.push(transformedSkin);
          });
        }
      });

      return allSkins;
    } catch (error) {
      console.error('Error getting all skins:', error);
      throw error;
    }
  }

  async getWeaponTypes() {
    try {
      const weapons = await this.getWeapons();
      const weaponTypes = [...new Set(weapons.map(weapon => this.cleanWeaponName(weapon.displayName)))];
      return weaponTypes;
    } catch (error) {
      console.error('Error getting weapon types:', error);
      throw error;
    }
  }

  async getSkinsByWeapon(weaponType) {
    try {
      const allSkins = await this.getAllSkins();
      return allSkins.filter(skin => 
        skin.weaponType.toLowerCase() === weaponType.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting skins by weapon:', error);
      throw error;
    }
  }

  async getSkinById(id) {
    try {
      const allSkins = await this.getAllSkins();
      return allSkins.find(skin => skin.id === id);
    } catch (error) {
      console.error('Error getting skin by ID:', error);
      throw error;
    }
  }
}

module.exports = new ValorantApiService();