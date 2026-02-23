# Beard Sketch Image Generation Pipeline

Complete workflow for generating, processing, and deploying graphite-style beard illustrations.

## Quick Start

```powershell
# 1. Generate images in Midjourney (see MIDJOURNEY_PROMPTS.md)
# 2. Download and place in ./raw folder
# 3. Run the pipeline
.\run-full-pipeline.ps1

# 4. Verify deployment
.\verify-deployment.ps1
```

## Directory Structure

```
scripts/image-generation/
├── raw/                      # Place Midjourney downloads here
├── processed/                # Auto-generated processed images
│   ├── thumbnails/          # 400x400 thumbnails
│   └── png/                 # PNG backups
├── MIDJOURNEY_PROMPTS.md    # Copy-paste prompts for all 15 styles
├── WORKFLOW_CHECKLIST.md    # Step-by-step checklist
├── beard-styles-data.json   # JSON data for API
├── run-full-pipeline.ps1    # Main automation script
├── process-images.ps1       # Image processing only
├── verify-deployment.ps1    # Deployment verification
└── overlay-check.html       # Visual alignment tool
```

## Workflow Steps

### Step 1: Generate Images in Midjourney

1. Open `MIDJOURNEY_PROMPTS.md`
2. Copy the prompt for each style
3. Paste into Midjourney
4. Generate 4 variations
5. Select best (U1-U4)
6. Download as PNG

### Step 2: Prepare Raw Files

Place downloaded images in `./raw/` with these exact names:

| Style | Filename |
|-------|----------|
| Full Beard | `full-beard.png` |
| Stubble | `stubble-3day.png` |
| Van Dyke | `van-dyke.png` |
| Clean Shaven | `clean-shaven.png` |
| Short Boxed | `short-boxed-beard.png` |
| Corporate | `corporate-beard.png` |
| Goatee | `goatee.png` |
| Balbo | `balbo.png` |
| Circle Beard | `circle-beard.png` |
| Ducktail | `ducktail.png` |
| Garibaldi | `garibaldi.png` |
| Mutton Chops | `mutton-chops.png` |
| Anchor Beard | `anchor-beard.png` |
| Chin Strap | `chin-strap.png` |
| Beardstache | `beardstache.png` |

### Step 3: Run Pipeline

```powershell
.\run-full-pipeline.ps1
```

This script:
1. Checks prerequisites (ImageMagick)
2. Processes images (resize, grayscale, normalize)
3. Creates thumbnails (400x400)
4. Validates output
5. Deploys to frontend assets
6. Generates manifest.json

### Step 4: Alignment Check

1. Open `overlay-check.html` in browser
2. Load two processed images
3. Check jawline alignment (should be ±2px)
4. If misaligned, adjust crop manually

### Step 5: Verify Deployment

```powershell
.\verify-deployment.ps1
```

### Step 6: Test in App

```powershell
cd ../../frontend
npm start
```

## Scripts Reference

### run-full-pipeline.ps1

Main automation script. Options:

```powershell
# Skip processing, only deploy
.\run-full-pipeline.ps1 -SkipProcessing

# Skip deployment, only process
.\run-full-pipeline.ps1 -SkipDeploy
```

### process-images.ps1

Process images only:

```powershell
.\process-images.ps1 -InputDir ".\raw" -OutputDir ".\processed"
```

### process-images.sh (Linux/Mac)

```bash
chmod +x process-images.sh
./process-images.sh ./raw ./processed
```

## Image Specifications

| Property | Value |
|----------|-------|
| Main Size | 800x800px |
| Thumbnail Size | 400x400px |
| Format | WebP (quality 85) |
| Color | Grayscale |
| Background | Pure white (#FFFFFF) |
| Levels | 5%-95% normalized |

## Troubleshooting

### ImageMagick not found

```powershell
winget install ImageMagick.ImageMagick
```

### Images not appearing in app

1. Check browser console for 404 errors
2. Verify files exist in `frontend/public/assets/sketches/`
3. Clear browser cache (Ctrl+Shift+R)

### Alignment issues

1. Open `overlay-check.html`
2. Compare problematic image with reference
3. If needed, manually crop in Photoshop to match

### Color appearing in grayscale images

Run:
```powershell
magick identify -verbose image.webp | Select-String "colorspace"
```

Should show `Gray`. If not, reprocess with:
```powershell
magick image.webp -colorspace Gray -normalize output.webp
```

## Database Migration

After deploying images, run the migration:

```sql
-- Connect to your database and run:
\i database/migrations/003_update_sketch_images.sql
```

## Files Modified

- `frontend/src/components/BeardStyleCard.js` - Updated image sources
- `frontend/src/components/BeardSketchImage.js` - New component with annotation toggle
- `database/migrations/003_update_sketch_images.sql` - Image URL updates

## Support

For issues, check:
1. `WORKFLOW_CHECKLIST.md` - Detailed checklist with all 7 checkpoints
2. `GRAPHITE_SKETCH_STYLE_GUIDE.md` - Complete style guide (project root)
