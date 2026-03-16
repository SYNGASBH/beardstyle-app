/**
 * SVG icon representing detected face shape.
 * Used in the hero section of ResultsScreen.
 */

const SHAPE_PATHS = {
  oval:     'M40 10c16 0 24 14 24 30s-8 30-24 30S16 56 16 40 24 10 40 10z',
  round:    'M40 12c16 0 28 12 28 28s-12 28-28 28S12 56 12 40 24 12 40 12z',
  square:   'M14 14h52v52H14z',
  heart:    'M40 62L16 38c-4-6-4-14 0-20s12-8 18-4l6 4 6-4c6-4 14-2 18 4s4 14 0 20L40 62z',
  diamond:  'M40 10l22 30-22 30-22-30z',
  oblong:   'M22 10h36v60H22z',
  triangle: 'M40 10l26 52H14z',
}

export function FaceShapeIcon({ shape = 'oval', size = 64 }) {
  const d = SHAPE_PATHS[shape] || SHAPE_PATHS.oval

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={d}
        fill="#f0ebe5"
        stroke="#c4b5a3"
        strokeWidth="2"
        rx="4"
      />
      {/* Eyes hint */}
      <circle cx="32" cy="34" r="2.5" fill="#c4b5a3" />
      <circle cx="48" cy="34" r="2.5" fill="#c4b5a3" />
      {/* Nose hint */}
      <line x1="40" y1="38" x2="40" y2="44" stroke="#c4b5a3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
