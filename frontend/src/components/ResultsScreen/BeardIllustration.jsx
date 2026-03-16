/**
 * SVG fallback beard illustration when Midjourney imageUrl is not available.
 * Shows a simplified beard silhouette based on style shape.
 */

const PATHS = {
  'full-beard':
    'M20 28c0-4 4-8 12-10s20-2 28 0 12 6 12 10c0 6-4 18-12 24s-16 8-16 8-8-2-16-8S20 34 20 28z',
  goatee:
    'M36 26c-4 0-8 2-10 6s-2 10 0 14 6 8 10 8 8-4 10-8 2-10 0-14-6-6-10-6z',
  stubble:
    'M16 30h48v4c0 8-4 16-12 20s-12 6-12 6-4-2-12-6S16 42 16 34v-4z',
  'van-dyke':
    'M34 24c-2 0-4 2-6 6s-2 12 0 16 4 6 8 6 6-2 8-6 2-12 0-16-6-6-10-6zM24 20h4v6h-4zM52 20h4v6h-4z',
  balbo:
    'M30 30c-2 2-4 8-2 14s6 8 8 8 6-2 8-8-0-12-2-14-6-4-12 0zM22 22h8v4h-8zM50 22h8v4h-8z',
  corporate:
    'M18 30c0-2 6-6 18-6s18 4 18 6c0 4-2 12-8 16s-10 6-10 6-4-2-10-6S18 34 18 30z',
  ducktail:
    'M18 28c0-4 6-8 18-8s18 4 18 8c0 6-2 16-8 22s-10 10-10 10-4-4-10-10S18 34 18 28z',
  default:
    'M20 28c0-4 4-8 16-8s16 4 16 8c0 6-4 14-8 18s-8 6-8 6-4-2-8-6S20 34 20 28z',
}

export function BeardIllustration({ shape = 'default', size = 80 }) {
  const d = PATHS[shape] || PATHS.default

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={d} fill="#c4b5a3" opacity="0.7" />
      {/* Simplified face outline */}
      <ellipse cx="40" cy="30" rx="18" ry="22" stroke="#d4ccc2" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
