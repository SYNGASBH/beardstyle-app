import stylesData from '../data/styles.json'
import { BEARD_STYLES, getStylesForShape } from '../data/beardStyles'

// Build lookup maps
const stylesById = Object.fromEntries(
  stylesData.styles.map(s => [s.id, s])
)
const beardStylesById = Object.fromEntries(
  BEARD_STYLES.map(s => [s.id, s])
)

// Mapiranje Claude slug-ova na beardStyles id-ove
// Claude vraca slug poput 'full-beard', a beardStyles koristi 'puna-brada'
const SLUG_TO_BEARD_ID = {
  'full-beard':       'puna-brada',
  'short-boxed':      'kratka-brada',
  'short-boxed-beard':'kratka-brada',
  'stubble':          'trodnevna-brada',
  'stubble-3day':     'trodnevna-brada',
  'corporate':        'korporativna-brada',
  'corporate-beard':  'korporativna-brada',
  'ducktail':         'ducktail',
  'goatee':           'kozja-bradica',
  'van-dyke':         'van-dyke',
  'balbo':            'balbo',
  'circle-beard':     'kruzna-brada',
  'garibaldi':        'garibaldi',
  'mutton-chops':     'zalisci-brkovi',
  'anchor-beard':     'sidro',
  'chin-strap':       'sidro',
  'beardstache':      'verdi',
}

// Mapiranje Claude outputa -> kljucevi face shape
const SHAPE_ALIASES = {
  oval:         'oval',
  ovalno:       'oval',
  oval_face:    'oval',
  round:        'round',
  okruglo:      'round',
  rounded:      'round',
  square:       'square',
  kvadratno:    'square',
  squared:      'square',
  heart:        'heart',
  srce:         'heart',
  srcoliko:     'heart',
  heart_shaped: 'heart',
  diamond:      'diamond',
  dijamant:     'diamond',
  oblong:       'oblong',
  pravokutno:   'oblong',
  pravougaono:  'oblong',
  rectangular:  'oblong',
  triangle:     'triangle',
  trokutno:     'triangle',
  trougaono:    'triangle',
}

/**
 * Normalize confidence to 0–1 range.
 * Handles: 88, "88.00", 0.88, null
 */
function normalizeConfidence(aiData) {
  const raw = aiData.faceShapeConfidence ?? aiData.confidence ?? null
  if (raw == null) return null
  const num = Number(raw)
  if (isNaN(num)) return null
  // If > 1, it's a percentage (e.g. 88) — convert to 0–1
  return num > 1 ? num / 100 : num
}

function extractJson(text) {
  const stripped = text.replace(/```json\n?|\n?```/gi, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`Neispravan Claude odgovor: ${text.slice(0, 120)}`)
  return JSON.parse(match[0])
}

function normalizeShape(raw) {
  return (raw || '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z_]/g, '')
}

/**
 * Merge Claude AI recommendations with both data sources:
 * - styles.json (technical beard classifier data)
 * - beardStyles.js (UX-rich display data with imageUrl, pros/cons, maintenance)
 *
 * Returns data shaped for ResultsScreen component.
 */
export function mergeRecommendations(claudeRawText) {
  // 1. Parse Claude odgovora
  let aiData
  try {
    aiData = typeof claudeRawText === 'string'
      ? extractJson(claudeRawText)
      : claudeRawText
  } catch (err) {
    console.error('[mergeRecommendations] JSON parse failed:', err.message)
    aiData = { faceShape: 'oval', faceShapeConfidence: 0, recommendedStyles: [] }
  }

  // 2. Normalize face shape
  const rawShape    = aiData.faceShape || aiData.face_shape || aiData.shape || ''
  const normalized  = normalizeShape(rawShape)
  const resolvedKey = SHAPE_ALIASES[normalized] || 'oval'

  if (!SHAPE_ALIASES[normalized]) {
    console.warn(`[mergeRecommendations] Nepoznat oblik "${rawShape}" -> fallback oval`)
  }

  // 3. Build enriched beard styles array for ResultsScreen
  const aiRecs = aiData.recommendedStyles || []

  const mergedStyles = aiRecs.map((rec, idx) => {
    const slug = rec.slug || ''
    const beardId = SLUG_TO_BEARD_ID[slug] || slug
    const beardData = beardStylesById[beardId] || null
    const techData = stylesById[slug] || null

    return {
      // Unique id for React key + selection
      id:         beardId || `ai-${idx}`,
      // Display fields (prefer beardStyles.js, fallback to Claude)
      name:       beardData?.name || rec.styleName,
      shape:      beardData?.shape || slug,
      imageUrl:   beardData?.imageUrl || null,
      desc:       beardData?.desc || rec.reasoning?.slice(0, 100) || '',
      matchLabel: `${rec.matchScore}% poklapanje`,
      why:        beardData?.why || rec.reasoning || '',
      pros:       beardData?.pros || rec.keyBenefits || [],
      cons:       beardData?.cons || [],
      maintenance: beardData?.maintenance || null,
      // Raw AI data
      matchScore:    rec.matchScore,
      reasoning:     rec.reasoning,
      keyBenefits:   rec.keyBenefits || [],
      visualBalance: rec.visualBalance || '',
      // Technical data from styles.json
      techData: techData ? {
        family:      techData.family,
        lengthClass: techData.length_class,
        tags:        techData.ui?.tags || [],
        filters:     techData.ui?.filters || {},
      } : null,
      matched: !!beardData,
    }
  })

  // 4. If Claude returned fewer than 3 styles, fill from beardStyles.js
  if (mergedStyles.length < 3) {
    const existingIds = new Set(mergedStyles.map(s => s.id))
    const fillers = getStylesForShape(resolvedKey)
      .filter(s => !existingIds.has(s.id))
      .slice(0, 3 - mergedStyles.length)
      .map(s => ({
        id:          s.id,
        name:        s.name,
        shape:       s.shape,
        imageUrl:    s.imageUrl,
        desc:        s.desc,
        matchLabel:  s.matchLabel,
        why:         s.why,
        pros:        s.pros,
        cons:        s.cons,
        maintenance: s.maintenance,
        matchScore:  null,
        reasoning:   s.why,
        keyBenefits: s.pros,
        visualBalance: '',
        techData:    null,
        matched:     true,
      }))
    mergedStyles.push(...fillers)
  }

  // 5. Extract features from AI characteristics
  const chars = aiData.facialCharacteristics || {}
  const features = [
    chars.jawlineStructure && `Vilica: ${chars.jawlineStructure}`,
    chars.cheekbones && `Jagodice: ${chars.cheekbones}`,
    chars.foreheadWidth && `Celo: ${chars.foreheadWidth}`,
  ].filter(Boolean)

  // 6. Return shape expected by ResultsScreen
  return {
    aiAnalysis: {
      faceShape:       resolvedKey,
      rawShape:        rawShape,
      confidence:      normalizeConfidence(aiData),
      features:        features,
      characteristics: aiData.facialCharacteristics || null,
      stylingAdvice:   aiData.stylingAdvice || null,
      maintenance:     aiData.maintenanceGuide || null,
      additionalNotes: aiData.additionalNotes || '',
    },
    beardStyles: mergedStyles,
    meta: {
      resolvedFrom:     normalized,
      fallbackUsed:     !SHAPE_ALIASES[normalized],
      totalRecommended: mergedStyles.length,
      matchedWithData:  mergedStyles.filter(s => s.matched).length,
      timestamp:        new Date().toISOString(),
    },
  }
}
