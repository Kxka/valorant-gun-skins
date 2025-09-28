const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const valorantApiService = require('./services/valorantApiService');
const jsonDataService = require('./services/jsonDataService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.post('/api/cache/clear', (req, res) => {
  jsonDataService.clearCache();
  res.json({ status: 'JSON data cache cleared successfully!' });
});

app.get('/api/skins', async (req, res) => {
  try {
    const { weapon, rarity, collection } = req.query;
    let filteredSkins = await jsonDataService.getAllSkins();

    if (weapon) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.weaponType.toLowerCase() === weapon.toLowerCase()
      );
    }

    if (rarity) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.rarity.toLowerCase() === rarity.toLowerCase()
      );
    }

    if (collection) {
      filteredSkins = filteredSkins.filter(skin =>
        skin.collection.toLowerCase() === collection.toLowerCase()
      );
    }

    res.json(filteredSkins);
  } catch (error) {
    console.error('Error fetching skins:', error);
    res.status(500).json({ error: 'Failed to fetch skins from local database' });
  }
});

app.get('/api/skins/:id', async (req, res) => {
  try {
    const skin = await jsonDataService.getSkinById(req.params.id);
    if (!skin) {
      return res.status(404).json({ error: 'Skin not found' });
    }
    res.json(skin);
  } catch (error) {
    console.error('Error fetching skin by ID:', error);
    res.status(500).json({ error: 'Failed to fetch skin from local database' });
  }
});

app.get('/api/weapons', async (req, res) => {
  try {
    const weaponTypes = await jsonDataService.getWeaponTypes();
    res.json(weaponTypes);
  } catch (error) {
    console.error('Error fetching weapon types:', error);
    res.status(500).json({ error: 'Failed to fetch weapon types from local database' });
  }
});

app.get('/api/skins/weapon/:type', async (req, res) => {
  try {
    const weaponType = req.params.type;
    const weaponSkins = await jsonDataService.getSkinsByWeapon(weaponType);
    res.json(weaponSkins);
  } catch (error) {
    console.error('Error fetching skins by weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon skins from local database' });
  }
});

// Data Management Endpoints
app.get('/api/data/status', async (req, res) => {
  try {
    const metadata = await jsonDataService.getMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching data status:', error);
    res.status(500).json({ error: 'Failed to fetch data status' });
  }
});

app.get('/api/data/compare', async (req, res) => {
  try {
    const comparison = await jsonDataService.compareWithApi();
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing with API:', error);
    res.status(500).json({ error: 'Failed to compare with Valorant API' });
  }
});

app.post('/api/data/sync', async (req, res) => {
  try {
    const result = await jsonDataService.syncFromApi();
    res.json(result);
  } catch (error) {
    console.error('Error syncing from API:', error);
    res.status(500).json({ error: 'Failed to sync from Valorant API' });
  }
});

// Hardcoded data removed - now using local JSON database

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});