import React from 'react';

/**
 * BeardOverlay Component
 *
 * Renders beard style SVG overlays on top of user photos
 * Supports different beard styles with adjustable positioning
 */
const BeardOverlay = ({
  style = 'full-beard',
  opacity = 0.85,
  color = '#2C1810',
  position = { x: 50, y: 50 },
  scale = 1
}) => {

  // Beard style SVG paths - optimized for face overlay
  const beardStyles = {
    'full-beard': {
      viewBox: "0 0 300 400",
      paths: [
        // Jawline beard
        "M 50 150 Q 30 200 30 250 Q 30 300 60 340 Q 90 360 150 370 Q 210 360 240 340 Q 270 300 270 250 Q 270 200 250 150",
        // Mustache
        "M 110 180 Q 120 175 150 175 Q 180 175 190 180 Q 185 185 150 185 Q 115 185 110 180",
        // Soul patch
        "M 140 220 Q 150 225 160 220 L 160 230 Q 150 235 140 230 Z"
      ]
    },
    'corporate-beard': {
      viewBox: "0 0 300 400",
      paths: [
        // Trimmed jawline
        "M 70 170 Q 50 200 50 240 Q 50 280 80 310 Q 110 330 150 335 Q 190 330 220 310 Q 250 280 250 240 Q 250 200 230 170",
        // Short mustache
        "M 115 185 Q 125 182 150 182 Q 175 182 185 185 Q 180 188 150 188 Q 120 188 115 185"
      ]
    },
    'goatee': {
      viewBox: "0 0 300 400",
      paths: [
        // Chin beard only
        "M 120 200 Q 110 220 110 250 Q 110 280 130 300 Q 140 305 150 305 Q 160 305 170 300 Q 190 280 190 250 Q 190 220 180 200",
        // Mustache
        "M 110 180 Q 120 175 150 175 Q 180 175 190 180 Q 185 185 150 185 Q 115 185 110 180"
      ]
    },
    'van-dyke': {
      viewBox: "0 0 300 400",
      paths: [
        // Pointed chin beard
        "M 130 200 Q 125 220 125 240 Q 130 270 145 290 Q 147 295 150 300 Q 153 295 155 290 Q 170 270 175 240 Q 175 220 170 200",
        // Styled mustache
        "M 100 180 Q 115 172 150 172 Q 185 172 200 180 Q 195 185 150 185 Q 105 185 100 180"
      ]
    },
    'stubble': {
      viewBox: "0 0 300 400",
      paths: [
        // Light coverage - using dotted pattern
        "M 60 160 Q 40 200 40 250 Q 40 300 70 340 Q 100 360 150 365 Q 200 360 230 340 Q 260 300 260 250 Q 260 200 240 160"
      ],
      style: {
        strokeDasharray: "2,3",
        strokeWidth: 1.5,
        fill: "none"
      }
    },
    'circle-beard': {
      viewBox: "0 0 300 400",
      paths: [
        // Circle around mouth and chin
        "M 100 175 Q 80 190 80 215 Q 80 240 95 260 Q 110 275 130 280 Q 145 282 150 282 Q 155 282 170 280 Q 190 275 205 260 Q 220 240 220 215 Q 220 190 200 175 Q 180 170 150 170 Q 120 170 100 175"
      ]
    },
    'handlebar': {
      viewBox: "0 0 300 400",
      paths: [
        // Dramatic handlebar mustache
        "M 60 180 Q 80 165 100 165 Q 120 165 140 175 L 150 178 L 160 175 Q 180 165 200 165 Q 220 165 240 180",
        // Curled ends
        "M 50 185 Q 55 175 60 180",
        "M 250 185 Q 245 175 240 180"
      ]
    },
    'balbo': {
      viewBox: "0 0 300 400",
      paths: [
        // Disconnected mustache and beard
        "M 110 180 Q 120 175 150 175 Q 180 175 190 180 Q 185 185 150 185 Q 115 185 110 180",
        // Anchor-shaped chin beard
        "M 110 210 Q 100 230 100 260 Q 105 285 125 300 Q 137 305 150 305 Q 163 305 175 300 Q 195 285 200 260 Q 200 230 190 210",
        // Soul patch connection
        "M 145 190 L 145 210",
        "M 155 190 L 155 210"
      ]
    },
    'mutton-chops': {
      viewBox: "0 0 300 400",
      paths: [
        // Left chop
        "M 40 150 Q 30 180 30 220 Q 30 260 50 290 L 80 280 Q 70 250 70 220 Q 70 180 60 150",
        // Right chop
        "M 260 150 Q 270 180 270 220 Q 270 260 250 290 L 220 280 Q 230 250 230 220 Q 230 180 240 150"
      ]
    },
    'ducktail': {
      viewBox: "0 0 300 400",
      paths: [
        // Full beard with pointed bottom
        "M 50 150 Q 30 200 30 250 Q 30 290 55 325 Q 80 350 120 360 Q 135 365 150 370 Q 165 365 180 360 Q 220 350 245 325 Q 270 290 270 250 Q 270 200 250 150",
        // Mustache
        "M 110 180 Q 120 175 150 175 Q 180 175 190 180 Q 185 185 150 185 Q 115 185 110 180"
      ]
    },
    'clean-shaven': {
      viewBox: "0 0 300 400",
      paths: [
        // Just jawline outline - no beard
        "M 50 160 Q 40 200 40 240 Q 40 280 60 310 Q 90 340 150 345 Q 210 340 240 310 Q 260 280 260 240 Q 260 200 250 160"
      ],
      style: {
        strokeDasharray: "4,4",
        strokeWidth: 1,
        fill: "none",
        opacity: 0.3
      }
    },
    'short-boxed-beard': {
      viewBox: "0 0 300 400",
      paths: [
        // Geometric squared beard with sharp edges
        "M 65 170 L 55 200 L 55 260 L 65 300 L 100 320 L 150 325 L 200 320 L 235 300 L 245 260 L 245 200 L 235 170",
        // Sharp cheek line
        "M 65 170 L 85 175 L 85 200",
        "M 235 170 L 215 175 L 215 200",
        // Mustache
        "M 115 185 Q 125 180 150 180 Q 175 180 185 185 Q 180 190 150 190 Q 120 190 115 185",
        // Sharp neckline
        "M 80 310 L 150 320 L 220 310"
      ]
    },
    'garibaldi': {
      viewBox: "0 0 300 400",
      paths: [
        // Wide thick rounded full beard - very large and natural
        "M 40 150 Q 15 200 15 260 Q 15 320 40 360 Q 70 390 110 400 Q 130 405 150 405 Q 170 405 190 400 Q 230 390 260 360 Q 285 320 285 260 Q 285 200 260 150",
        // Thick mustache
        "M 100 180 Q 115 170 150 170 Q 185 170 200 180 Q 195 190 150 190 Q 105 190 100 180",
        // Wild texture lines
        "M 50 250 Q 60 260 50 280",
        "M 250 250 Q 240 260 250 280",
        "M 150 380 Q 145 390 150 400 Q 155 390 150 380"
      ],
      style: {
        strokeWidth: 2.5
      }
    },
    'anchor-beard': {
      viewBox: "0 0 300 400",
      paths: [
        // Vertical soul patch line
        "M 150 195 L 150 240",
        // Pointed chin beard
        "M 120 240 Q 110 260 115 290 Q 125 310 145 320 Q 148 322 150 325 Q 152 322 155 320 Q 175 310 185 290 Q 190 260 180 240",
        // Horizontal jaw extensions (anchor arms)
        "M 115 290 Q 95 285 75 275",
        "M 185 290 Q 205 285 225 275",
        // Styled mustache (disconnected)
        "M 100 180 Q 115 172 150 172 Q 185 172 200 180 Q 195 186 150 186 Q 105 186 100 180"
      ]
    },
    'chin-strap': {
      viewBox: "0 0 300 400",
      paths: [
        // Thin line following jawline from ear to ear
        "M 45 160 Q 35 200 35 240 Q 35 275 50 300 Q 70 320 100 330 Q 125 335 150 335 Q 175 335 200 330 Q 230 320 250 300 Q 265 275 265 240 Q 265 200 255 160",
        // Inner line to show thin strap
        "M 55 170 Q 48 200 48 240 Q 48 270 60 290 Q 78 308 105 318 Q 128 322 150 322 Q 172 322 195 318 Q 222 308 240 290 Q 252 270 252 240 Q 252 200 245 170"
      ],
      style: {
        strokeWidth: 1.5
      }
    },
    'beardstache': {
      viewBox: "0 0 300 400",
      paths: [
        // DOMINANT thick mustache - the star of the show
        "M 80 175 Q 100 160 150 160 Q 200 160 220 175 Q 215 195 150 195 Q 85 195 80 175",
        // Mustache detail - thick and bold
        "M 90 180 Q 120 170 150 170 Q 180 170 210 180",
        // Shorter, subordinate beard
        "M 60 200 Q 45 230 45 260 Q 45 290 65 315 Q 90 335 150 340 Q 210 335 235 315 Q 255 290 255 260 Q 255 230 240 200",
        // Soul patch connecting mustache to beard
        "M 145 195 L 145 210",
        "M 155 195 L 155 210"
      ],
      style: {
        strokeWidth: 2
      }
    }
  };

  const selectedStyle = beardStyles[style] || beardStyles['full-beard'];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `translate(${position.x}%, ${position.y}%) scale(${scale})`,
        transformOrigin: 'center',
        opacity: opacity
      }}
    >
      <svg
        viewBox={selectedStyle.viewBox}
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        {/* No defs needed - using stroke-only rendering */}

        {/* Render beard paths - stroke only by default, no fill */}
        {selectedStyle.paths.map((pathData, index) => (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={selectedStyle.style?.strokeWidth || 2}
            strokeDasharray={selectedStyle.style?.strokeDasharray}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={selectedStyle.style?.opacity || 1}
          />
        ))}

        {/* Stroke-only rendering - no texture overlay needed */}
      </svg>
    </div>
  );
};

export default BeardOverlay;
