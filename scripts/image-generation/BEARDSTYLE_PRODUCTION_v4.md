# BeardStyle — PRODUCTION PROMPT SYSTEM v4.0
## Single Source of Truth — 16 Styles

> **Version:** 4.0 (Consolidated)
> **Date:** 2026-02-15
> **Status:** LOCKED — Do not modify base template or parameters
> **Supersedes:** MIDJOURNEY_PROMPTS.md (V3), BEARDSTYLE_FINAL_PROMPTS.md

---

## CHANGE LOG

| Version | Date | Changes |
|---------|------|---------|
| V3.0 | 2026-02-09 | Initial optimized prompts, 15 styles |
| V3.1 | 2026-02-13 | QA analysis, LOCKED template proven (100% frontal), 16 styles (+Handlebar) |
| **V4.0** | **2026-02-15** | **Consolidated single-source-of-truth. Merged V3 + FINAL into unified copy-paste system. Standardized all 16 styles to LOCKED template. Unified parameters.** |

---

## QA FINDINGS (from V3.1 Generation Testing)

**Old V3 template (Row 1 results):** 50% failure rate on frontal angle, overly artistic, no face identity lock.

**LOCKED template (Row 2-3 results):** 100% success rate on frontal angle, consistent face template, clean technical style.

**Conclusion:** LOCKED template is the only approved template for production.

### Best Seed Candidates (Priority Order)

1. **R3-C3** (Clean Shaven) — cleanest base template, use this seed first
2. **R2-C5** (Stubble) — perfect stippling technique
3. **R2-C2** (Corporate) — ideal medium volume reference
4. **R2-C3** (Van Dyke) — clean disconnect execution
5. **R3-C5** (Beardstache) — excellent contrast

---

## QA CHECKLIST — 5-POINT REJECTION CRITERIA

Every generated image MUST pass all 5 checks:

| # | Check | PASS | FAIL |
|---|-------|------|------|
| 1 | **CROP** | Only lower third of face (nose to neck) | Eyes or forehead visible |
| 2 | **SYMMETRY** | Jaw symmetrical left/right | Rotation or tilt |
| 3 | **COLOR** | Grayscale (black-white only) | Any color present |
| 4 | **BACKGROUND** | Pure white (#FFFFFF) | Background elements |
| 5 | **STYLE-SPECIFIC** | Matches style definition | Wrong characteristics |

### Hard Rules Per Style

| Style | MUST HAVE | MUST NOT HAVE |
|-------|-----------|---------------|
| Clean Shaven | Completely smooth skin | Any hair at all |
| Stubble | Visible skin through hair | Long or full beard |
| Goatee | Completely clean cheeks | Cheek hair |
| Circle Beard | Completely clean cheeks | Cheek hair |
| Van Dyke | Visible GAP mustache-beard | Connected mustache |
| Balbo | 3 separate elements, visible gap | Connected elements |
| Mutton Chops | Clean chin (no hair) | Chin beard or mustache |
| Anchor | Clear anchor silhouette | Full beard or cheek hair |
| Chin Strap | Thin jaw line only | Cheek coverage |
| Full Beard | Full coverage | Patches on cheeks |
| Beardstache | Mustache dominant over beard | Equal length |
| Handlebar | Upward-curved mustache ends | Straight/drooping ends |

---

## LOCKED BASE TEMPLATE

Copy IDENTICALLY for every style. NEVER modify.

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.
```

## LOCKED COLOR BLOCK

Append after every style-specific block:

```
Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.
```

## LOCKED NEGATIVE PROMPT

```
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines
```

## LOCKED PARAMETERS

| Category | Styles | Parameters |
|----------|--------|------------|
| **Standard (1:1)** | Clean Shaven, Stubble, Short Boxed, Corporate, Goatee, Circle, Van Dyke, Balbo, Anchor, Chin Strap, Mutton Chops, Beardstache, Handlebar | `--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1` |
| **Long Beards (3:4)** | Full Beard, Ducktail, Garibaldi | `--style raw --stylize 75 --chaos 0 --ar 3:4 --v 6.1` |

---

## ASSEMBLY INSTRUCTIONS

For each style, combine in this exact order:

```
[LOCKED BASE TEMPLATE]

[STYLE-SPECIFIC BLOCK — from section below]

[LOCKED COLOR BLOCK]

[LOCKED NEGATIVE PROMPT + style extra negatives]
[LOCKED PARAMETERS for that category]
```

---

# ALL 16 STYLES — COPY-PASTE READY

Each section below contains: the style-specific block, extra negatives, and the full assembled prompt ready for Midjourney.

---

## 1. CLEAN SHAVEN (Volume A)

**Style Block:**
```
Beard Volume Scale: A
Completely smooth skin, no facial hair at all.
Zero stubble, zero shadow.
Clean jawline contour with subtle bone structure shading.
Smooth skin texture across entire lower face.
Defined lip contour and chin dimple visible.
```

**Extra negative:** `, stubble, facial hair, beard shadow, any hair`
**Params:** Standard (1:1)
**Filename:** `clean-shaven.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: A
Completely smooth skin, no facial hair at all.
Zero stubble, zero shadow.
Clean jawline contour with subtle bone structure shading.
Smooth skin texture across entire lower face.
Defined lip contour and chin dimple visible.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, stubble, facial hair, beard shadow, any hair
```
</details>

---

## 2. STUBBLE / 3-DAY SHADOW (Volume C)

**Style Block:**
```
Beard Volume Scale: C
2–3mm light stubble across lower face.
Subtle stippling dotwork texture technique.
Visible skin pores and texture through short facial hair.
Even stubble distribution creating subtle shadow effect.
Defined jawline contour showing bone structure beneath.
No long hair, no beard mass.
```

**Extra negative:** `, long beard, full beard, thick beard`
**Params:** Standard (1:1)
**Filename:** `stubble-3day.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: C
2–3mm light stubble across lower face.
Subtle stippling dotwork texture technique.
Visible skin pores and texture through short facial hair.
Even stubble distribution creating subtle shadow effect.
Defined jawline contour showing bone structure beneath.
No long hair, no beard mass.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, long beard, full beard, thick beard
```
</details>

---

## 3. VAN DYKE (Volume E–F)

**Style Block:**
```
Beard Volume Scale: E–F
Pointed chin beard DISCONNECTED from styled mustache.
CRITICAL: Clear visible gap between mustache and chin beard.
Clean shaven skin visible in gap zone.
Elegant pointed shape on chin only.
Completely clean shaven cheeks.
Styled upward-curved mustache ends.
Disconnected. Separated. Gap visible.
```

**Extra negative:** `, connected mustache, goatee, full beard, cheek hair`
**Params:** Standard (1:1)
**Filename:** `van-dyke.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E–F
Pointed chin beard DISCONNECTED from styled mustache.
CRITICAL: Clear visible gap between mustache and chin beard.
Clean shaven skin visible in gap zone.
Elegant pointed shape on chin only.
Completely clean shaven cheeks.
Styled upward-curved mustache ends.
Disconnected. Separated. Gap visible.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, connected mustache, goatee, full beard, cheek hair
```
</details>

---

## 4. SHORT BOXED BEARD (Volume E)

**Style Block:**
```
Beard Volume Scale: E
6–8mm precisely trimmed beard with sharp geometric edges.
Clean defined cheek line with rectangular professional shape.
Sharp neckline with precise angular definition.
Uniform compact density.
Neat professional face with visible precision trimming.
Geometric clean edges.
```

**Extra negative:** `, long beard, natural beard, unkempt, wild`
**Params:** Standard (1:1)
**Filename:** `short-boxed-beard.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E
6–8mm precisely trimmed beard with sharp geometric edges.
Clean defined cheek line with rectangular professional shape.
Sharp neckline with precise angular definition.
Uniform compact density.
Neat professional face with visible precision trimming.
Geometric clean edges.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, long beard, natural beard, unkempt, wild
```
</details>

---

## 5. CORPORATE BEARD (Volume F)

**Style Block:**
```
Beard Volume Scale: F
1–2cm groomed balanced beard.
Balanced proportions with subtle tapering at cheeks.
Professional well-maintained appearance with even density.
Clean defined neckline and cheek lines.
Medium crosshatch shading for controlled volume.
Business-appropriate neat appearance.
```

**Extra negative:** `, long beard, wild beard, unkempt`
**Params:** Standard (1:1)
**Filename:** `corporate-beard.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: F
1–2cm groomed balanced beard.
Balanced proportions with subtle tapering at cheeks.
Professional well-maintained appearance with even density.
Clean defined neckline and cheek lines.
Medium crosshatch shading for controlled volume.
Business-appropriate neat appearance.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, long beard, wild beard, unkempt
```
</details>

---

## 6. GOATEE (Volume E)

**Style Block:**
```
Beard Volume Scale: E
Chin beard connected to mustache forming single unit around mouth.
CRITICAL: Completely clean shaven cheeks with clear visible contrast.
No hair on cheeks whatsoever.
Rounded or pointed lower shape on chin zone only.
Medium density beard mass concentrated around mouth and chin.
Clean cheeks. Clean cheeks. No cheek hair.
```

**Extra negative:** `, cheek hair, full beard, sideburns, cheek coverage`
**Params:** Standard (1:1)
**Filename:** `goatee.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E
Chin beard connected to mustache forming single unit around mouth.
CRITICAL: Completely clean shaven cheeks with clear visible contrast.
No hair on cheeks whatsoever.
Rounded or pointed lower shape on chin zone only.
Medium density beard mass concentrated around mouth and chin.
Clean cheeks. Clean cheeks. No cheek hair.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, cheek hair, full beard, sideburns, cheek coverage
```
</details>

---

## 7. CIRCLE BEARD (Volume E)

**Style Block:**
```
Beard Volume Scale: E
Rounded goatee connecting mustache and chin beard in perfect circular shape around mouth.
CRITICAL: Completely clean shaven cheeks.
Smooth rounded contour forming O-shape.
Symmetrical circular appearance around mouth zone.
Perfect O-shape formed by connected mustache and chin beard.
No cheek hair. Clean cheeks.
```

**Extra negative:** `, cheek hair, full beard, sideburns, angular shape`
**Params:** Standard (1:1)
**Filename:** `circle-beard.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E
Rounded goatee connecting mustache and chin beard in perfect circular shape around mouth.
CRITICAL: Completely clean shaven cheeks.
Smooth rounded contour forming O-shape.
Symmetrical circular appearance around mouth zone.
Perfect O-shape formed by connected mustache and chin beard.
No cheek hair. Clean cheeks.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, cheek hair, full beard, sideburns, angular shape
```
</details>

---

## 8. BALBO (Volume E–F)

**Style Block:**
```
Beard Volume Scale: E–F
Three SEPARATE elements: mustache, chin beard, and soul patch.
CRITICAL: Mustache DISCONNECTED from chin beard.
Visible gap between mustache and floating chin beard below.
Clean shaven cheeks and jawline sides.
Soul patch below lower lip connecting to chin beard.
Disconnected. Separated. Three distinct elements.
Gap visible. Not connected.
```

**Extra negative:** `, connected mustache, goatee, full beard, sideburns, cheek hair`
**Params:** Standard (1:1)
**Filename:** `balbo.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E–F
Three SEPARATE elements: mustache, chin beard, and soul patch.
CRITICAL: Mustache DISCONNECTED from chin beard.
Visible gap between mustache and floating chin beard below.
Clean shaven cheeks and jawline sides.
Soul patch below lower lip connecting to chin beard.
Disconnected. Separated. Three distinct elements.
Gap visible. Not connected.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, connected mustache, goatee, full beard, sideburns, cheek hair
```
</details>

---

## 9. DUCKTAIL (Volume I–J)

**Style Block:**
```
Beard Volume Scale: I–J
Full long beard with pronounced ducktail silhouette.
Length increases toward chin (approx 8–12cm).
Strong taper forming a sharp pointed bottom.
Triangular lower contour.
Full side coverage along jawline.
Dense layered crosshatch shading for depth.
Visible strand direction emphasizing downward taper.
Balanced mass distribution left and right.
```

**Extra negative:** `, rounded bottom, blunt edge, short beard`
**Params:** Long Beards (3:4)
**Filename:** `ducktail.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: I–J
Full long beard with pronounced ducktail silhouette.
Length increases toward chin (approx 8–12cm).
Strong taper forming a sharp pointed bottom.
Triangular lower contour.
Full side coverage along jawline.
Dense layered crosshatch shading for depth.
Visible strand direction emphasizing downward taper.
Balanced mass distribution left and right.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 3:4 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, rounded bottom, blunt edge, short beard
```
</details>

---

## 10. FULL BEARD (Volume J)

**Style Block:**
```
Beard Volume Scale: J
8–12cm dense full beard with natural rounded contour.
Connected mustache flowing seamlessly into beard.
High density coverage from cheeks to chin.
Balanced lower contour.
Visible layered strand texture.
Heavy layered crosshatch for volume and depth.
Natural neckline visible below beard mass.
```

**Extra negative:** `, pointed, trimmed edges, short beard, patchy`
**Params:** Long Beards (3:4)
**Filename:** `full-beard.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: J
8–12cm dense full beard with natural rounded contour.
Connected mustache flowing seamlessly into beard.
High density coverage from cheeks to chin.
Balanced lower contour.
Visible layered strand texture.
Heavy layered crosshatch for volume and depth.
Natural neckline visible below beard mass.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 3:4 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, pointed, trimmed edges, short beard, patchy
```
</details>

---

## 11. GARIBALDI (Volume L)

**Style Block:**
```
Beard Volume Scale: L
15–20cm wide, thick, rounded full beard.
Natural untrimmed lower edge with wild organic texture.
Impressive volume and width extending beyond jawline.
Heavy layered crosshatch for maximum volume and depth.
Rounded bottom shape showing natural fullness and mass.
Wide impressive beard mass.
Maximum density and weight.
```

**Extra negative:** `, trimmed, neat edges, short beard, pointed, geometric`
**Params:** Long Beards (3:4)
**Filename:** `garibaldi.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: L
15–20cm wide, thick, rounded full beard.
Natural untrimmed lower edge with wild organic texture.
Impressive volume and width extending beyond jawline.
Heavy layered crosshatch for maximum volume and depth.
Rounded bottom shape showing natural fullness and mass.
Wide impressive beard mass.
Maximum density and weight.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 3:4 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, trimmed, neat edges, short beard, pointed, geometric
```
</details>

---

## 12. MUTTON CHOPS (Volume G)

**Style Block:**
```
Beard Volume Scale: G (sides only)
Thick prominent sideburns extending to jawline on both sides.
CRITICAL: NO chin beard. Chin is completely clean shaven.
Clean shaven space between sideburns at chin area.
Clean shaven upper lip, no mustache.
Vintage dramatic sideburn look with clear contrast of clean chin.
No chin hair. No mustache. Only side chops.
```

**Extra negative:** `, chin beard, mustache, goatee, full beard, chin hair`
**Params:** Standard (1:1)
**Filename:** `mutton-chops.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: G (sides only)
Thick prominent sideburns extending to jawline on both sides.
CRITICAL: NO chin beard. Chin is completely clean shaven.
Clean shaven space between sideburns at chin area.
Clean shaven upper lip, no mustache.
Vintage dramatic sideburn look with clear contrast of clean chin.
No chin hair. No mustache. Only side chops.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, chin beard, mustache, goatee, full beard, chin hair
```
</details>

---

## 13. ANCHOR BEARD (Volume E)

**Style Block:**
```
Beard Volume Scale: E
Beard shaped like a ship anchor.
Thin soul patch connecting vertically to pointed chin beard.
Chin beard extends horizontally along jawline forming anchor silhouette.
CRITICAL: Clear anchor shape visible.
Styled mustache above, separated from anchor shape below.
Completely clean cheeks.
Vertical soul patch meets horizontal jawline extensions.
```

**Extra negative:** `, full beard, cheek hair, connected mustache, sideburns`
**Params:** Standard (1:1)
**Filename:** `anchor-beard.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: E
Beard shaped like a ship anchor.
Thin soul patch connecting vertically to pointed chin beard.
Chin beard extends horizontally along jawline forming anchor silhouette.
CRITICAL: Clear anchor shape visible.
Styled mustache above, separated from anchor shape below.
Completely clean cheeks.
Vertical soul patch meets horizontal jawline extensions.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, full beard, cheek hair, connected mustache, sideburns
```
</details>

---

## 14. CHIN STRAP (Volume D)

**Style Block:**
```
Beard Volume Scale: D
Thin precise beard line following jawline contour from ear to ear.
CRITICAL: No cheek coverage, only clean defined strip along jaw.
Clean shaven upper cheeks and mustache zone.
Only jawline is defined, everything else clean shaven.
Narrow band of short hair tracing jaw contour.
Thin precise line. No cheek fill. Jaw only.
```

**Extra negative:** `, cheek hair, full beard, mustache, wide beard, thick beard`
**Params:** Standard (1:1)
**Filename:** `chin-strap.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: D
Thin precise beard line following jawline contour from ear to ear.
CRITICAL: No cheek coverage, only clean defined strip along jaw.
Clean shaven upper cheeks and mustache zone.
Only jawline is defined, everything else clean shaven.
Narrow band of short hair tracing jaw contour.
Thin precise line. No cheek fill. Jaw only.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, cheek hair, full beard, mustache, wide beard, thick beard
```
</details>

---

## 15. BEARDSTACHE (Volume F + Dominant Mustache)

**Style Block:**
```
Beard Volume Scale: F
1–2cm shorter beard mass as supporting element.
CRITICAL: Prominent thick mustache as dominant focal point.
Mustache significantly longer and denser than beard.
Clear visible contrast in size between bold thick mustache and shorter trimmed beard.
Beard serves as secondary element, clearly subordinate to mustache.
Bold impressive mustache is the star.
```

**Extra negative:** `, equal mustache and beard, thin mustache, no mustache`
**Params:** Standard (1:1)
**Filename:** `beardstache.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: F
1–2cm shorter beard mass as supporting element.
CRITICAL: Prominent thick mustache as dominant focal point.
Mustache significantly longer and denser than beard.
Clear visible contrast in size between bold thick mustache and shorter trimmed beard.
Beard serves as secondary element, clearly subordinate to mustache.
Bold impressive mustache is the star.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, equal mustache and beard, thin mustache, no mustache
```
</details>

---

## 16. HANDLEBAR (Volume F + Distinctive Mustache)

**Style Block:**
```
Beard Volume Scale: F
Prominent handlebar mustache with distinctive curved upward-pointing ends.
CRITICAL: Mustache ends curve upward and outward in classic handlebar shape.
Medium beard below (1–2cm) as supporting element.
Waxed-looking pointed mustache tips extending beyond lip width.
Clear handlebar silhouette visible.
Upward curves. Pointed tips. Classic handlebar.
```

**Extra negative:** `, straight mustache, drooping mustache, no mustache, thick beard`
**Params:** Standard (1:1)
**Filename:** `handlebar.png`

<details>
<summary>📋 FULL PROMPT (click to expand)</summary>

```
Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck.

The face structure must remain identical across all generations.
Only the beard shape is allowed to change.

Composition:
Crop horizontally just below the nose.
Show only lower nostrils, mustache area, lips, chin, jawline and neckline.
No eyes. No forehead. No upper face. No ears. No hair on head.

Camera:
Perfectly frontal orthographic view.
Zero perspective distortion. No tilt. No rotation.
Perfect bilateral symmetry.

Nose anchor:
Lower nostrils barely visible and identically positioned.

Style:
Professional graphite mechanical pencil illustration.
0.3–0.5 mm controlled line weight.
Clean precise technical linework.
Defined outer silhouette.
Controlled beard edge contour.
Blueprint technical atlas aesthetic.
Instructional barber diagram style.
Non-artistic.

Beard Volume Scale: F
Prominent handlebar mustache with distinctive curved upward-pointing ends.
CRITICAL: Mustache ends curve upward and outward in classic handlebar shape.
Medium beard below (1–2cm) as supporting element.
Waxed-looking pointed mustache tips extending beyond lip width.
Clear handlebar silhouette visible.
Upward curves. Pointed tips. Classic handlebar.

Color:
Neutral grayscale only. Pure white background (#FFFFFF).
Flat clinical lighting. No dramatic shadow.

--style raw --stylize 75 --chaos 0 --ar 1:1 --v 6.1
--no full face, eyes visible, forehead, upper face, ears, photorealistic skin, photography, color, ethnic detail, dramatic lighting, 3D perspective, tilt, rotation, cartoon, anime, watercolor, oil painting, text, watermark, signature, blur, asymmetry, thick outlines, straight mustache, drooping mustache, no mustache, thick beard
```
</details>

---

# BATCH WORKFLOW — RECOMMENDED ORDER

| Batch | Styles | Reason |
|-------|--------|--------|
| **1** | Clean Shaven → extract SEED | Base face reference |
| **2** | Stubble, Short Boxed, Corporate | Similar volumes, easy QA |
| **3** | Goatee, Circle, Van Dyke, Balbo | Disconnected styles — hardest for MJ |
| **4** | Anchor, Chin Strap, Beardstache, Handlebar | Special shapes |
| **5** | Full Beard, Ducktail | Long beards (3:4) |
| **6** | Garibaldi, Mutton Chops | Extreme volumes |

**Per batch:**
1. Generate 4 variants
2. QA against 5-point checklist (crop, symmetry, color, background, style-specific)
3. Upscale best variant
4. Extract seed and use for next style in batch

---

# DESIGN RULES (Quick Reference)

| Condition | Action |
|-----------|--------|
| Length >8 cm | Use 3:4 AR, add "layered hair volume" |
| Stubble (<5 mm) | Force "stippling dotwork, visible skin pores through hair" |
| Disconnected styles | Repeat "clear visible gap / disconnected / separated" 2-3x |
| Ears appearing | Already handled by LOCKED negative prompt |

---

# STATUS TRACKER

| # | Style | Volume | AR | Generated | QA | Seed | Processed | Filename |
|---|-------|--------|----|-----------|-----|------|-----------|----------|
| 1 | Clean Shaven | A | 1:1 | ✅ | ✅ R3-C3 | ____ | ☐ | clean-shaven.png |
| 2 | Stubble | C | 1:1 | ✅ | ✅ R2-C5 | ____ | ☐ | stubble-3day.png |
| 3 | Van Dyke | E–F | 1:1 | ✅ | ✅ R2-C3 | ____ | ☐ | van-dyke.png |
| 4 | Short Boxed | E | 1:1 | ✅ | ⚠️ R2-C6 | ____ | ☐ | short-boxed-beard.png |
| 5 | Corporate | F | 1:1 | ✅ | ✅ R2-C2 | ____ | ☐ | corporate-beard.png |
| 6 | Goatee | E | 1:1 | ☐ | ☐ | ____ | ☐ | goatee.png |
| 7 | Circle Beard | E | 1:1 | ☐ | ☐ | ____ | ☐ | circle-beard.png |
| 8 | Balbo | E–F | 1:1 | ☐ | ☐ | ____ | ☐ | balbo.png |
| 9 | Ducktail | I–J | 3:4 | ✅ | ✅ | ____ | ✅ | ducktail.png |
| 10 | Full Beard | J | 3:4 | ✅ | ✅ R1-C5 | ____ | ✅ | full-beard.png |
| 11 | Garibaldi | L | 3:4 | ✅ | ⚠️ R2-C1 | ____ | ☐ | garibaldi.png |
| 12 | Mutton Chops | G | 1:1 | ☐ | ☐ | ____ | ☐ | mutton-chops.png |
| 13 | Anchor | E | 1:1 | ✅ | ✅ R3-C6 | ____ | ☐ | anchor-beard.png |
| 14 | Chin Strap | D | 1:1 | ✅ | ⚠️ R2-C4 | ____ | ☐ | chin-strap.png |
| 15 | Beardstache | F+ | 1:1 | ✅ | ✅ R3-C5 | ____ | ☐ | beardstache.png |
| 16 | Handlebar | F+ | 1:1 | ☐ | ☐ | ____ | ☐ | handlebar.png |

**Legend:** ✅ = passes | ⚠️ = acceptable with correction | ❌ = regenerate | ☐ = not done

---

# POST-PROCESSING SPECS

| Property | Value |
|----------|-------|
| Main Size | 800×800px |
| Thumbnail Size | 400×400px |
| Output Format | WebP (quality 85) |
| Color Space | Grayscale |
| Background | Pure white (#FFFFFF) |
| Levels | 5%–95% normalized |

For 3:4 images (Full Beard, Garibaldi, Ducktail): crop to 1:1 for grid consistency, OR configure frontend to display 3:4 for long beards.
