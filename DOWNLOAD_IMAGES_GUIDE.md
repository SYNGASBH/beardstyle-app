# 📸 Beard Style Images - Download Guide

## 🎯 Quick Download (Recommended)

Use this PowerShell script to download all 15 images automatically from Pexels (free, no API key needed):

### PowerShell Script

Open PowerShell in the project directory and run:

```powershell
cd C:\Users\User\Desktop\beard-style-app\frontend\public\assets\styles

# Download all 15 beard style images
$images = @{
  "full-beard.jpg" = "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=800"
  "stubble-3day.jpg" = "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
  "clean-shaven.jpg" = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
  "short-boxed-beard.jpg" = "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800"
  "corporate-beard.jpg" = "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800"
  "goatee.jpg" = "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800"
  "van-dyke.jpg" = "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800"
  "balbo.jpg" = "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800"
  "circle-beard.jpg" = "https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=800"
  "ducktail.jpg" = "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800"
  "garibaldi.jpg" = "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800"
  "mutton-chops.jpg" = "https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=800"
  "anchor-beard.jpg" = "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800"
  "chin-strap.jpg" = "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800"
  "beardstache.jpg" = "https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg?auto=compress&cs=tinysrgb&w=800"
}

foreach ($file in $images.Keys) {
  Write-Host "Downloading $file..."
  Invoke-WebRequest -Uri $images[$file] -OutFile $file
}

Write-Host "`n✅ All images downloaded!"
Write-Host "📁 Location: frontend/public/assets/styles/"
Write-Host "`n🔄 Next: docker-compose restart frontend"
```

---

## 🌐 Manual Download Option

If you prefer to download manually or want different images:

### 1. Full Beard
**Search**: https://www.pexels.com/search/man%20full%20beard%20portrait/
- Look for: Professional man, thick full beard, frontal view
- Download: 800x800 or 1000x1000
- Save as: `full-beard.jpg`

### 2. Stubble / 3-Day Shadow
**Search**: https://www.pexels.com/search/man%20stubble%20portrait/
- Look for: Young man, 2-3mm facial hair, clean look
- Download: 800x800
- Save as: `stubble-3day.jpg`

### 3. Clean Shaven
**Search**: https://www.pexels.com/search/clean%20shaven%20man%20portrait/
- Look for: Professional, smooth skin, no beard
- Download: 800x800
- Save as: `clean-shaven.jpg`

### 4. Short Boxed Beard
**Search**: https://www.pexels.com/search/man%20trimmed%20beard/
- Look for: Short, well-defined edges, modern style
- Download: 800x800
- Save as: `short-boxed-beard.jpg`

### 5. Corporate Beard
**Search**: https://www.pexels.com/search/businessman%20beard/
- Look for: Professional attire, medium beard
- Download: 800x800
- Save as: `corporate-beard.jpg`

### 6. Goatee
**Search**: https://www.pexels.com/search/man%20goatee/
- Look for: Chin beard with mustache, clean cheeks
- Download: 800x800
- Save as: `goatee.jpg`

### 7. Van Dyke
**Search**: https://www.pexels.com/search/man%20pointed%20beard/
- Look for: Pointed chin beard, styled mustache
- Download: 800x800
- Save as: `van-dyke.jpg`

### 8. Balbo
**Search**: https://www.pexels.com/search/man%20beard%20mustache/
- Look for: Disconnected mustache and chin beard
- Download: 800x800
- Save as: `balbo.jpg`

### 9. Circle Beard
**Search**: https://www.pexels.com/search/man%20round%20goatee/
- Look for: Rounded goatee, connected mustache
- Download: 800x800
- Save as: `circle-beard.jpg`

### 10. Ducktail
**Search**: https://www.pexels.com/search/man%20full%20beard%20pointed/
- Look for: Full beard with pointed bottom
- Download: 800x800
- Save as: `ducktail.jpg`

### 11. Garibaldi
**Search**: https://www.pexels.com/search/man%20thick%20full%20beard/
- Look for: Wide, thick, rounded beard
- Download: 800x800
- Save as: `garibaldi.jpg`

### 12. Mutton Chops
**Search**: https://www.pexels.com/search/man%20sideburns/
- Look for: Thick sideburns extending to jaw
- Download: 800x800
- Save as: `mutton-chops.jpg`

### 13. Anchor Beard
**Search**: https://www.pexels.com/search/man%20soul%20patch%20beard/
- Look for: Anchor-shaped chin beard
- Download: 800x800
- Save as: `anchor-beard.jpg`

### 14. Chin Strap
**Search**: https://www.pexels.com/search/man%20jawline%20beard/
- Look for: Thin line along jawline
- Download: 800x800
- Save as: `chin-strap.jpg`

### 15. Beardstache
**Search**: https://www.pexels.com/search/man%20mustache%20full%20beard/
- Look for: Prominent thick mustache with full beard
- Download: 800x800
- Save as: `beardstache.jpg`

---

## 🎨 AI Generation Option

If you want custom-generated images, use the prompts from `AI_IMAGE_PROMPTS.md`:

### Leonardo.ai (Recommended)
1. Go to: https://leonardo.ai
2. Sign up (free tier available)
3. Use prompts from `AI_IMAGE_PROMPTS.md`
4. Generate & download

### Midjourney
1. Discord server: https://discord.gg/midjourney
2. Use `/imagine` command
3. Paste prompts from `AI_IMAGE_PROMPTS.md`

### DALL-E 3
1. ChatGPT Plus: https://chat.openai.com
2. Paste prompts from `AI_IMAGE_PROMPTS.md`

---

## ✅ After Downloading Images

1. **Verify all 15 images are in the correct location:**
   ```
   frontend/public/assets/styles/
   ├── full-beard.jpg
   ├── stubble-3day.jpg
   ├── clean-shaven.jpg
   ├── short-boxed-beard.jpg
   ├── corporate-beard.jpg
   ├── goatee.jpg
   ├── van-dyke.jpg
   ├── balbo.jpg
   ├── circle-beard.jpg
   ├── ducktail.jpg
   ├── garibaldi.jpg
   ├── mutton-chops.jpg
   ├── anchor-beard.jpg
   ├── chin-strap.jpg
   └── beardstache.jpg
   ```

2. **Optimize images (optional but recommended):**
   - Resize to 800x800 or 1000x1000
   - Compress to ~85% quality
   - Convert to WebP for better performance

3. **Restart frontend:**
   ```bash
   docker-compose restart frontend
   ```

4. **Test the gallery:**
   - Visit: http://localhost:3000/gallery
   - All beard styles should show real images instead of emojis

---

## 📊 Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: 800x800px minimum (1000x1000px recommended)
- **Quality**: High resolution, professional photography
- **License**: Free for commercial use (Pexels, Unsplash, or AI-generated)
- **Style**: Frontal portrait, clear view of beard, neutral background

---

## 🚀 Quick Test

After adding images:

```bash
# Check if images exist
cd C:\Users\User\Desktop\beard-style-app\frontend\public\assets\styles
ls

# Should see 15 .jpg files

# Restart frontend
cd ../../../../../
docker-compose restart frontend

# Wait 30 seconds, then visit:
# http://localhost:3000/gallery
```

---

## 🎯 Priority Order

If doing manually, download in this order:

**Must Have (Top 5):**
1. full-beard.jpg
2. stubble-3day.jpg
3. clean-shaven.jpg
4. short-boxed-beard.jpg
5. corporate-beard.jpg

**Should Have (Next 5):**
6. goatee.jpg
7. van-dyke.jpg
8. circle-beard.jpg
9. balbo.jpg
10. beardstache.jpg

**Nice to Have (Remaining 5):**
11. ducktail.jpg
12. garibaldi.jpg
13. mutton-chops.jpg
14. anchor-beard.jpg
15. chin-strap.jpg

---

**Good luck!** 🎨✨
