# 🎯 How to Add Gun Skins and Update Gun Info

## 🔄 Current Workflow for Adding New Guns

### **Step 1: Check Valorant API for New Skins**
- Access: https://valorant-api.com/v1/weapons/skins
- Look for new skin collections or individual skins
- Note weapon types, names, costs, and collection information

### **Step 2: Update Text Files**
- Navigate to `gundata/` folder
- Update appropriate txt file based on rarity and type:
  - `select_gun_info.txt` - Select rarity store skins
  - `deluxe_gun_info.txt` - Deluxe rarity store skins
  - `premium_gun_info.txt` - Premium rarity store skins
  - `exclusive_gun_info.txt` - Exclusive rarity store skins
  - `ultra_gun_info.txt` - Ultra rarity store skins
  - `select_battlepass_info.txt` - Select rarity battlepass skins
  - `deluxe_battlepass_info.txt` - Deluxe rarity battlepass skins
  - `misc_gun_info.txt` - Special/misc skins (Champions, VCT, etc.)
- Add weapon info following existing format
- Update total weapon count for collections

### **Step 3: Update Database**
- Update `backend/data/skins.json` to match txt files exactly
- Txt files are the authoritative source
- Add new weapon entries with proper structure

## 📁 Directory Structure

```
gundata/                        # Text files with weapon info (authoritative source)
├── select_gun_info.txt         # Select rarity store skins
├── deluxe_gun_info.txt         # Deluxe rarity store skins
├── premium_gun_info.txt        # Premium rarity store skins
├── exclusive_gun_info.txt      # Exclusive rarity store skins
├── ultra_gun_info.txt          # Ultra rarity store skins
├── select_battlepass_info.txt  # Select rarity battlepass skins
├── deluxe_battlepass_info.txt  # Deluxe rarity battlepass skins
└── misc_gun_info.txt           # Special/misc skins (Champions, VCT, etc.)

backend/data/skins.json         # Main database file
backend/public/images/          # Backend serves images from here
├── prime-vandal-thumb.jpg      # Thumbnail (small)
├── prime-vandal.jpg            # Full size image
└── ... (more images)
```

## 🖼️ Image Requirements

### **Image Formats:**
- `.jpg`, `.png`, `.webp` supported
- **Thumbnails**: 400x300px recommended
- **Full Images**: 800x600px or higher

### **Naming Convention:**
- Thumbnail: `{skin-name}-thumb.{ext}`
- Full Image: `{skin-name}.{ext}`
- Use lowercase with hyphens (e.g., `prime-vandal-thumb.jpg`)

## 📝 Database Structure

The main database is `backend/data/skins.json`. Each weapon entry follows this format:

### **Database Entry Format:**
```javascript
{
  "id": "unique_id_string", // Unique identifier
  "name": "Weapon Skin Name",
  "weaponType": "Vandal", // Vandal, Phantom, Sheriff, etc.
  "rarity": "Exclusive", // Select, Deluxe, Premium, Exclusive, Ultra
  "cost": 2175, // VP cost or "Battlepass" or "Contract Reward"
  "collection": "Collection Name",
  "thumbnailUrl": "https://media.valorant-api.com/weaponskinchromas/.../fullrender.png",
  "imageUrl": "https://media.valorant-api.com/weaponskinchromas/.../fullrender.png",
  "hasColorVariants": true, // true/false
  "hasAnimations": true, // true/false
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

## 🚀 Complete Workflow Example: Adding "Prelude to Chaos" Weapons

### **Step 1: Check API**
```bash
# Check Valorant API for new skins
curl https://valorant-api.com/v1/weapons/skins
```

### **Step 2: Update Text File**
Add to `gundata/exclusive_gun_info.txt`:
```
**PRELUDE TO CHAOS COLLECTION**
Total weapons: 10
/ replace all weapon descpriton to Bundle Cost 8700

Sheriffs:
  Prelude to Chaos Sheriff    Valorant Points 2,175
    Prelude to Chaos Sheriff - Ultra skin for Sheriff

Melees:
  Blade of Chaos    Valorant Points 4,350
    Blade of Chaos - Ultra skin for Melee
  Flail of Chaos    Valorant Points 4,350
    Flail of Chaos - Ultra skin for Melee
```

### **Step 3: Update Database**
Add entries to `backend/data/skins.json` following the format above.

## 💡 Important Notes

- **TXT Files are Authoritative**: Always update txt files first, then sync database
- **Cost Formats**: Use `2175` for VP, `"Battlepass"` for battlepass items, `"Contract Reward"` for agent contracts
- **Collection Consistency**: Ensure collection names match exactly between txt files and database
- **ID Generation**: Use descriptive IDs like `"prelude_chaos_sheriff_2024"`

## 🔧 Testing

1. **Restart Server**: After database changes
   ```bash
   npm start
   ```

2. **Verify**: Check that new skins appear correctly in the gallery
3. **Validate JSON**: Ensure database syntax is valid after edits

