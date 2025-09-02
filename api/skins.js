const path = require('path');
const jsonDataService = require('../backend/services/jsonDataService');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
        skin.collection.toLowerCase().includes(collection.toLowerCase())
      );
    }

    res.json(filteredSkins);
  } catch (error) {
    console.error('Error fetching skins:', error);
    res.status(500).json({ error: 'Failed to fetch skins from local database' });
  }
};