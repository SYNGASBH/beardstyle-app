import React from 'react';
import { createGuideGeometry } from './guideGeometry';

// Animated demonstration layer for one guide step, on the same 800 × 800 plate
// as the illustration and annotations. The tool travels along the real working
// line while that line is drawn in, so the learner sees where and in which
// direction to work. With reduced motion the tool rests at the end of its path.

const DURATION = 4; // seconds per loop

const TOOL_FOR_KIND = {
  neck: 'trimmer', cheeks: 'trimmer', length: 'trimmer', chin: 'trimmer',
  point: 'trimmer', mustache: 'trimmer', shave: 'razor', brush: 'brush', symmetry: null,
};

function motionPath(kind, geometry) {
  switch (kind) {
    case 'neck': return geometry.zones.neck;
    case 'cheeks': return geometry.zones.cheeks;
    case 'length': return 'M280 440 L292 600 M400 452 L400 646 M520 440 L508 600';
    case 'brush': return 'M250 440 L278 538 M400 530 L400 610 M550 440 L522 538';
    case 'shave': return 'M206 360 L214 520 M594 360 L586 520 M300 650 L500 650';
    case 'mustache': return 'M322 450 Q360 470 400 446 Q440 470 478 450';
    case 'symmetry': return 'M400 280 L400 662';
    default: return geometry.zones[kind] || geometry.chin; // chin, point: follow the outline
  }
}

function Tool({ type }) {
  if (type === 'razor') {
    return <g data-tool="razor">
      <rect x="-18" y="-26" width="36" height="10" rx="3" fill="#3f4a55" />
      <rect x="-16" y="-17" width="32" height="3" fill="#cfd8dc" />
      <rect x="-4" y="-14" width="8" height="44" rx="4" fill="#8d6e63" />
    </g>;
  }
  if (type === 'brush') {
    return <g data-tool="brush">
      <ellipse cx="0" cy="-8" rx="22" ry="12" fill="#8d6e63" />
      {[-16, -8, 0, 8, 16].map(x => <line key={x} x1={x} y1="2" x2={x} y2="14" stroke="#4e342e" strokeWidth="2.5" />)}
    </g>;
  }
  return <g data-tool="trimmer">
    <rect x="-13" y="-30" width="26" height="60" rx="11" fill="#37474f" />
    <rect x="-13" y="-30" width="26" height="9" rx="3" fill="#b0bec5" />
    <circle cx="0" cy="6" r="4" fill="#ffb74d" />
  </g>;
}

function endPoint(path) {
  const nums = path.match(/-?\d+(\.\d+)?/g) || ['400', '400'];
  return { x: Number(nums[nums.length - 2]), y: Number(nums[nums.length - 1]) };
}

export default function StepAnimation({ kind, guideId, reducedMotion = false }) {
  const geometry = createGuideGeometry(guideId);
  const path = motionPath(kind, geometry);
  const tool = TOOL_FOR_KIND[kind];
  const shave = kind === 'shave' || kind === 'neck';
  const color = shave ? '#c0392b' : kind === 'brush' || kind === 'symmetry' ? '#2e6f95' : '#b7791f';
  const end = endPoint(path);

  return <svg viewBox={geometry.viewBox} className="ag-step-animation" aria-hidden="true" data-kind={kind}>
    {/* Working line drawn in step with the tool */}
    <path d={path} pathLength="1" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
      className={reducedMotion ? undefined : 'ag-draw'} style={{ animationDuration: `${DURATION}s` }} />
    {kind === 'neck' && <g className="ag-fingers" transform="translate(400 700)">
      <rect x="-30" y="-14" width="60" height="12" rx="6" fill="#e8c4a8" stroke="#8d6e63" />
      <rect x="-30" y="2" width="60" height="12" rx="6" fill="#e8c4a8" stroke="#8d6e63" />
      <text x="40" y="6" fontSize="18" fill="#5d4037">2 prsta</text>
    </g>}
    {kind === 'length' && <g transform="translate(600 690)">
      <rect x="-56" y="-20" width="112" height="34" rx="17" fill="#fff8e1" stroke="#b7791f" />
      <text x="0" y="4" textAnchor="middle" fontSize="18" fill="#7a4f12">12–15 mm</text>
    </g>}
    {kind === 'symmetry' && <g className={reducedMotion ? undefined : 'ag-blink'}>
      <path d="M332 554 L468 554" stroke={color} strokeWidth="4" strokeDasharray="10 8" />
      <circle cx="332" cy="554" r="8" fill={color} /><circle cx="468" cy="554" r="8" fill={color} />
    </g>}
    {tool && (reducedMotion
      ? <g transform={`translate(${end.x} ${end.y})`}><Tool type={tool} /></g>
      : <g><Tool type={tool} /><animateMotion dur={`${DURATION}s`} repeatCount="indefinite" path={path} /></g>)}
  </svg>;
}

export { motionPath, TOOL_FOR_KIND };
