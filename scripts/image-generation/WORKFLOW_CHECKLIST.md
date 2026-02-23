# Beard Sketch Generation Workflow Checklist

## Pre-Requisites

- [ ] ImageMagick installed (`magick --version`)
- [ ] Midjourney account active
- [ ] Photoshop/Figma/GIMP available for alignment check

---

## FAZA 1: TEST (3 stila)

### Step 1.1: Generate Test Images

| Style | MJ Prompt | Generated | Selected Variant |
|-------|-----------|-----------|------------------|
| Full Beard | See MIDJOURNEY_PROMPTS.md #1 | [ ] | U_ |
| Stubble | See MIDJOURNEY_PROMPTS.md #2 | [ ] | U_ |
| Van Dyke | See MIDJOURNEY_PROMPTS.md #3 | [ ] | U_ |

### Step 1.2: Download & Name Files

```
raw/
  full-beard.png
  stubble-3day.png
  van-dyke.png
```

- [ ] Files downloaded
- [ ] Files named correctly

### Step 1.3: Run Post-Processing

```powershell
# Windows
cd scripts/image-generation
.\process-images.ps1 -InputDir ".\raw" -OutputDir ".\processed"
```

```bash
# Mac/Linux
cd scripts/image-generation
chmod +x process-images.sh
./process-images.sh ./raw ./processed
```

- [ ] Script ran successfully
- [ ] 3 WebP files created
- [ ] 3 thumbnails created
- [ ] 3 PNG backups created

---

## FAZA 1: VALIDATION (7 Checkpoints)

### CHECK 1: Crop Konzistentnost

- [ ] Sve 3 slike imaju ISTI crop (od nosa do vrata)
- [ ] Nema ociju vidljivih ni na jednoj

**If FAIL:** Regenerate with stronger `crop tightly` emphasis

### CHECK 2: Kompozicija

- [ ] Kompozicija identicna - samo brada se razlikuje
- [ ] Overlay test passed (jawlines align)

**How to test:**
1. Open all 3 images in Photoshop/Figma
2. Layer them at 50% opacity
3. Check if jawline/chin position matches

### CHECK 3: Boja

- [ ] Pozadina: cista bela (#FFFFFF)
- [ ] Grayscale: bez ikakvih boja

**If color detected:** Run `magick identify -verbose file.png | grep -i color`

### CHECK 4: Kamera

- [ ] Frontalni ugao bez perspektive
- [ ] Simetricna lijeva i desna strana vilice

### CHECK 5: Nos Anchor

- [ ] Nosnice su jedva vidljive na vrhu
- [ ] Identicno pozicionirane na svim slikama

### CHECK 6: Pixel Alignment Test

```
Measure in Photoshop/Figma:
- Distance (px) from top of image to jawline
- Must be identical ±2px across all images
```

| Image | Top-to-Jawline (px) | Pass |
|-------|---------------------|------|
| Full Beard | ___px | [ ] |
| Stubble | ___px | [ ] |
| Van Dyke | ___px | [ ] |

### CHECK 7: Histogram Test

```
Check in Photoshop (Image > Adjustments > Levels):
- All styles should have similar distribution
- If one style has "darker" beard → normalize levels
```

- [ ] Histogram distribution similar
- [ ] Visual weight consistent

---

## FAZA 1: DECISION

**ALL 7 CHECKS PASSED?**

- [ ] **YES** → Proceed to FAZA 2
- [ ] **NO** → Adjust prompts and regenerate

**Notes on what to fix:**
```
[Write your notes here]
```

---

## FAZA 2: BATCH GENERATION (12 stilova)

### Step 2.1: Generate Remaining Styles

| # | Style | Generated | Selected | Processed |
|---|-------|-----------|----------|-----------|
| 4 | Clean Shaven | [ ] | U_ | [ ] |
| 5 | Short Boxed | [ ] | U_ | [ ] |
| 6 | Corporate | [ ] | U_ | [ ] |
| 7 | Goatee | [ ] | U_ | [ ] |
| 8 | Balbo | [ ] | U_ | [ ] |
| 9 | Circle Beard | [ ] | U_ | [ ] |
| 10 | Ducktail | [ ] | U_ | [ ] |
| 11 | Garibaldi | [ ] | U_ | [ ] |
| 12 | Mutton Chops | [ ] | U_ | [ ] |
| 13 | Anchor Beard | [ ] | U_ | [ ] |
| 14 | Chin Strap | [ ] | U_ | [ ] |
| 15 | Beardstache | [ ] | U_ | [ ] |

### Step 2.2: Batch Post-Processing

```powershell
.\process-images.ps1 -InputDir ".\raw" -OutputDir ".\processed"
```

- [ ] All 15 images processed
- [ ] All 15 thumbnails created
- [ ] All 15 PNG backups created

### Step 2.3: Final Quality Check

- [ ] All images 800x800px
- [ ] All thumbnails 400x400px
- [ ] Background pure white on all
- [ ] Grayscale consistent
- [ ] Alignment within ±2px

---

## FAZA 3: ANNOTATED VERSIONS

### Step 3.1: Create Basic Annotations

For each style, add:
- Cheek line (light blue #4A90D9)
- Neckline (light blue #4A90D9)
- Length measurement (mm)

| Style | Annotated Created | Filename |
|-------|-------------------|----------|
| Full Beard | [ ] | full-beard-annotated.webp |
| Stubble | [ ] | stubble-3day-annotated.webp |
| ... | | |

### Step 3.2: Create Advanced Annotations (Optional)

Add to basic:
- Maintenance zones (dashed outline)
- Tool indicators
- Trimming frequency

---

## FAZA 4: DEPLOYMENT

### Step 4.1: Copy to Assets

```powershell
# Copy processed files
Copy-Item ".\processed\*.webp" "..\..\..\frontend\public\assets\sketches\"
Copy-Item ".\processed\thumbnails\*.webp" "..\..\..\frontend\public\assets\thumbnails\"
```

- [ ] Main sketches copied
- [ ] Thumbnails copied
- [ ] Annotated versions copied

### Step 4.2: Verify in App

- [ ] `npm start` in frontend
- [ ] Navigate to beard styles page
- [ ] All images load correctly
- [ ] Annotation toggle works

---

## COMPLETION

- [ ] **All 15 styles generated**
- [ ] **All processed and optimized**
- [ ] **Deployed to assets folder**
- [ ] **Tested in application**

**Completion Date:** ____________

**Notes:**
```
[Final notes here]
```
