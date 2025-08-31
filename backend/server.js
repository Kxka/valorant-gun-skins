const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.get('/api/skins', (req, res) => {
  const { weapon, rarity, collection } = req.query;
  let filteredSkins = skins;

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
});

app.get('/api/skins/:id', (req, res) => {
  const skin = skins.find(s => s.id === parseInt(req.params.id));
  if (!skin) {
    return res.status(404).json({ error: 'Skin not found' });
  }
  res.json(skin);
});

app.get('/api/weapons', (req, res) => {
  const weaponTypes = [...new Set(skins.map(skin => skin.weaponType))];
  res.json(weaponTypes);
});

app.get('/api/skins/weapon/:type', (req, res) => {
  const weaponType = req.params.type;
  const weaponSkins = skins.filter(skin => 
    skin.weaponType.toLowerCase() === weaponType.toLowerCase()
  );
  res.json(weaponSkins);
});

const skins = [
  // RIFLES
  {
    id: 1,
    name: "Prime Vandal",
    weaponType: "Vandal",
    rarity: "Premium",
    cost: 1775,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-vandal-thumb.jpg",
    imageUrl: "/images/prime-vandal.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "Sleek and futuristic design with holographic elements and smooth animations."
  },
  {
    id: 2,
    name: "Elderflame Vandal",
    weaponType: "Vandal",
    rarity: "Ultra",
    cost: 2475,
    collection: "Elderflame Collection",
    thumbnailUrl: "/images/elderflame-vandal-thumb.jpg",
    imageUrl: "/images/elderflame-vandal.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Dragon-inspired design with fire effects and roaring sound animations."
  },
  {
    id: 3,
    name: "Reaver Vandal",
    weaponType: "Vandal",
    rarity: "Premium",
    cost: 1775,
    collection: "Reaver Collection",
    thumbnailUrl: "/images/reaver-vandal-thumb.jpg",
    imageUrl: "/images/reaver-vandal.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#8B0000" },
      { name: "Black", color: "#000000" },
      { name: "White", color: "#ffffff" },
      { name: "Red", color: "#FF0000" }
    ],
    description: "Dark, gothic aesthetic with haunting visual effects and eerie animations."
  },
  {
    id: 4,
    name: "Prime Phantom",
    weaponType: "Phantom",
    rarity: "Premium",
    cost: 1775,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-phantom-thumb.jpg",
    imageUrl: "/images/prime-phantom.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "Part of the Prime collection with holographic elements and futuristic design."
  },
  {
    id: 5,
    name: "Glitchpop Phantom",
    weaponType: "Phantom",
    rarity: "Premium",
    cost: 2175,
    collection: "Glitchpop Collection",
    thumbnailUrl: "/images/glitchpop-phantom-thumb.jpg",
    imageUrl: "/images/glitchpop-phantom.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Cyberpunk aesthetic with glitch effects and neon lighting animations."
  },
  {
    id: 6,
    name: "BlastX Guardian",
    weaponType: "Guardian",
    rarity: "Premium",
    cost: 1775,
    collection: "BlastX Collection",
    thumbnailUrl: "/images/blastx-guardian-thumb.jpg",
    imageUrl: "/images/blastx-guardian.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "High-tech semi-automatic rifle with energy effects and precision design."
  },
  {
    id: 7,
    name: "Glitchpop Bulldog",
    weaponType: "Bulldog",
    rarity: "Premium",
    cost: 2175,
    collection: "Glitchpop Collection",
    thumbnailUrl: "/images/glitchpop-bulldog-thumb.jpg",
    imageUrl: "/images/glitchpop-bulldog.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Cyberpunk-themed burst-fire rifle with digital glitch effects."
  },

  // SIDEARMS (PISTOLS)
  {
    id: 8,
    name: "Ion Sheriff",
    weaponType: "Sheriff",
    rarity: "Premium",
    cost: 1775,
    collection: "Ion Collection",
    thumbnailUrl: "/images/ion-sheriff-thumb.jpg",
    imageUrl: "/images/ion-sheriff.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Energy-based design with sci-fi elements and electrical animations."
  },
  {
    id: 9,
    name: "Reaver Sheriff",
    weaponType: "Sheriff",
    rarity: "Premium",
    cost: 1775,
    collection: "Reaver Collection",
    thumbnailUrl: "/images/reaver-sheriff-thumb.jpg",
    imageUrl: "/images/reaver-sheriff.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#8B0000" },
      { name: "Black", color: "#000000" },
      { name: "White", color: "#ffffff" },
      { name: "Red", color: "#FF0000" }
    ],
    description: "Gothic design with dark magic effects and supernatural animations."
  },
  {
    id: 10,
    name: "Sovereign Ghost",
    weaponType: "Ghost",
    rarity: "Premium",
    cost: 1775,
    collection: "Sovereign Collection",
    thumbnailUrl: "/images/sovereign-ghost-thumb.jpg",
    imageUrl: "/images/sovereign-ghost.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#C9AA71" },
      { name: "Gold", color: "#FFD700" },
      { name: "Silver", color: "#C0C0C0" },
      { name: "Purple", color: "#8A2BE2" }
    ],
    description: "Regal design with ornate details and majestic animations."
  },
  {
    id: 11,
    name: "Prime Classic",
    weaponType: "Classic",
    rarity: "Premium",
    cost: 1775,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-classic-thumb.jpg",
    imageUrl: "/images/prime-classic.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "Futuristic pistol design with holographic elements and smooth effects."
  },
  {
    id: 12,
    name: "Elderflame Frenzy",
    weaponType: "Frenzy",
    rarity: "Ultra",
    cost: 2475,
    collection: "Elderflame Collection",
    thumbnailUrl: "/images/elderflame-frenzy-thumb.jpg",
    imageUrl: "/images/elderflame-frenzy.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Dragon-themed automatic pistol with fire effects."
  },
  {
    id: 13,
    name: "Wasteland Shorty",
    weaponType: "Shorty",
    rarity: "Select",
    cost: 875,
    collection: "Wasteland Collection",
    thumbnailUrl: "/images/wasteland-shorty-thumb.jpg",
    imageUrl: "/images/wasteland-shorty.jpg",
    hasColorVariants: false,
    hasAnimations: false,
    colorVariants: [],
    description: "Compact sawed-off shotgun with rugged desert styling."
  },

  // SNIPER RIFLES
  {
    id: 14,
    name: "Prime Operator",
    weaponType: "Operator",
    rarity: "Premium",
    cost: 1775,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-operator-thumb.jpg",
    imageUrl: "/images/prime-operator.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "High-tech sniper rifle with advanced optics and futuristic animations."
  },
  {
    id: 15,
    name: "Elderflame Operator",
    weaponType: "Operator",
    rarity: "Ultra",
    cost: 2475,
    collection: "Elderflame Collection",
    thumbnailUrl: "/images/elderflame-operator-thumb.jpg",
    imageUrl: "/images/elderflame-operator.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Mythical dragon-themed sniper with fire breathing effects and roars."
  },
  {
    id: 16,
    name: "Sovereign Marshal",
    weaponType: "Marshal",
    rarity: "Premium",
    cost: 1775,
    collection: "Sovereign Collection",
    thumbnailUrl: "/images/sovereign-marshal-thumb.jpg",
    imageUrl: "/images/sovereign-marshal.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#C9AA71" },
      { name: "Gold", color: "#FFD700" },
      { name: "Silver", color: "#C0C0C0" },
      { name: "Purple", color: "#8A2BE2" }
    ],
    description: "Ornate sniper rifle with royal design elements."
  },
  {
    id: 17,
    name: "RGX 11z Pro Outlaw",
    weaponType: "Outlaw",
    rarity: "Premium",
    cost: 1775,
    collection: "RGX 11z Pro Collection",
    thumbnailUrl: "/images/rgx-outlaw-thumb.jpg",
    imageUrl: "/images/rgx-outlaw.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Double-barrel sniper rifle with cyberpunk aesthetics and neon effects."
  },

  // SHOTGUNS
  {
    id: 18,
    name: "Oni Bucky",
    weaponType: "Bucky",
    rarity: "Premium",
    cost: 1775,
    collection: "Oni Collection",
    thumbnailUrl: "/images/oni-bucky-thumb.jpg",
    imageUrl: "/images/oni-bucky.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Japanese demon-inspired pump-action shotgun with mystical effects."
  },
  {
    id: 19,
    name: "Forsaken Judge",
    weaponType: "Judge",
    rarity: "Premium",
    cost: 1775,
    collection: "Forsaken Collection",
    thumbnailUrl: "/images/forsaken-judge-thumb.jpg",
    imageUrl: "/images/forsaken-judge.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Automatic shotgun with dark magic and ethereal effects."
  },

  // SMGS
  {
    id: 20,
    name: "Recon Spectre",
    weaponType: "Spectre",
    rarity: "Select",
    cost: 875,
    collection: "Recon Collection",
    thumbnailUrl: "/images/recon-spectre-thumb.jpg",
    imageUrl: "/images/recon-spectre.jpg",
    hasColorVariants: false,
    hasAnimations: false,
    colorVariants: [],
    description: "Military-style SMG with tactical design elements."
  },
  {
    id: 21,
    name: "Surge Stinger",
    weaponType: "Stinger",
    rarity: "Select",
    cost: 875,
    collection: "Surge Collection",
    thumbnailUrl: "/images/surge-stinger-thumb.jpg",
    imageUrl: "/images/surge-stinger.jpg",
    hasColorVariants: false,
    hasAnimations: false,
    colorVariants: [],
    description: "Lightweight SMG with electric wave patterns and energy styling."
  },

  // MACHINE GUNS (LMGS)
  {
    id: 22,
    name: "Prime Odin",
    weaponType: "Odin",
    rarity: "Premium",
    cost: 1775,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-odin-thumb.jpg",
    imageUrl: "/images/prime-odin.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "Futuristic heavy machine gun with holographic elements."
  },
  {
    id: 23,
    name: "Infantry Ares",
    weaponType: "Ares",
    rarity: "Select",
    cost: 875,
    collection: "Infantry Collection",
    thumbnailUrl: "/images/infantry-ares-thumb.jpg",
    imageUrl: "/images/infantry-ares.jpg",
    hasColorVariants: false,
    hasAnimations: false,
    colorVariants: [],
    description: "Military-grade LMG with tactical camouflage and rugged design."
  },

  // MELEE
  {
    id: 24,
    name: "Prime Karambit",
    weaponType: "Melee",
    rarity: "Ultra",
    cost: 4350,
    collection: "Prime Collection",
    thumbnailUrl: "/images/prime-karambit-thumb.jpg",
    imageUrl: "/images/prime-karambit.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#ffffff" },
      { name: "Blue", color: "#4285f4" },
      { name: "Red", color: "#ea4335" },
      { name: "Yellow", color: "#fbbc05" }
    ],
    description: "Holographic karambit knife with futuristic inspect animations."
  },
  {
    id: 25,
    name: "Reaver Karambit",
    weaponType: "Melee",
    rarity: "Ultra",
    cost: 4350,
    collection: "Reaver Collection",
    thumbnailUrl: "/images/reaver-karambit-thumb.jpg",
    imageUrl: "/images/reaver-karambit.jpg",
    hasColorVariants: true,
    hasAnimations: true,
    colorVariants: [
      { name: "Default", color: "#8B0000" },
      { name: "Black", color: "#000000" },
      { name: "White", color: "#ffffff" },
      { name: "Red", color: "#FF0000" }
    ],
    description: "Gothic karambit with dark energy effects and haunting sounds."
  },
  {
    id: 26,
    name: "Champions Butterfly",
    weaponType: "Melee",
    rarity: "Ultra",
    cost: 4350,
    collection: "Champions Collection",
    thumbnailUrl: "/images/champions-butterfly-thumb.jpg",
    imageUrl: "/images/champions-butterfly.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Champions collection butterfly knife with smooth flipping animations."
  },
  {
    id: 27,
    name: "Ruyi Jingu Bang",
    weaponType: "Melee",
    rarity: "Ultra",
    cost: 4350,
    collection: "Monkey King Collection",
    thumbnailUrl: "/images/ruyi-staff-thumb.jpg",
    imageUrl: "/images/ruyi-staff.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Mythical staff with transforming animations and golden effects."
  },
  {
    id: 28,
    name: "Onimaru Kunitsuna",
    weaponType: "Melee",
    rarity: "Ultra",
    cost: 5350,
    collection: "Onimaru Collection",
    thumbnailUrl: "/images/onimaru-sword-thumb.jpg",
    imageUrl: "/images/onimaru-sword.jpg",
    hasColorVariants: false,
    hasAnimations: true,
    colorVariants: [],
    description: "Legendary samurai sword with ghostly aura and traditional craftsmanship."
  }
];

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});