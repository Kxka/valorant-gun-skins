#!/usr/bin/env node

/**
 * Daily skin sync script.
 * - Fetches all skins from the Valorant API
 * - Compares with local skins.json
 * - Only ADDS new skins (never overwrites existing)
 * - Uses wiki scraping for Exclusive/Ultra/melee prices
 * - Falls back to tier defaults with priceVerified: false
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const valorantApiService = require('../services/valorantApiService');
const wikiScrapeService = require('../services/wikiScrapeService');

const SKINS_PATH = path.join(__dirname, '../data/skins.json');
const METADATA_PATH = path.join(__dirname, '../data/metadata.json');
const API_BASE = 'https://valorant-api.com/v1';

// Deterministic price tables
const GUN_PRICES = { Select: 875, Deluxe: 1275, Premium: 1775, Exclusive: 2175, Ultra: 2475 };
const MELEE_PRICES = { Select: 1750, Deluxe: 2550, Premium: 3550, Exclusive: 4350, Ultra: 4950 };

async function fetchApi(endpoint) {
  const resp = await axios.get(`${API_BASE}${endpoint}`);
  return resp.data.data;
}

/**
 * Resolve collection name using the themes API for accurate multi-word names.
 */
function resolveCollection(skin, themes) {
  if (skin.themeUuid && themes) {
    const theme = themes.find(t => t.uuid === skin.themeUuid);
    if (theme) return `${theme.displayName} Collection`;
  }
  // Fallback: first word (matches existing extractCollection behavior)
  const parts = skin.displayName.split(' ');
  return parts.length > 1 ? `${parts[0]} Collection` : 'Standard Collection';
}

/**
 * Determine price for a new skin.
 * Priority: agent contract > battlepass > specialPricing > deterministic tier > wiki scrape > default + flag
 */
async function determinePrice(skinName, collection, rarity, weaponType, wikiCache) {
  // 1. Agent contract
  const agent = valorantApiService.getAgentFromSkin(skinName);
  if (agent) {
    return { cost: 'Contract Reward', verified: true, hiddenTag: agent.toLowerCase() };
  }

  // 2. Battlepass - check if the existing DB already has this collection as BP
  // (the sync script loads existing skins, so we check against known BP collections)
  if (valorantApiService.isBattlepassSkin(skinName, collection)) {
    return { cost: 'Battlepass', verified: true, hiddenTag: 'battlepass' };
  }

  // 3. Special pricing (known exceptions from verified wiki data)
  const specialPrice = valorantApiService.calculatePrice(rarity, weaponType, skinName, collection);
  // calculatePrice might return an agent name string - skip those
  if (typeof specialPrice === 'string' && specialPrice !== 'Battlepass') {
    return { cost: 'Contract Reward', verified: true, hiddenTag: specialPrice.toLowerCase() };
  }
  if (specialPrice === 'Battlepass') {
    return { cost: 'Battlepass', verified: true, hiddenTag: 'battlepass' };
  }

  const isMelee = weaponType && weaponType.toLowerCase() === 'melee';
  const defaultPrice = isMelee ? (MELEE_PRICES[rarity] || 1750) : (GUN_PRICES[rarity] || 875);

  // 4. For Select/Deluxe/Premium GUNS: price is always deterministic
  if (!isMelee && ['Select', 'Deluxe', 'Premium'].includes(rarity)) {
    // Check if specialPricing returned something different (an override)
    if (specialPrice !== defaultPrice) {
      return { cost: specialPrice, verified: true };
    }
    return { cost: defaultPrice, verified: true };
  }

  // 5. For Exclusive/Ultra guns or ANY melee: try wiki scrape
  if (!wikiCache.has(collection)) {
    console.log(`  Fetching wiki prices for: ${collection}`);
    const wikiPrices = await wikiScrapeService.getCollectionPrices(collection);
    wikiCache.set(collection, wikiPrices);
  }

  const wikiPrices = wikiCache.get(collection);
  if (wikiPrices) {
    const wikiPrice = await wikiScrapeService.getSkinPrice(collection, skinName);
    if (wikiPrice) {
      console.log(`  Wiki price found: ${skinName} = ${wikiPrice} VP`);
      return { cost: wikiPrice, verified: true };
    }
  }

  // 6. Check if specialPricing had an override
  if (specialPrice !== defaultPrice) {
    return { cost: specialPrice, verified: true };
  }

  // 7. Fallback: tier default, flagged as unverified
  console.log(`  No wiki price for ${skinName}, using ${rarity} default: ${defaultPrice} [UNVERIFIED]`);
  return { cost: defaultPrice, verified: false };
}

/**
 * Build a skin object matching the existing skins.json schema.
 */
function buildSkinObject(skin, weapon, rarity, weaponType, collection, priceResult, bundleCost) {
  const colorVariants = skin.chromas ? skin.chromas.map(chroma => ({
    name: chroma.displayName,
    color: valorantApiService.extractColorFromChroma(chroma) || '#ffffff'
  })) : [];

  const hiddenTags = [];
  if (priceResult.hiddenTag) {
    hiddenTags.push(priceResult.hiddenTag);
  }

  const obj = {
    id: skin.uuid.replace(/-/g, ''),
    name: skin.displayName,
    weaponType,
    rarity,
    cost: priceResult.cost,
    collection,
    thumbnailUrl: getBestThumbnail(skin),
    imageUrl: getBestImage(skin),
    hasColorVariants: colorVariants.length > 1,
    hasAnimations: skin.levels && skin.levels.length > 1,
    colorVariants,
    description: getDescription(skin.displayName, priceResult, collection, bundleCost),
    hiddenTags
  };

  if (priceResult.verified === false) {
    obj.priceVerified = false;
  }

  return obj;
}

function getDescription(skinName, priceResult, collection, bundleCost) {
  if (priceResult.cost === 'Battlepass') return 'Obtained in Battlepass';
  if (priceResult.cost === 'Contract Reward') return 'Agent Contract Reward';
  if (priceResult.cost === 'Limited') return 'Limited Time Only';
  if (collection.startsWith('VCT x ') || collection.includes('Team Capsules')) return 'VCT Team Capsule';
  if (bundleCost) return `Bundle Cost ${bundleCost}`;
  return skinName;
}

function getBestThumbnail(skin) {
  if (skin.chromas && skin.chromas[0] && skin.chromas[0].fullRender) {
    return skin.chromas[0].fullRender;
  }
  if (skin.chromas && skin.chromas[0] && skin.chromas[0].swatch) {
    return skin.chromas[0].swatch;
  }
  return skin.displayIcon;
}

function getBestImage(skin) {
  if (skin.chromas && skin.chromas[0] && skin.chromas[0].fullRender) {
    return skin.chromas[0].fullRender;
  }
  if (skin.wallpaper) return skin.wallpaper;
  return skin.displayIcon;
}

async function main() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting skin sync...\n`);

  // 1. Load existing local data
  let localSkins;
  try {
    localSkins = JSON.parse(await fs.readFile(SKINS_PATH, 'utf8'));
  } catch (e) {
    console.error('Failed to read skins.json:', e.message);
    process.exit(1);
  }
  const localIds = new Set(localSkins.map(s => s.id));
  console.log(`Local database: ${localSkins.length} skins`);

  // 2. Fetch from Valorant API
  console.log('Fetching from Valorant API...');
  const [weapons, contentTiers, themes] = await Promise.all([
    fetchApi('/weapons'),
    fetchApi('/contenttiers'),
    fetchApi('/themes')
  ]);
  console.log(`API: ${weapons.length} weapons, ${contentTiers.length} content tiers, ${themes.length} themes\n`);

  // 3. Find new skins
  const newSkins = [];
  const wikiCache = new Map();

  for (const weapon of weapons) {
    if (!weapon.skins) continue;

    for (const skin of weapon.skins) {
      // Skip default/base skins
      if (!skin.contentTierUuid) continue;

      const id = skin.uuid.replace(/-/g, '');
      if (localIds.has(id)) continue;

      // New skin found
      const rarity = valorantApiService.mapRarityFromContentTier(skin.contentTierUuid, contentTiers);
      const weaponType = valorantApiService.cleanWeaponName(weapon.displayName);
      const collection = resolveCollection(skin, themes);

      console.log(`NEW: ${skin.displayName} (${weaponType}, ${rarity}, ${collection})`);

      const priceResult = await determinePrice(skin.displayName, collection, rarity, weaponType, wikiCache);

      // Get bundle cost from wiki cache if available
      let bundleCost = null;
      const wikiPrices = wikiCache.get(collection);
      if (wikiPrices && wikiPrices._bundleCost) {
        bundleCost = wikiPrices._bundleCost;
      }

      const skinObj = buildSkinObject(skin, weapon, rarity, weaponType, collection, priceResult, bundleCost);
      newSkins.push(skinObj);
    }
  }

  // 4. Save if there are new skins
  if (newSkins.length === 0) {
    console.log('\nNo new skins found. Database is up to date.');
    process.exit(0);
  }

  const updatedSkins = [...localSkins, ...newSkins];
  await fs.writeFile(SKINS_PATH, JSON.stringify(updatedSkins, null, 2));

  // 5. Update metadata
  const metadata = {
    lastSync: new Date().toISOString(),
    version: '1.0.0',
    totalSkins: updatedSkins.length,
    syncSource: 'valorant-api.com + wiki scrape',
    notes: `Auto-sync added ${newSkins.length} new skins`
  };
  await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2));

  // 6. Summary
  const unverified = newSkins.filter(s => s.priceVerified === false);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n=== Sync Complete (${elapsed}s) ===`);
  console.log(`Added ${newSkins.length} new skins (total: ${updatedSkins.length})`);
  console.log('');

  newSkins.forEach(s => {
    const flag = s.priceVerified === false ? ' [UNVERIFIED]' : '';
    console.log(`  + ${s.name} | ${s.collection} | ${s.rarity} | ${s.cost}${flag}`);
  });

  if (unverified.length > 0) {
    console.log(`\nWARNING: ${unverified.length} skin(s) need manual price verification:`);
    unverified.forEach(s => {
      console.log(`  - ${s.name} (${s.collection}) = ${s.cost}`);
    });
  }
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
