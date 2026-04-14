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

    // Map based on tier ranking (corrected to match official Valorant pricing)
    switch(tier.rank) {
      case 0: return 'Select';
      case 1: return 'Deluxe';
      case 2: return 'Premium';
      case 3: return 'Exclusive';
      case 4: return 'Ultra';
      default: return 'Select';
    }
  }

  isBattlepassSkin(skinName, collectionName) {
    // Complete battlepass collections list (from Valorant Fandom wiki)
    // Select edition BP collections
    const selectBP = [
      '.EXE', '9 Lives', 'Aero', 'Aerosol', 'Aquatica', 'Belaflaire',
      'Blush', 'Bulletbox', 'Bumble Brigade', 'Celestia', 'Cloudweaver',
      'Coalition: Cobra', 'Convergence', 'Couture', 'Depths', 'Digihex',
      'Divine Swine', 'Doom Wing', 'Dragon Gate', 'Fiber Optic', 'Freehand',
      'Frequency', 'Goldwing', 'Gridcrash', 'Haloform', 'Heartbreaker',
      'Heartseeker', 'Hue Shift', 'Hydrodip', 'Immortalized', 'Jigsaw',
      'Libretto', 'Lightwave', 'Monarch', 'Monstrocity', 'Moon Scout',
      'Moondash', 'Nanobreak', 'Nitro', 'Outpost', 'Panoramic', 'Perch',
      'POLYfox', 'POLYfrog', 'Premiere Collision', 'Prism III', 'Red Alert',
      'Refractrix', 'Retrowave', 'Rune Stone', 'Schema', 'Serenity',
      'Shimmer', 'Signature', 'Silhouette', 'Soulburst', 'Space Piercer',
      'Spellbound', 'Spitfire', 'Starlit Odyssey', 'Stormborne', 'Striker',
      'Superset', 'Surge', 'Tactiplay', 'Tacti-Series', 'Tacti-Treat',
      'Topotek', 'Varnish', 'Yoonseul'
    ];
    // Deluxe edition BP collections
    const deluxeBP = [
      '.SYS', 'ATLAS // CMD', 'Artisan', 'Bound', 'Bubble Pop', 'Byteshift',
      'Cavalier', 'Comet', 'Composite', 'Genesis', 'Guardrail', 'Heartstopper',
      'Hieroscape', 'Hivemind', 'Infinity', 'Interhelm', 'Iridian Thorn',
      'K/TAC', 'Kingdom', 'Lore', "Lycan's Bane", 'Montage', 'Overlay',
      'Paceline', 'Piedra del Sol', 'Ruin', 'Sandswept', 'Shellspire',
      'Solarex', 'Songsteel', 'Torque', 'Task Force 809', 'Tilde',
      'Transition', 'Velocity', 'Venturi'
    ];

    // Build full collection names for exact matching (avoids "Ruin" matching "Ruination")
    const allBP = [...selectBP, ...deluxeBP].map(bp => `${bp} Collection`.toLowerCase());
    const colLower = collectionName.toLowerCase();

    return allBP.includes(colLower);
  }

  getAgentFromSkin(skinName) {
    // Complete list of agent contract skins with their agent names
    const agentSkins = {
      'Eclipse Ghost': 'Astra',
      'RagnaRocker Frenzy': 'Breach', 
      'Peacekeeper Sheriff': 'Brimstone',
      'Finesse Classic': 'Chamber',
      'Flutter Ghost': 'Clove',
      'Hush Ghost': 'Cypher',
      'Resolution Classic': 'Deadlock',
      'Karabasan Shorty': 'Fade',
      'Sidekick Shorty': 'Gekko',
      'Wayfarer Sheriff': 'Harbor',
      'Mythmaker Sheriff': 'Iso',
      'Game Over Sheriff': 'Jett',
      'FIRE/arm Classic': 'KAY/O',
      'Wunderkind Shorty': 'Killjoy',
      'Live Wire Frenzy': 'Neon',
      'Soul Silencer Ghost': 'Omen',
      'Spitfire Frenzy': 'Phoenix',
      'Pistolinha Classic': 'Raze',
      'Vendetta Ghost': 'Reyna',
      'Final Chamber Classic': 'Sage',
      'Swooping Frenzy': 'Skye',
      'Protektor Sheriff': 'Sova',
      'Snakebite Shorty': 'Viper',
      'Steel Resolve Classic': 'Vyse',
      'Hard Bargain Shorty': 'Tejo',
      'Death Wish Sheriff': 'Yoru',
      'Kaleidoscope Frenzy': 'Waylay'
    };

    // Check if this skin matches any agent contract skin
    for (const [skinKey, agent] of Object.entries(agentSkins)) {
      if (skinName.includes(skinKey)) {
        return agent;
      }
    }
    
    return null;
  }

  calculatePrice(rarity, weaponType, skinName = '', collectionName = '') {
    // Check if it's an agent contract skin first
    const agentName = this.getAgentFromSkin(skinName);
    if (agentName) {
      return agentName;
    }
    
    // Check if it's a battlepass skin
    if (this.isBattlepassSkin(skinName, collectionName)) {
      return 'Battlepass';
    }
    
    // Special pricing exceptions for unique skins from PCGamesN website
    const specialPricing = {
      // Melee exceptions: Premium melees priced above 3,550
      'Bolt Knife': 4350,
      'Eternal Sovereign': 4350,
      'Helix Daggers': 4350,
      'Ion Karambit': 4350,
      'Magepunk Sparkswitch': 4350,
      'Reaver Karambit': 4350,
      'Reaver Butterfly Knife': 5350,
      'XERØFANG Knife': 4350,

      // Melee exceptions: Deluxe melees priced above 2,550
      'Minima Karambit': 3550,
      'Luna\'s Descent': 3550,

      // Melee exceptions: Select melees priced above 1,750
      'Wonderstallion Hammer': 3550,

      // Melee exceptions: Exclusive melees at 5,350 (default is 4,350)
      'Nocturnum Scythe': 5350,
      'Onimaru Kunitsuna': 5350,
      'Cyrax Fanblade': 5350,
      'EX.O Edge': 5350,
      'Kuronami no Yaiba': 5350,
      'Phaseguard Splitter': 5350,
      'Waveform': 5350,

      // Melee exceptions: Ultra melees at 5,950 (default is 4,950)
      'Power Fist': 5950,

      // Exclusive guns at 2,375 (default is 2,175)
      'EX.O Sheriff': 2375,
      'EX.O Spectre': 2375,
      'EX.O Vandal': 2375,
      'EX.O Outlaw': 2375,
      'Kuronami Sheriff': 2375,
      'Kuronami Spectre': 2375,
      'Kuronami Vandal': 2375,
      'Kuronami Marshal': 2375,

      // Exclusive guns at 2,675 (default is 2,175)
      'Spectrum Bulldog': 2675,
      'Spectrum Classic': 2675,
      'Spectrum Guardian': 2675,
      'Spectrum Phantom': 2675,

      // Ultra guns at 2,975 (default is 2,475)
      'Radiant Entertainment System Bulldog': 2975,
      'Radiant Entertainment System Ghost': 2975,
      'Radiant Entertainment System Operator': 2975,
      'Radiant Entertainment System Phantom': 2975,
    };
    
    // Check for special pricing first
    if (skinName && specialPricing[skinName]) {
      return specialPricing[skinName];
    }
    
    const gunPriceMap = {
      'Select': 875,
      'Deluxe': 1275,
      'Premium': 1775,
      'Exclusive': 2175,
      'Ultra': 2475
    };
    
    const meleePriceMap = {
      'Select': 1750,    // 875 * 2
      'Deluxe': 2550,    // 1275 * 2
      'Premium': 3550,   // 1775 * 2
      'Exclusive': 4350, // 2175 * 2
      'Ultra': 4950      // 2475 * 2
    };
    
    const basePrice = gunPriceMap[rarity] || 875;
    
    // Check if it's a melee weapon
    const isMelee = weaponType && weaponType.toLowerCase() === 'melee';
    
    return isMelee ? (meleePriceMap[rarity] || 1750) : basePrice;
  }

  transformSkinData(weapon, skin, contentTiers) {
    const rarity = this.mapRarityFromContentTier(skin.contentTierUuid, contentTiers);
    const weaponType = this.cleanWeaponName(weapon.displayName);
    const collection = this.extractCollection(skin.displayName);
    const cost = this.calculatePrice(rarity, weaponType, skin.displayName, collection);

    // Transform chromas to color variants
    const colorVariants = skin.chromas ? skin.chromas.map(chroma => ({
      name: chroma.displayName,
      color: this.extractColorFromChroma(chroma) || '#ffffff'
    })) : [];

    // Check if cost is an agent name (string) rather than a price (number)
    const isAgentSkin = typeof cost === 'string' && cost !== 'Battlepass';
    const agentName = isAgentSkin ? cost : null;
    const actualCost = isAgentSkin ? 'Contract Reward' : cost;
    
    // Check if this is a battlepass skin
    const isBattlepass = this.isBattlepassSkin(skin.displayName, collection);
    
    // Build hidden tags array
    const hiddenTags = [];
    if (agentName) {
      hiddenTags.push(agentName.toLowerCase());
    }
    if (isBattlepass) {
      hiddenTags.push('battlepass');
    }
    
    // Debug logging for all skins
    if (skin.displayName.includes('Final Chamber')) {
      console.log(`DEBUG Final Chamber: cost=${cost}, typeof=${typeof cost}, isAgentSkin=${isAgentSkin}, agentName=${agentName}`);
    }
    
    return {
      id: this.generateId(weapon.uuid, skin.uuid),
      name: skin.displayName,
      weaponType: this.cleanWeaponName(weapon.displayName),
      rarity,
      cost: actualCost,
      collection,
      thumbnailUrl: this.getBestThumbnail(skin),
      imageUrl: this.getBestImage(skin),
      hasColorVariants: colorVariants.length > 1,
      hasAnimations: skin.levels && skin.levels.length > 1,
      colorVariants,
      description: `${skin.displayName} - ${rarity} skin for ${weapon.displayName}`,
      hiddenTags
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
      console.log('ValorantApiService.getAllSkins() called');
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

  clearCache() {
    cache.clear();
    this.weaponsCache = null;
    this.contentTiersCache = null;
    this.lastWeaponsFetch = 0;
    this.lastContentTiersFetch = 0;
    console.log('API cache cleared successfully');
  }
}

module.exports = new ValorantApiService();