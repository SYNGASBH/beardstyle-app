# Beard Style Renders - Image Upload Guide

## Folder Structure
Place your photorealistic beard style images in this folder.

## Supported Formats (Priority Order)
1. **WebP** (Recommended) - Best compression, modern format
2. **PNG** - Lossless quality, larger files
3. **JPG** - Good compression for photos

## Required Images (15 styles)

| Filename | Style Name |
|----------|------------|
| `full-beard.webp` | Full Beard |
| `stubble.webp` | Stubble (3-Day) |
| `goatee.webp` | Goatee |
| `corporate-beard.webp` | Corporate Beard |
| `van-dyke.webp` | Van Dyke |
| `balbo.webp` | Balbo |
| `circle-beard.webp` | Circle Beard |
| `ducktail.webp` | Ducktail |
| `garibaldi.webp` | Garibaldi |
| `mutton-chops.webp` | Mutton Chops |
| `anchor-beard.webp` | Anchor Beard |
| `chin-strap.webp` | Chin Strap |
| `beardstache.webp` | Beardstache |
| `clean-shaven.webp` | Clean Shaven |
| `short-boxed-beard.webp` | Short Boxed Beard |

## Recommended Image Specifications
- **Resolution**: 800x600px or 1200x900px (4:3 aspect ratio)
- **Format**: WebP with 85% quality
- **File size**: Under 200KB per image

---

## AI Image Generation Prompts

### Option A: Photorealistic Studio Style
```
Hyper-realistic portrait of a handsome male model with a perfectly groomed [STYLE NAME] beard.
Front facing view, neutral gray background, professional studio lighting, 8k resolution,
cinematic quality. Focus on the beard texture and shape. Clean, well-defined beard lines.
```

### Option B: Editorial/Magazine Style
```
Editorial portrait photography of a sophisticated man with a [STYLE NAME] beard style.
Magazine cover quality, soft natural lighting, shallow depth of field,
professional grooming, high fashion aesthetic. 8k, photorealistic.
```

### Option C: Barber Shop Reference Style
```
Professional barber reference photo showing [STYLE NAME] beard style.
Clean white background, even lighting, front view, detailed beard texture visible,
grooming guide quality. High resolution, sharp focus on facial hair details.
```

---

## Style-Specific Prompts

### Full Beard
```
Hyper-realistic portrait of a handsome male model with a perfectly groomed full beard.
Thick, natural coverage on cheeks, jaw, and chin. Well-maintained edges.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Van Dyke
```
Hyper-realistic portrait of a distinguished man with a classic Van Dyke beard.
Goatee connected to a styled mustache, clean shaven cheeks.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Stubble
```
Hyper-realistic portrait of a man with perfect 3-day stubble.
Even, short facial hair growth, rugged but groomed appearance.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Goatee
```
Hyper-realistic portrait of a man with a well-defined goatee.
Facial hair on chin only, clean shaven cheeks and jaw.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Corporate Beard
```
Hyper-realistic portrait of a professional businessman with a neat corporate beard.
Short, well-trimmed, clean edges, business-appropriate grooming.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Balbo
```
Hyper-realistic portrait of a stylish man with a Balbo beard.
Floating mustache with beard on chin extending along jawline, no sideburns.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Circle Beard
```
Hyper-realistic portrait of a man with a classic circle beard.
Rounded goatee connected to mustache forming a circle around the mouth.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Ducktail
```
Hyper-realistic portrait of a man with a distinguished ducktail beard.
Full beard shaped to a point at the chin, resembling a duck's tail.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Garibaldi
```
Hyper-realistic portrait of a man with a full Garibaldi beard.
Wide, rounded bottom, natural and slightly wild appearance, with mustache.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Mutton Chops
```
Hyper-realistic portrait of a man with classic mutton chops.
Sideburns grown long and wide, connected or not to mustache, clean chin.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Anchor Beard
```
Hyper-realistic portrait of a man with an anchor beard.
Pointed beard along jawline and chin forming anchor shape with mustache.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Chin Strap
```
Hyper-realistic portrait of a man with a thin chin strap beard.
Narrow line of facial hair along jawline from ear to ear.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Beardstache
```
Hyper-realistic portrait of a man with a beardstache style.
Prominent, full mustache with light stubble or short beard on face.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Clean Shaven
```
Hyper-realistic portrait of a handsome clean-shaven man.
Smooth skin, no facial hair, well-groomed appearance.
Front facing view, neutral background, studio lighting, 8k resolution.
```

### Short Boxed Beard
```
Hyper-realistic portrait of a man with a short boxed beard.
Neatly trimmed beard with defined cheek lines and square shape.
Front facing view, neutral background, studio lighting, 8k resolution.
```

---

## Fallback Behavior
The app automatically falls back in this order:
1. `/assets/renders/{style}.webp`
2. `/assets/renders/{style}.png`
3. `/assets/renders/{style}.jpg`
4. `/assets/sketches/{style}.svg` (line art sketches)
5. `/assets/sketches/full-beard.svg` (generic fallback)

Just add images to this folder and refresh the page - no code changes needed!
