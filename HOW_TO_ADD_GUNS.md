# 🎯 How to Add Gun Pictures and Update Gun Info

## 📁 Directory Structure

```
backend/public/images/          # Backend serves images from here
├── prime-vandal-thumb.jpg      # Thumbnail (small)
├── prime-vandal.jpg            # Full size image
├── elderflame-vandal-thumb.jpg
├── elderflame-vandal.jpg
└── ... (more images)

frontend/public/images/         # Alternative location (if needed)
├── (same structure as backend)
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

## 📝 Updating Gun Information

Edit `backend/server.js` in the `skins` array (starts at line 63):

### **Add New Skin:**
```javascript
{
  id: 29, // Next available ID
  name: "Your Skin Name",
  weaponType: "Vandal", // Vandal, Phantom, Sheriff, etc.
  rarity: "Premium", // Select, Deluxe, Premium, Ultra
  cost: 1775, // VP cost
  collection: "Your Collection Name",
  thumbnailUrl: "/images/your-skin-name-thumb.jpg",
  imageUrl: "/images/your-skin-name.jpg",
  hasColorVariants: true, // true/false
  hasAnimations: true, // true/false
  colorVariants: [
    { name: "Default", color: "#ffffff" },
    { name: "Blue", color: "#4285f4" }
    // Add more variants if hasColorVariants is true
  ],
  description: "Your skin description here."
}
```

### **Weapon Types Available:**
- **Rifles**: Vandal, Phantom, Guardian, Bulldog
- **Sidearms**: Sheriff, Ghost, Classic, Frenzy, Shorty  
- **Snipers**: Operator, Marshal, Outlaw
- **SMGs**: Spectre, Stinger
- **LMGs**: Odin, Ares
- **Shotguns**: Bucky, Judge
- **Melee**: Melee

### **Rarity Types:**
- **Select**: 875 VP (basic tier)
- **Deluxe**: 1275 VP (mid tier) 
- **Premium**: 1775 VP (high tier)
- **Ultra**: 2475+ VP (highest tier)

## 🚀 Quick Steps to Add a New Gun:

1. **Add Images**: Place in `backend/public/images/`
   - `new-skin-thumb.jpg`
   - `new-skin.jpg`

2. **Update Data**: Edit `backend/server.js`, add new object to `skins` array

3. **Restart Server**: Stop and restart your dev server
   ```bash
   npm run dev
   ```

4. **Test**: Check if new skin appears in gallery and modal works

## 🔧 Example: Adding "Glitchpop Vandal"

1. **Add Images:**
   - `backend/public/images/glitchpop-vandal-thumb.jpg`
   - `backend/public/images/glitchpop-vandal.jpg`

2. **Add to server.js:**
   ```javascript
   {
     id: 29,
     name: "Glitchpop Vandal",
     weaponType: "Vandal",
     rarity: "Premium", 
     cost: 2175,
     collection: "Glitchpop Collection",
     thumbnailUrl: "/images/glitchpop-vandal-thumb.jpg",
     imageUrl: "/images/glitchpop-vandal.jpg",
     hasColorVariants: false,
     hasAnimations: true,
     colorVariants: [],
     description: "Cyberpunk aesthetic with digital glitch effects and neon animations."
   }
   ```

3. **Restart and test!**

## 📋 Current Images Needed:

The server.js file references these images that need to be added to `backend/public/images/`:

### Rifles:
- prime-vandal-thumb.jpg, prime-vandal.jpg
- elderflame-vandal-thumb.jpg, elderflame-vandal.jpg  
- reaver-vandal-thumb.jpg, reaver-vandal.jpg
- prime-phantom-thumb.jpg, prime-phantom.jpg
- glitchpop-phantom-thumb.jpg, glitchpop-phantom.jpg
- blastx-guardian-thumb.jpg, blastx-guardian.jpg
- glitchpop-bulldog-thumb.jpg, glitchpop-bulldog.jpg

### Sidearms:
- ion-sheriff-thumb.jpg, ion-sheriff.jpg
- reaver-sheriff-thumb.jpg, reaver-sheriff.jpg
- sovereign-ghost-thumb.jpg, sovereign-ghost.jpg
- prime-classic-thumb.jpg, prime-classic.jpg
- elderflame-frenzy-thumb.jpg, elderflame-frenzy.jpg
- wasteland-shorty-thumb.jpg, wasteland-shorty.jpg

### Snipers:
- prime-operator-thumb.jpg, prime-operator.jpg
- elderflame-operator-thumb.jpg, elderflame-operator.jpg
- sovereign-marshal-thumb.jpg, sovereign-marshal.jpg
- rgx-outlaw-thumb.jpg, rgx-outlaw.jpg

### Shotguns:
- oni-bucky-thumb.jpg, oni-bucky.jpg
- forsaken-judge-thumb.jpg, forsaken-judge.jpg

### SMGs/LMGs:
- recon-spectre-thumb.jpg, recon-spectre.jpg
- surge-stinger-thumb.jpg, surge-stinger.jpg
- prime-odin-thumb.jpg, prime-odin.jpg
- infantry-ares-thumb.jpg, infantry-ares.jpg

### Melee:
- prime-karambit-thumb.jpg, prime-karambit.jpg
- reaver-karambit-thumb.jpg, reaver-karambit.jpg
- champions-butterfly-thumb.jpg, champions-butterfly.jpg
- ruyi-staff-thumb.jpg, ruyi-staff.jpg
- onimaru-sword-thumb.jpg, onimaru-sword.jpg

## 🎯 Pro Tips:
- Use consistent image dimensions for better layout
- Compress images for faster loading
- Test images work by visiting: `http://localhost:5000/images/your-image.jpg`
- Restart backend server after adding new data
- Check browser console for image loading errors