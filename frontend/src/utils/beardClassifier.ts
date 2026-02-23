import type {
  BeardStyle,
  DetectedAttributes,
  StylePrediction,
  Cheeks,
  Neckline,
  BottomShape,
  Coverage
} from '../types/beard.types';
import stylesData from '../data/styles.json';

const styles = stylesData.styles as BeardStyle[];

/**
 * Decision tree classifier for beard styles
 * Based on visual attributes detected from image
 */
export function classifyBeardStyle(attributes: DetectedAttributes): StylePrediction[] {
  const scores: StylePrediction[] = [];

  for (const style of styles) {
    let score = 0;
    let maxScore = 5; // 5 attributes to match

    const filters = style.ui.filters;

    // Coverage match
    if (filters.coverage === attributes.coverage) {
      score += 1;
    } else if (isPartialCoverageMatch(filters.coverage, attributes.coverage)) {
      score += 0.5;
    }

    // Cheeks match
    if (filters.cheeks === attributes.cheeks) {
      score += 1;
    } else if (isAdjacentCheeks(filters.cheeks, attributes.cheeks)) {
      score += 0.3;
    }

    // Neckline match
    if (filters.neckline === attributes.neckline) {
      score += 1;
    } else if (isAdjacentNeckline(filters.neckline, attributes.neckline)) {
      score += 0.3;
    }

    // Bottom shape match
    if (filters.bottom_shape === attributes.bottom_shape) {
      score += 1;
    } else if (isAdjacentShape(filters.bottom_shape, attributes.bottom_shape)) {
      score += 0.3;
    }

    // Length class match
    if (style.length_class === attributes.length_class) {
      score += 1;
    } else if (isAdjacentLength(style.length_class, attributes.length_class)) {
      score += 0.5;
    }

    scores.push({
      style_id: style.id,
      confidence: score / maxScore
    });
  }

  // Sort by confidence descending
  return scores.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Quick decision tree for primary classification
 * Returns family first, then refines to specific style
 */
export function quickClassify(attributes: DetectedAttributes): {
  family: string;
  candidates: string[];
  reasoning: string[];
} {
  const reasoning: string[] = [];
  let candidates: string[] = [];

  // STEP 1: Check coverage
  if (attributes.coverage === 'none') {
    return {
      family: 'clean_shaven',
      candidates: ['clean-shaven'],
      reasoning: ['No facial hair coverage detected']
    };
  }

  // STEP 2: Cheeks clean or covered?
  if (attributes.cheeks === 'clean') {
    reasoning.push('Clean cheeks detected -> Goatee family or Chin strap');

    // STEP 2a: Chin only or chin+mustache?
    if (attributes.coverage === 'chin_only') {
      reasoning.push('Chin only coverage -> Chin strap or partial styles');
      candidates = ['chin-strap'];

      if (attributes.neckline === 'none') {
        candidates.push('mutton-chops'); // Mutton chops have clean chin
      }

      return { family: 'chin_strap_family', candidates, reasoning };
    }

    // Chin + mustache (goatee family)
    reasoning.push('Chin + mustache coverage -> Goatee family');

    // STEP 2b: Connected or disconnected mustache?
    if (attributes.bottom_shape === 'pointed') {
      reasoning.push('Pointed bottom -> Van Dyke or Anchor');
      candidates = ['van-dyke', 'anchor-beard'];
    } else if (attributes.bottom_shape === 'u_trimmed') {
      reasoning.push('U-shaped trim -> Balbo');
      candidates = ['balbo'];
    } else {
      reasoning.push('Rounded/natural bottom -> Goatee or Circle beard');
      candidates = ['goatee', 'circle-beard'];
    }

    return { family: 'goatee_family', candidates, reasoning };
  }

  // STEP 3: Cheeks covered -> Full beard family or Garibaldi
  reasoning.push('Cheeks covered -> Full beard or Garibaldi');

  // STEP 3a: Check neckline definition (KEY DIFFERENTIATOR)
  if (attributes.neckline === 'none') {
    reasoning.push('No defined neckline -> Garibaldi');
    return {
      family: 'garibaldi',
      candidates: ['garibaldi'],
      reasoning
    };
  }

  // STEP 3b: Neckline defined -> Full beard variants
  reasoning.push('Defined neckline -> Full beard family');

  // STEP 3c: Check bottom shape
  if (attributes.bottom_shape === 'pointed') {
    reasoning.push('Pointed bottom -> Ducktail');
    candidates = ['ducktail'];
  } else if (attributes.bottom_shape === 'u_trimmed') {
    reasoning.push('U-trimmed bottom -> Short boxed or Corporate');
    candidates = ['short-boxed-beard', 'corporate-beard'];
  } else {
    reasoning.push('Rounded/natural bottom -> Full beard');
    candidates = ['full-beard'];
  }

  // STEP 3d: Refine by length
  if (attributes.length_class === 'stubble_2_3mm') {
    reasoning.push('Stubble length detected');
    // Check if mustache dominant
    candidates = ['stubble-3day', 'beardstache'];
  }

  return { family: 'full_beard', candidates, reasoning };
}

/**
 * Get the differentiating question for ambiguous classifications
 */
export function getDifferentiatingQuestion(
  candidateA: string,
  candidateB: string
): string | null {
  const questions: Record<string, Record<string, string>> = {
    'full-beard': {
      'garibaldi': 'Is the neckline clearly defined and trimmed?',
      'ducktail': 'Does the chin come to a point?',
      'corporate-beard': 'Is this for a professional/corporate setting?'
    },
    'goatee': {
      'circle-beard': 'Is the shape more circular/oval around the mouth?',
      'van-dyke': 'Is the mustache disconnected from the chin beard?'
    },
    'van-dyke': {
      'anchor-beard': 'Does the beard extend along the jawline like an anchor?'
    },
    'stubble-3day': {
      'beardstache': 'Is the mustache significantly longer than the stubble?'
    }
  };

  return questions[candidateA]?.[candidateB] ||
         questions[candidateB]?.[candidateA] ||
         null;
}

// Helper functions for partial matches
function isPartialCoverageMatch(a: Coverage, b: Coverage): boolean {
  const order: Coverage[] = ['none', 'chin_only', 'chin_mustache', 'full_lower_face'];
  const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
  return diff === 1;
}

function isAdjacentCheeks(a: Cheeks, b: Cheeks): boolean {
  const order: Cheeks[] = ['clean', 'partial', 'covered'];
  const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
  return diff === 1;
}

function isAdjacentNeckline(a: Neckline, b: Neckline): boolean {
  const order: Neckline[] = ['none', 'soft', 'defined'];
  const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
  return diff === 1;
}

function isAdjacentShape(a: BottomShape, b: BottomShape): boolean {
  // rounded_natural is adjacent to both u_trimmed and pointed
  if (a === 'rounded_natural' || b === 'rounded_natural') {
    return a !== 'none' && b !== 'none';
  }
  return false;
}

function isAdjacentLength(a: string, b: string): boolean {
  const order = [
    'none',
    'stubble_2_3mm',
    'short_10_15mm',
    'medium_20_35mm',
    'long_50_80mm',
    'very_long_gt_80mm'
  ];
  const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
  return diff === 1;
}

export default { classifyBeardStyle, quickClassify, getDifferentiatingQuestion };
