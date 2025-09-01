const fs = require('fs').promises;
const path = require('path');
const valorantApiService = require('./valorantApiService');

class JsonDataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.skinsFilePath = path.join(this.dataDir, 'skins.json');
    this.metadataFilePath = path.join(this.dataDir, 'metadata.json');
    this.skinsCache = null;
    this.lastLoadTime = 0;
  }

  async loadSkinsFromFile() {
    try {
      // Check if we need to reload (cache for 5 minutes to avoid constant file reads)
      if (this.skinsCache && Date.now() - this.lastLoadTime < 5 * 60 * 1000) {
        return this.skinsCache;
      }

      const data = await fs.readFile(this.skinsFilePath, 'utf8');
      this.skinsCache = JSON.parse(data);
      this.lastLoadTime = Date.now();
      
      console.log(`Loaded ${this.skinsCache.length} skins from local JSON database`);
      return this.skinsCache;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('No local skins data found. Use /api/data/sync to initialize.');
        return [];
      }
      console.error('Error loading skins from JSON:', error);
      throw error;
    }
  }

  async saveSkinsToFile(skins) {
    try {
      await fs.writeFile(this.skinsFilePath, JSON.stringify(skins, null, 2));
      
      // Update metadata
      const metadata = {
        lastSync: new Date().toISOString(),
        version: "1.0.0",
        totalSkins: skins.length,
        syncSource: "valorant-api.com",
        notes: "Data synced from Valorant API with custom pricing"
      };
      
      await fs.writeFile(this.metadataFilePath, JSON.stringify(metadata, null, 2));
      
      // Clear cache to force reload
      this.skinsCache = null;
      this.lastLoadTime = 0;
      
      console.log(`Saved ${skins.length} skins to local JSON database`);
      return true;
    } catch (error) {
      console.error('Error saving skins to JSON:', error);
      throw error;
    }
  }

  async getAllSkins() {
    return await this.loadSkinsFromFile();
  }

  async getWeaponTypes() {
    const skins = await this.loadSkinsFromFile();
    const weaponTypes = [...new Set(skins.map(skin => skin.weaponType))];
    return weaponTypes.sort();
  }

  async getSkinsByWeapon(weaponType) {
    const skins = await this.loadSkinsFromFile();
    return skins.filter(skin => 
      skin.weaponType.toLowerCase() === weaponType.toLowerCase()
    );
  }

  async getSkinById(id) {
    const skins = await this.loadSkinsFromFile();
    return skins.find(skin => skin.id === id);
  }

  async syncFromApi() {
    try {
      console.log('Starting data sync from Valorant API...');
      
      // Get fresh data from API
      const apiSkins = await valorantApiService.getAllSkins();
      
      // Save to local JSON
      await this.saveSkinsToFile(apiSkins);
      
      console.log(`Successfully synced ${apiSkins.length} skins from API to local database`);
      return {
        success: true,
        message: `Synced ${apiSkins.length} skins from Valorant API`,
        totalSkins: apiSkins.length,
        syncTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error during API sync:', error);
      throw error;
    }
  }

  async compareWithApi() {
    try {
      console.log('Comparing local data with Valorant API...');
      
      const [localSkins, apiSkins] = await Promise.all([
        this.loadSkinsFromFile(),
        valorantApiService.getAllSkins()
      ]);

      // Create comparison
      const localIds = new Set(localSkins.map(skin => skin.id));
      const apiIds = new Set(apiSkins.map(skin => skin.id));
      
      const newInApi = apiSkins.filter(skin => !localIds.has(skin.id));
      const removedFromApi = localSkins.filter(skin => !apiIds.has(skin.id));
      
      // Check for price changes
      const priceChanges = [];
      apiSkins.forEach(apiSkin => {
        const localSkin = localSkins.find(ls => ls.id === apiSkin.id);
        if (localSkin && localSkin.cost !== apiSkin.cost) {
          priceChanges.push({
            name: apiSkin.name,
            oldPrice: localSkin.cost,
            newPrice: apiSkin.cost
          });
        }
      });

      const comparison = {
        localCount: localSkins.length,
        apiCount: apiSkins.length,
        newSkins: newInApi.length,
        removedSkins: removedFromApi.length,
        priceChanges: priceChanges.length,
        details: {
          newInApi: newInApi.slice(0, 10), // Show first 10
          removedFromApi: removedFromApi.slice(0, 10),
          priceChanges: priceChanges.slice(0, 10)
        },
        lastChecked: new Date().toISOString()
      };

      console.log(`Comparison complete: ${newInApi.length} new, ${removedFromApi.length} removed, ${priceChanges.length} price changes`);
      return comparison;
    } catch (error) {
      console.error('Error during API comparison:', error);
      throw error;
    }
  }

  async getMetadata() {
    try {
      const data = await fs.readFile(this.metadataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          lastSync: null,
          version: "1.0.0",
          totalSkins: 0,
          syncSource: "valorant-api.com",
          notes: "No data synced yet"
        };
      }
      throw error;
    }
  }

  clearCache() {
    this.skinsCache = null;
    this.lastLoadTime = 0;
    console.log('JSON data cache cleared');
  }
}

module.exports = new JsonDataService();