const http = require('http');

// Simple function to make HTTP request
function getSkins() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000/api/skins', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const skins = JSON.parse(data);
          resolve(skins);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

async function debugSkins() {
  try {
    const skins = await getSkins();
    console.log('Total skins:', skins.length);
    
    const finalChamber = skins.find(s => s.name.includes('Final Chamber'));
    if (finalChamber) {
      console.log('\nFinal Chamber Classic:');
      console.log('Name:', finalChamber.name);
      console.log('Cost:', finalChamber.cost);
      console.log('Cost type:', typeof finalChamber.cost);
      console.log('Has hiddenTags:', 'hiddenTags' in finalChamber);
      console.log('Hidden tags value:', finalChamber.hiddenTags);
      console.log('All keys:', Object.keys(finalChamber));
    }
    
    // Check a few agent skins
    const agentSkinsToCheck = ['Final Chamber Classic', 'Death Wish Sheriff', 'Game Over Sheriff'];
    console.log('\nAgent skin check:');
    
    agentSkinsToCheck.forEach(skinName => {
      const found = skins.find(s => s.name === skinName);
      if (found) {
        console.log(`${skinName}: cost=${found.cost}, hasHiddenTags=${!!found.hiddenTags}`);
      } else {
        console.log(`${skinName}: NOT FOUND`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSkins();