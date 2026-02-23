// ========================================
// BEARD STYLE TYPES
// Auto-generated from JSON Schema
// ========================================

// Style family classification
export type BeardFamily =
  | 'full_beard'
  | 'garibaldi'
  | 'goatee_family'
  | 'mutton_chops_family'
  | 'chin_strap_family'
  | 'clean_shaven'
  | 'stubble';

// Length classification
export type LengthClass =
  | 'none'
  | 'stubble_2_3mm'
  | 'short_10_15mm'
  | 'medium_20_35mm'
  | 'long_50_80mm'
  | 'very_long_gt_80mm';

// UI Filter enums
export type Coverage = 'none' | 'chin_only' | 'chin_mustache' | 'full_lower_face';
export type Cheeks = 'clean' | 'partial' | 'covered';
export type Neckline = 'none' | 'soft' | 'defined';
export type BottomShape = 'none' | 'u_trimmed' | 'rounded_natural' | 'pointed';
export type Maintenance = 'low' | 'medium' | 'high';

// Style rules
export interface StyleRules {
  must: string[];
  must_not: string[];
  notes: string[];
}

// UI filters for filtering/search
export interface StyleFilters {
  coverage: Coverage;
  cheeks: Cheeks;
  neckline: Neckline;
  bottom_shape: BottomShape;
  maintenance: Maintenance;
}

// UI configuration
export interface StyleUI {
  tags: string[];
  filters: StyleFilters;
}

// Complete beard style definition
export interface BeardStyle {
  id: string;
  name: string;
  family: BeardFamily;
  length_class: LengthClass;
  rules: StyleRules;
  ui: StyleUI;
}

// Styles catalog
export interface StylesCatalog {
  $schema?: string;
  version: string;
  generated: string;
  styles: BeardStyle[];
}

// ========================================
// ML PREDICTION TYPES
// ========================================

// Quality scores from validator
export interface QualityScores {
  crop_score: number;       // 0-1, threshold >= 0.90
  symmetry_score: number;   // 0-1, threshold >= 0.85
  background_score: number; // 0-1, threshold >= 0.95
  graphite_score: number;   // 0-1, threshold >= 0.80
  off_spec_score: number;   // 0-1, threshold <= 0.15
}

// Rejection reason codes
export type RejectReason =
  | 'EYES_PRESENT'
  | 'EARS_PRESENT'
  | 'UPPER_FACE_PRESENT'
  | 'PERSPECTIVE_TILT'
  | 'ASYMMETRY'
  | 'BACKGROUND_NOT_WHITE'
  | 'BACKGROUND_ELEMENTS'
  | 'TEXT_WATERMARK'
  | 'NOT_GRAPHITE'
  | 'COLOR_TINT';

// Quality assessment result
export interface QualityAssessment {
  accepted: boolean;
  reasons: RejectReason[];
  scores: QualityScores;
}

// Crop validation
export interface CropValidation {
  only_lower_face: boolean;
  nostrils_visible: boolean;
  eyes_absent: boolean;
  ears_absent: boolean;
}

// Style validation
export interface StyleValidation {
  graphite: boolean;
  grayscale_only: boolean;
  white_background: boolean;
}

// Single prediction entry
export interface StylePrediction {
  style_id: string;
  confidence: number;
}

// Detected attributes
export interface DetectedAttributes {
  coverage: Coverage;
  cheeks: Cheeks;
  neckline: Neckline;
  bottom_shape: BottomShape;
  length_class: LengthClass;
}

// Full prediction result
export interface PredictionResult {
  top1: StylePrediction;
  topk: StylePrediction[];
  attributes: DetectedAttributes;
}

// Complete ML inference output
export interface BeardPrediction {
  image_id: string;
  quality: QualityAssessment;
  crop: CropValidation;
  style: StyleValidation;
  prediction: PredictionResult;
}

// ========================================
// UTILITY TYPES
// ========================================

// For style lookup by ID
export type StylesMap = Record<string, BeardStyle>;

// Filter state for UI
export interface FilterState {
  coverage?: Coverage[];
  cheeks?: Cheeks[];
  neckline?: Neckline[];
  bottom_shape?: BottomShape[];
  maintenance?: Maintenance[];
  search?: string;
}

// Style with image paths
export interface BeardStyleWithImages extends BeardStyle {
  imagePath: string;
  thumbnailPath: string;
  imageExists: boolean;
}
