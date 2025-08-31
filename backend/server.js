const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const valorantApiService = require('./services/valorantApiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.get('/api/skins', async (req, res) => {
  try {
    const { weapon, rarity, collection } = req.query;
    let filteredSkins = await valorantApiService.getAllSkins();

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
        skin.collection.toLowerCase().includes(collection.toLowerCase())
      );
    }

    res.json(filteredSkins);
  } catch (error) {
    console.error('Error fetching skins:', error);
    res.status(500).json({ error: 'Failed to fetch skins from Valorant API' });
  }
});

app.get('/api/skins/:id', async (req, res) => {
  try {
    const skin = await valorantApiService.getSkinById(req.params.id);
    if (!skin) {
      return res.status(404).json({ error: 'Skin not found' });
    }
    res.json(skin);
  } catch (error) {
    console.error('Error fetching skin by ID:', error);
    res.status(500).json({ error: 'Failed to fetch skin from Valorant API' });
  }
});

app.get('/api/weapons', async (req, res) => {
  try {
    const weaponTypes = await valorantApiService.getWeaponTypes();
    res.json(weaponTypes);
  } catch (error) {
    console.error('Error fetching weapon types:', error);
    res.status(500).json({ error: 'Failed to fetch weapon types from Valorant API' });
  }
});

app.get('/api/skins/weapon/:type', async (req, res) => {
  try {
    const weaponType = req.params.type;
    const weaponSkins = await valorantApiService.getSkinsByWeapon(weaponType);
    res.json(weaponSkins);
  } catch (error) {
    console.error('Error fetching skins by weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon skins from Valorant API' });
  }
});

// Hardcoded data removed - now using Valorant API

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});