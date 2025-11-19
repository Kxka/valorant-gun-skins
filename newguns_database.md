# 🎯 New Guns Database - Adding Gun Skins to Database

This document outlines the complete workflow for adding new gun collections to the Valorant Gun Skins database.

## 📁 Key Files

```
valorant-api.txt                # Source API data with all weapon information
backend/data/skins.json         # Main database file (WHERE TO ADD NEW GUNS)
```

## 📋 Complete Workflow (Step-by-Step)

### **Step 1: User Provides Collection Information**
User should provide:
- Collection name (e.g., "ORA by OneTap", "Nanomight")
- Rarity tier (Select, Deluxe, Premium, Exclusive, Ultra)
- Bundle cost (e.g., 9900 VP, 5100 VP)
- Individual weapon costs (if known)

### **Step 2: Search valorant-api.txt for Collection Data**
Use search commands to find all weapons in the collection:
```bash
rg -i "\"displayName\": \"[Collection Name]" "valorant-api.txt"
```

Extract for each weapon:
- UUID (weapon identifier)
- displayName
- contentTierUuid (rarity tier)
- fullRender URL from first chroma (for thumbnailUrl and imageUrl)
- All color variants (chromas) with their URLs
- Animation information (check levels for "Animation" or "SongShuffle")

### **Step 3: Confirm Details with User**
Present to user:
- All weapons found with their types
- Suggested costs based on rarity
- Color variants available
- Animation status
- Bundle description

**Wait for user confirmation before proceeding!**

### **Step 4: Add Weapons to Database**
Open `backend/data/skins.json` and add entries at the end (before the closing `]`)

**IMPORTANT**: Add comma after the previous last entry!

## 📝 Database Structure

The main database is `backend/data/skins.json`. Each weapon entry follows this format:

### **Database Entry Format:**
```javascript
{
  "id": "unique_id_string", // Unique identifier (UUID without hyphens)
  "name": "Weapon Skin Name",
  "weaponType": "Vandal", // Vandal, Phantom, Sheriff, etc.
  "rarity": "Exclusive", // Select, Deluxe, Premium, Exclusive, Ultra
  "cost": 2175, // VP cost or "Battlepass" or "Contract Reward"
  "collection": "Collection Name",
  "thumbnailUrl": "https://media.valorant-api.com/weaponskinchromas/.../fullrender.png",
  "imageUrl": "https://media.valorant-api.com/weaponskinchromas/.../fullrender.png",
  "hasColorVariants": true, // true if has color variants, false otherwise
  "hasAnimations": true, // true if has animation levels, false otherwise
  "colorVariants": [
    {
      "name": "Default Name",
      "color": "#ffffff"
    },
    {
      "name": "Variant Name Level 4\n(Variant 1 Green)",
      "color": "#00FF00"
    }
  ],
  "description": "Bundle Cost 8700", // or other description
  "hiddenTags": [] // Optional tags
}
```

### **Step 5: Validate Database**
After adding all weapons, validate the JSON:
```bash
node -e "try { const data = require('./backend/data/skins.json'); console.log('JSON is valid! Total skins:', data.length); } catch(e) { console.error('JSON Error:', e.message); process.exit(1); }"
```

## 💰 Standard Weapon Costs by Rarity

| Rarity | Regular Weapon | Melee Weapon |
|--------|---------------|--------------|
| Select | 875 VP | 1,750 VP |
| Deluxe | 1,275 VP | 2,550 VP |
| Premium | 1,775 VP | 3,550 VP |
| Exclusive | 2,175 VP | 4,350 VP |
| Ultra | 2,475 VP | 4,950 VP |

**Cost Formats**:
- Store weapons: Use VP number (e.g., `2475`)
- Battlepass items: Use string `"Battlepass"`
- Agent contracts: Use string `"Contract Reward"`

## 📝 Example: Recent Collections Added

### ORA by OneTap Collection (November 2024)
- **Rarity**: Ultra
- **Bundle Cost**: 9900 VP
- **Weapons**: Vandal (2,475 VP), Phantom (2,475 VP), Sheriff (2,475 VP), Operator (2,475 VP), Knife (4,950 VP)
- **Features**: Has animations (Level 3 Animation + Level 5 SongShuffle)
- **Variants**: No color variants (standard only)

### Nanomight Collection (November 2024)
- **Rarity**: Deluxe
- **Bundle Cost**: 5100 VP
- **Weapons**: Phantom (1,275 VP), Frenzy (1,275 VP), Guardian (1,275 VP), Stinger (1,275 VP), Knuckles (2,550 VP)
- **Features**: No animations
- **Variants**: 4 color variants each (Standard, Green, Blue, Pink)

## ⚠️ Important Notes

1. **Always wait for user confirmation** before adding to database
2. **Use exact UUIDs** from valorant-api.txt (no hyphens in the id field)
3. **Validate JSON** after every update
4. **hasColorVariants**: Set to `true` if weapon has color variants, `false` otherwise
5. **hasAnimations**: Set to `true` if weapon has animation levels, `false` otherwise
6. **weaponType**: Use exact weapon names (Vandal, Phantom, Sheriff, Operator, Guardian, Frenzy, Stinger, Odin, etc.)
7. **weaponType for melee**: Always use `"Melee"` for knife/melee weapons
8. **description**: Use format `"Bundle Cost [VP amount]"` for bundle items

## 🔑 Critical: Understanding colorVariants Array

**VERY IMPORTANT**: The `colorVariants` array serves TWO purposes:
1. **Display upgrade levels** - Number of entries shows how many levels the skin has
2. **Show color variants** - Different colors available at max level

### How it Works:
- **Each entry in colorVariants = 1 level displayed on website**
- Weapons with only 1 entry show as "one level only"
- Weapons with multiple entries show multiple levels

### Examples:

#### Example 1: Weapon with 5 Levels, No Color Variants (ORA by OneTap Vandal)
```javascript
"hasColorVariants": false,  // No actual color variants
"hasAnimations": true,
"colorVariants": [
  {
    "name": "ORA by OneTap Vandal",
    "color": "#ffffff"
  },
  {
    "name": "ORA by OneTap Vandal Level 2\n(Sound Effects)",
    "color": "#ffffff"  // Same color
  },
  {
    "name": "ORA by OneTap Vandal Level 3\n(Animation)",
    "color": "#ffffff"  // Same color
  },
  {
    "name": "ORA by OneTap Vandal Level 4\n(Finisher)",
    "color": "#ffffff"  // Same color
  },
  {
    "name": "ORA by OneTap Vandal Level 5\n(Song Shuffle)",
    "color": "#ffffff"  // Same color
  }
]
```
- Has 5 levels (base + Level 2-5)
- All same color (#ffffff)
- Shows as "5 levels" on website

#### Example 2: Weapon with 4 Levels + 3 Color Variants (Glitchpop Odin)
```javascript
"hasColorVariants": true,  // Has color variants
"hasAnimations": true,
"colorVariants": [
  {
    "name": "Glitchpop Odin",
    "color": "#ffffff"
  },
  {
    "name": "Glitchpop Odin Level 4\n(Variant 1 Blue)",
    "color": "#0000FF"  // Different color!
  },
  {
    "name": "Glitchpop Odin Level 4\n(Variant 2 Red)",
    "color": "#FF0000"  // Different color!
  },
  {
    "name": "Glitchpop Odin Level 4\n(Variant 3 Gold)",
    "color": "#FFD700"  // Different color!
  }
]
```
- Has 4 levels (base + Level 2-4)
- At Level 4, unlocks 3 color variants (Blue, Red, Gold)
- Shows as "4 levels with 3 variants" on website

#### Example 3: Weapon with Color Variants Only, No Levels (Nanomight Phantom)
```javascript
"hasColorVariants": true,  // Has color variants
"hasAnimations": false,
"colorVariants": [
  {
    "name": "Nanomight Phantom",
    "color": "#ffffff"
  },
  {
    "name": "Nanomight Phantom\n(Variant 1 Green)",
    "color": "#00FF00"
  },
  {
    "name": "Nanomight Phantom\n(Variant 2 Blue)",
    "color": "#0000FF"
  },
  {
    "name": "Nanomight Phantom\n(Variant 3 Pink)",
    "color": "#FF69B4"
  }
]
```
- Has only 1 base level
- Has 4 color variants total (Standard + 3 variants)
- Shows as "4 variants" on website

### Rules for Adding Weapons:

1. **Check valorant-api.txt for levels**:
   - Count entries in `levels` array
   - Each level = 1 entry in colorVariants

2. **Check for color variants (chromas)**:
   - If weapon has multiple chromas with different colors → `hasColorVariants: true`
   - If all chromas are same color → `hasColorVariants: false`

3. **Add correct number of colorVariants entries**:
   - One entry for base
   - Additional entries for each upgrade level
   - Name each level appropriately (e.g., "Level 2 (Sound Effects)")
   - Use `\n` for line breaks in names

4. **Set correct color values**:
   - If no color variants: all entries use `#ffffff`
   - If has color variants: use appropriate hex colors from API swatch data

