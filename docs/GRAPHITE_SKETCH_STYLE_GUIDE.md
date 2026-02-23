# Grafitne Tehnicke Skice - Stil Guide za Beard Style Advisor

## Koncept

**Tehnička grafitna ilustracija** - ne umjetnička skica, nego precizna, neutralna vizualizacija fokusirana isključivo na bradu.

> **Ocjena koncepta:** 9.7/10 - Industrijski standard sličan Braun/medical atlasima

---

## 1. Vizualni Standardi

### A. Stil Ilustracije

```
Tip: Tehnička grafitna ilustracija (Blueprint stil)
Linija: Čista, precizna, konzistentna debljina
Sjenčanje: Blagi volumen, crosshatch tehnika
Pozadina: Čista bijela ili vrlo svijetlo siva (#FAFAFA)
Fokus: SAMO brada i donji dio lica
```

### B. Šta se MORA vidjeti na svakoj slici

1. **Kontura brade** - jasno definisana linija
2. **Gustoća** - sjenčanje koje pokazuje teksturu
3. **Granice**:
   - Linija obraza
   - Linija vilice
   - Linija vrata
4. **Brk** - povezan ili nepovezan sa bradom
5. **Dužina** - vizualno čitljiva

### C. Šta se NE prikazuje

- **Oči** - uopšte ne prikazivati (extreme close-up)
- **Nos** - samo donji deo nosa/krajevi nosnica
- **Čelo/gornji deo lica** - isečeno iznad nosa
- **Frizura** - ne prikazuje se
- **Emocija/izraz lica** - neutralan prikaz
- **Pozadina/kontekst** - čista bela pozadina
- **Boja kože** - neutralno sivo (grayscale)

---

## 2. Tehnička Specifikacija

### Format i Dimenzije

```
Primarni format: SVG (za line-art) ili WebP (za sjenčane)
Dimenzije: 800x800px (1:1)
Thumbnail: 400x400px
Rezolucija: 72dpi (web) / 300dpi (print)
Pozadina: Transparentna ili #FAFAFA
```

### Boje (Grayscale Paleta)

```css
--sketch-line-primary: #2D2D2D;    /* Glavna linija */
--sketch-line-secondary: #666666;  /* Pomoćne linije */
--sketch-shading-light: #E5E5E5;   /* Lagano sjenčanje */
--sketch-shading-medium: #CCCCCC;  /* Srednje sjenčanje */
--sketch-shading-dark: #999999;    /* Tamno sjenčanje */
--sketch-background: #FAFAFA;      /* Pozadina */
--sketch-annotation: #4A90D9;      /* Oznake/mjere (plava) */
```

---

## 3. AI Prompt Sistem - Trostruka Hijerarhija

### Prompt Struktura

Promptovi su organizovani u **3 modularna bloka** za lakše održavanje i batch generisanje:

```
┌─────────────────────────────────────┐
│  BLOCK 1: LOCKED (nikad se ne mjenja)│
│  - crop                              │
│  - grayscale                         │
│  - no eyes                           │
│  - background                        │
│  - camera angle                      │
│  - nose standardization              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  BLOCK 2: STYLE (tehnika crtanja)   │
│  - graphite                          │
│  - crosshatch                        │
│  - blueprint                         │
│  - line weight                       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  BLOCK 3: BEARD STYLE (varijabilan) │
│  - dužina                            │
│  - oblik                             │
│  - povezanost                        │
│  - gustoća                           │
└─────────────────────────────────────┘
```

---

### BLOCK 1: LOCKED PROMPT (Nikad se ne mijenja)

```
[CROP & COMPOSITION - LOCKED]
Create an extreme close-up technical illustration,
showing ONLY the lower third of face from bottom of nose to neck,
NO eyes visible, NO forehead, NO upper face,
crop tightly to show: mustache area, chin, jawline, and neckline only,
composition: imagine cutting a portrait horizontally below the nose,

[CAMERA ANGLE - LOCKED]
camera angle: perfectly frontal, orthographic-like view,
no perspective distortion, no tilt, no rotation,
symmetrical left and right jaw alignment,

[NOSE STANDARDIZATION - LOCKED]
only the lower nostrils barely visible at top edge,
nostrils cropped identically across all images,

[COLOR & BACKGROUND - LOCKED]
isolated on pure white background (#FFFFFF),
neutral grayscale only - no color, no skin tones,

[TECHNICAL NEUTRALITY - LOCKED]
non-artistic technical reference illustration,
instructional technical diagram, not an artwork,
```

---

### BLOCK 2: STYLE PROMPT (Tehnika crtanja)

```
[DRAWING TECHNIQUE]
professional graphite pencil sketch style with precise clean linework,
subtle crosshatch shading to show volume and texture,
blueprint technical drawing aesthetic,
barber reference diagram style,
high detail on beard hair texture,
```

---

### BLOCK 3: BEARD STYLE PROMPT (Varijabilan - mijenja se po stilu)

```
[BEARD SPECIFIC - EXAMPLE: FULL BEARD]
8-12cm length beard with natural rounded shape and dense even coverage,
connected mustache flowing seamlessly into beard,
covers entire chin and jawline with impressive volume,
high detail on beard hair texture showing fullness,
```

---

### FINAL MASTER PROMPT (Copy-Paste Ready)

```
Create an extreme close-up technical illustration,
showing ONLY the lower third of face from bottom of nose to neck,
NO eyes visible, NO forehead, NO upper face,
crop tightly to show: mustache area, chin, jawline, and neckline only,
camera angle: perfectly frontal, orthographic-like view,
no perspective distortion, no tilt, no rotation,
symmetrical left and right jaw alignment,
only the lower nostrils barely visible at top edge,
nostrils cropped identically across all images,
professional graphite pencil sketch style with precise clean linework,
subtle crosshatch shading to show volume and texture,
isolated on pure white background (#FFFFFF),
blueprint technical drawing aesthetic,
neutral grayscale only - no color, no skin tones,
non-artistic technical reference illustration,
barber reference diagram style,
high detail on beard hair texture,
composition: lower face only as if cutting portrait below nose

[+ BEARD STYLE SPECIFIC ADDITIONS HERE]
```

**IMPORTANT:** Ovaj pristup eliminira problem konzistentnosti lica i fokusira 100% na bradu.

---

### Negative Prompt (Za sve - LOCKED)

```
full face, complete person, eyes visible, forehead showing,
portrait, headshot, photorealistic skin, color photography,
upper face, nose detail, hair on head, ears prominent,
artistic portrait, character art, emotional expression,
wide shot, full head visible, celebrity likeness,
color, skin color, ethnic features, background elements,
cartoon, anime, artistic interpretation, watercolor, oil painting,
low quality, blurry, text, watermark, signature,
tilted angle, rotated view, 3D perspective, asymmetrical composition
```

---

## 4. Promptovi za Svaki Stil Brade

### 1. FULL BEARD (full-beard) - TEST

```
[MASTER PROMPT] +

8-12cm length beard with natural rounded shape and dense even coverage,
connected mustache flowing seamlessly into beard,
covers entire chin and jawline with impressive volume,
high detail on beard hair texture showing fullness
```

**Ključne karakteristike:**
- Puna pokrivenost vilice
- Gusta tekstura
- Prirodni zaobljeni oblik
- Spojeni brk

---

### 2. STUBBLE / 3-DAY SHADOW (stubble-3day) - TEST

```
[MASTER PROMPT] +

very short facial hair 2-3mm creating subtle shadow effect,
light stippling/dotwork texture technique to show short stubble,
skin texture visible through short hair, defined jawline clearly showing,
focus on showing even stubble distribution and length
```

**Ključne karakteristike:**
- Kratka strniška (stippling tehnika)
- Vidljiva linija vilice
- Lagana sjena
- Jednaka gustoća

---

### 3. VAN DYKE (van-dyke) - TEST

```
[MASTER PROMPT] +

pointed chin beard DISCONNECTED from styled upward-curved mustache,
clear visible gap between mustache and chin beard - IMPORTANT separation,
elegant refined pointed shape on chin only,
clean shaven cheeks and upper lip sides visible,
emphasis on showing the disconnection and gap clearly
```

**Ključne karakteristike:**
- Šiljasta bradica
- ODVOJEN brk od brade
- Prazan prostor između
- Stiliziran brk

---

### 4. CLEAN SHAVEN (clean-shaven)

```
[MASTER PROMPT] +

completely smooth skin with no facial hair at all,
clear defined jawline contour showing bone structure,
emphasis on showing smooth clean skin and jaw shape
```

---

### 5. SHORT BOXED BEARD (short-boxed-beard)

```
[MASTER PROMPT] +

precisely trimmed 5-8mm length with sharp geometric edges,
clean defined cheek line and neckline creating squared-off shape,
neat professional appearance with visible precision trimming,
emphasis on sharp edges and geometric precision
```

---

### 6. CORPORATE BEARD (corporate-beard)

```
[MASTER PROMPT] +

medium length 1-2cm with well-maintained neat appearance,
balanced proportions with subtle taper at cheek areas,
professional groomed look with even density throughout,
emphasis on professional neat grooming and balance
```

---

### 7. GOATEE (goatee)

```
[MASTER PROMPT] +

chin beard connected to mustache forming continuous goatee,
clean shaven cheeks with clear visible contrast,
rounded or pointed bottom shape on chin area only,
emphasis on showing clean cheek separation and goatee shape
```

---

### 8. BALBO (balbo)

```
[MASTER PROMPT] +

disconnected mustache and chin beard with NO sideburns,
floating chin beard with soul patch, styled mustache above,
clear gap visible between mustache and chin beard,
clean shaven cheeks and jaw sides showing separation,
emphasis on showing disconnected elements and gaps clearly
```

---

### 9. CIRCLE BEARD (circle-beard)

```
[MASTER PROMPT] +

rounded goatee connecting mustache and chin in perfect circular shape,
clean shaven cheeks with smooth rounded contour,
symmetrical circular appearance around mouth area,
emphasis on perfect circular shape and symmetry
```

---

### 10. DUCKTAIL (ducktail)

```
[MASTER PROMPT] +

full beard with pointed bottom resembling duck tail shape,
longer at chin tapering to distinctive point,
full coverage on sides with triangular bottom shape,
dense texture throughout with emphasis on pointed tip
```

---

### 11. GARIBALDI (garibaldi)

```
[MASTER PROMPT] +

wide thick rounded full beard 15-20cm length,
natural untrimmed bottom edge with wild organic texture,
impressive volume and width extending beyond jawline,
rounded bottom shape showing natural fullness,
emphasis on showing natural untamed fullness and volume
```

---

### 12. MUTTON CHOPS (mutton-chops)

```
[MASTER PROMPT] +

thick prominent sideburns extending down to jawline,
NO chin beard - chin is completely clean shaven (IMPORTANT),
wide flared sideburns creating vintage dramatic look,
clean shaven chin and upper lip area visible,
emphasis on showing sideburn shape and clean shaven chin contrast
```

---

### 13. ANCHOR BEARD (anchor-beard)

```
[MASTER PROMPT] +

anchor-shaped chin beard with thin soul patch,
pointed chin beard extending along jawline forming anchor shape,
styled mustache above creating ship anchor silhouette,
clean shaven cheeks showing anchor form clearly,
emphasis on showing distinctive anchor shape clearly
```

---

### 14. CHIN STRAP (chin-strap)

```
[MASTER PROMPT] +

thin beard line following jawline contour from ear to ear,
no cheek coverage, clean defined stripe along jaw only,
may be connected or disconnected from sideburns,
clean shaven upper cheeks and mustache area,
emphasis on showing precise jaw contour line clearly
```

---

### 15. BEARDSTACHE (beardstache)

```
[MASTER PROMPT] +

prominent thick statement mustache as dominant focal point,
full beard kept noticeably shorter than impressive mustache,
mustache is the star - bold, thick, masculine focal element,
clear contrast in length between mustache and beard,
emphasis on showing mustache dominance and size contrast
```

---

## 5. Test Protocol - 7 Checkpoint Sistem

### FAZA 1: Test (3 stila)

**Generiši prvo:**
1. Full Beard
2. Stubble / 3-Day Shadow
3. Van Dyke

### Checkpoints (SVI moraju proći):

#### CHECK 1: Crop Konzistentnost
- [ ] Sve 3 slike imaju ISTI crop (od nosa do vrata)
- [ ] Nema očiju vidljivih ni na jednoj

#### CHECK 2: Kompozicija
- [ ] Kompozicija identična - samo brada se razlikuje
- [ ] Overlay test: da li se donji nos/vilica poklapaju?

#### CHECK 3: Boja
- [ ] Pozadina: čista bela (#FFFFFF)
- [ ] Grayscale: bez ikakvih boja

#### CHECK 4: Kamera
- [ ] Frontalni ugao bez perspektive
- [ ] Simetrična lijeva i desna strana vilice

#### CHECK 5: Nos Anchor
- [ ] Nosnice su jedva vidljive na vrhu
- [ ] Identično pozicionirane na svim slikama

#### CHECK 6: Pixel Alignment Test (NOVI)
```
Izmjeri:
- distance (px) od vrha slike do linije vilice
- MORA biti identično ±2px na svim slikama

Tool: Photoshop Ruler ili Figma Measure
```

#### CHECK 7: Histogram Test (NOVI)
```
Provjeri grayscale histogram:
- Svi stilovi moraju imati sličnu distribuciju
- Ako jedan stil ima "tamniju" bradu → normalizuj levels
- Tool: Photoshop Levels ili GIMP Curves

Cilj: Konzistentna vizualna težina na svim slikama
```

---

### Ako test NIJE uspješan:

1. Prilagodi promptove (dodaj specifičnije koordinate)
2. Pokušaj sa različitim AI modelom
3. Razmotri ručnu post-produkciju (alignment)
4. Provjeri da li je `camera angle: frontal` uključen

### Ako test JESTE uspješan:

→ Kreni sa **FAZOM 2: Batch Generation**

---

### FAZA 2: Batch Generation (12 stilova)

Generiši preostale stilove **istim promptom strukturom**:
- Clean Shaven
- Short Boxed Beard
- Corporate Beard
- Goatee
- Balbo
- Circle Beard
- Ducktail
- Garibaldi
- Mutton Chops
- Anchor Beard
- Chin Strap
- Beardstache

**Post-Processing za SVE:**
1. Unifikuj pozadinu → #FFFFFF
2. Provjeri dimenzije → tačno 800x800px
3. Pixel alignment provjera → ±2px tolerancija
4. Histogram normalizacija → konzistentni levels
5. Export → WebP (Quality 85) + PNG backup

---

## 6. Annotated Verzije - Dva Nivoa

### BASIC Anotacije (Default u UI)

```
Elementi:
├── Cheek line (linija obraza)
├── Neckline (linija vrata)
└── Length (dužina u mm)
```

**Prompt dodatak za BASIC:**
```
with technical annotation lines in light blue (#4A90D9),
measurement indicators showing:
cheek line boundary, neckline boundary, length measurement in mm
```

---

### ADVANCED Anotacije (Toggle u UI za napredne korisnike)

```
Elementi:
├── Cheek line (linija obraza)
├── Neckline (linija vrata)
├── Length (dužina u mm)
├── Maintenance zone (zona održavanja - highlight)
├── Recommended tool icon (trimmer/brijač/škare)
└── Trimming frequency (weekly/bi-weekly)
```

**Prompt dodatak za ADVANCED:**
```
with detailed technical annotation lines in light blue (#4A90D9),
measurement indicators, dotted guide lines showing:
cheek line boundary, neckline boundary, length measurement,
maintenance zones highlighted with dashed outline,
professional barber reference diagram style with tool indicators
```

---

### UX Implementacija Anotacija

```jsx
// Toggle između nivoa
const [annotationLevel, setAnnotationLevel] = useState('basic'); // 'basic' | 'advanced' | 'none'

// Prikaz odgovarajuće slike
const getImageSrc = (style, level) => {
  if (level === 'none') return `/assets/sketches/${style.slug}.webp`;
  if (level === 'basic') return `/assets/sketches/${style.slug}-annotated.webp`;
  if (level === 'advanced') return `/assets/sketches/${style.slug}-annotated-advanced.webp`;
};
```

---

## 7. Implementacija u Kodu

### Struktura fajlova:

```
frontend/public/assets/
├── sketches/
│   ├── full-beard.webp
│   ├── full-beard-annotated.webp        (BASIC)
│   ├── full-beard-annotated-advanced.webp (ADVANCED)
│   ├── stubble-3day.webp
│   ├── stubble-3day-annotated.webp
│   └── ... (svi stilovi × 3 varijante)
├── thumbnails/
│   ├── full-beard-thumb.webp
│   └── ... (400x400)
└── icons/
    └── beard-icons.svg (sprite)
```

### React komponenta (Optimizovana):

```jsx
import React, { useState } from 'react';

const BeardStyleImage = ({
  style,
  annotationLevel = 'none',  // 'none' | 'basic' | 'advanced'
  showAnnotationToggle = false
}) => {
  const [level, setLevel] = useState(annotationLevel);
  const basePath = '/assets/sketches';

  const getSrc = () => {
    const suffix = level === 'none' ? '' :
                   level === 'basic' ? '-annotated' :
                   '-annotated-advanced';
    return `${basePath}/${style.slug}${suffix}.webp`;
  };

  return (
    <div className="beard-sketch-container">
      {showAnnotationToggle && (
        <div className="annotation-toggle">
          <button
            onClick={() => setLevel('none')}
            className={level === 'none' ? 'active' : ''}
          >
            Čista
          </button>
          <button
            onClick={() => setLevel('basic')}
            className={level === 'basic' ? 'active' : ''}
          >
            Osnovna
          </button>
          <button
            onClick={() => setLevel('advanced')}
            className={level === 'advanced' ? 'active' : ''}
          >
            Detaljna
          </button>
        </div>
      )}

      <picture>
        <source
          srcSet={getSrc()}
          type="image/webp"
        />
        <img
          src={getSrc().replace('.webp', '.png')}
          alt={`${style.name} beard style illustration`}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          className="beard-sketch"
        />
      </picture>
    </div>
  );
};

export default BeardStyleImage;
```

### CSS (Optimizovano):

```css
.beard-sketch-container {
  position: relative;
}

.beard-sketch {
  aspect-ratio: 1 / 1;
  object-fit: contain;
  background: #FAFAFA;
  width: 100%;
  height: auto;
}

.annotation-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.annotation-toggle button {
  padding: 0.5rem 1rem;
  border: 1px solid #E5E5E5;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.annotation-toggle button.active {
  background: #2D2D2D;
  color: white;
  border-color: #2D2D2D;
}

.annotation-toggle button:hover:not(.active) {
  background: #F5F5F5;
}
```

---

## 8. Quick Reference Tabela

| Stil | Glavna Karakteristika | Fokus Prikaza |
|------|----------------------|---------------|
| Full Beard | Puna gustina 8-12cm | Volumen i tekstura |
| Stubble | 2-3mm strniška | Stippling tehnika |
| Van Dyke | Odvojen brk + bradica | GAP između |
| Clean Shaven | Bez dlaka | Glatka koža, vilica |
| Short Boxed | Geometrijske ivice | Oštre linije |
| Corporate | Profesionalna 1-2cm | Balans i urednost |
| Goatee | Brk + bradica spojeno | Čisti obrazi |
| Balbo | Floating chin + brk | Disconnected elementi |
| Circle Beard | Kružni oblik | Simetrija |
| Ducktail | Šiljato dno | Duck tail vrh |
| Garibaldi | Velika 15-20cm | Wild texture |
| Mutton Chops | Samo zalisci | ČISTA brada |
| Anchor | Oblik sidra | Anchor silueta |
| Chin Strap | Linija vilice | Jaw contour |
| Beardstache | Dominantan brk | Mustache + kontrast |

---

## 9. Checklist za Kreiranje

```
LOCKED Elements:
[ ] Camera angle: frontalni, ortografski
[ ] Crop: od nosnica do vrata
[ ] Nosnice: identično pozicionirane
[ ] Pozadina: #FFFFFF
[ ] Boja: grayscale only

STYLE Elements:
[ ] Sve skice imaju isti stil linije
[ ] Konzistentno sjenčanje (crosshatch)
[ ] Blueprint aesthetic

QUALITY Elements:
[ ] Pixel alignment ±2px
[ ] Histogram normalizovan
[ ] WebP format (Quality 85)
[ ] Thumbnail verzije (400x400)
[ ] Annotated verzije (BASIC + ADVANCED)
[ ] Alt tekstovi za accessibility
```

---

## 10. Preporučeni Alati

### AI Generatori:

1. **Midjourney** - Najbolji za konzistentan stil
   - `--style raw` za čistije linije
   - `--no color, photo, realistic`

2. **DALL-E 3** - Dobar za tehničke ilustracije
   - "technical illustration"
   - "pencil sketch style"

3. **Stable Diffusion** - Sa ControlNet
   - lineart ControlNet
   - Konzistentniji rezultati

### Post-Processing:

- **Photoshop** - Histogram, Levels, Alignment
- **Figma** - Pixel measurement, Grid overlay
- **ImageMagick** - Batch processing script

---

## 11. Brand Guidelines

### Ton vizuala (Braun-kompatibilan):
- Profesionalan, ne "cool" ili "edgy"
- Tehnički precizan
- Neutralan i univerzalan
- Premium osjećaj
- Clinical precision
- Instruction-first approach

### Konzistentnost:
- ISTI stil za SVE stilove
- Isti ilustrator/prompt
- Ista paleta boja
- Isti nivo detalja
- Identična kamera pozicija

---

## 12. Batch JSON Generator (Za API)

```json
{
  "styles": [
    {
      "id": "full-beard",
      "name": "Full Beard",
      "prompt_block_3": "8-12cm length beard with natural rounded shape...",
      "characteristics": ["dense", "connected mustache", "rounded"],
      "maintenance": "medium",
      "growth_weeks": 8
    },
    {
      "id": "stubble-3day",
      "name": "3-Day Stubble",
      "prompt_block_3": "very short facial hair 2-3mm creating subtle shadow...",
      "characteristics": ["short", "stippling", "visible jawline"],
      "maintenance": "low",
      "growth_weeks": 0.5
    }
    // ... ostali stilovi
  ],
  "locked_prompt": "[BLOCK 1 + BLOCK 2]",
  "negative_prompt": "[NEGATIVE PROMPT]"
}
```

---

## 13. Sljedeći Koraci

### Korak 1 (Odmah):
- [ ] Test generisati: Full Beard, Stubble, Van Dyke
- [ ] Uraditi overlay test
- [ ] Pixel alignment provjera

### Korak 2:
- [ ] Lock prompt (freeze parametre)
- [ ] Finalizirati MASTER PROMPT

### Korak 3:
- [ ] Batch svih 15 stilova
- [ ] Automatski resize + export script
- [ ] Histogram normalizacija

### Korak 4:
- [ ] UI integracija
- [ ] Annotated toggle (BASIC/ADVANCED)
- [ ] Performance optimizacija

---

**Ovaj guide osigurava konzistentan, profesionalan i diferenciran vizualni identitet za Beard Style Advisor aplikaciju - na nivou industrijskog standarda.**
