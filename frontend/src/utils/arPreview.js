// Transparent, procedural facial-hair shapes. No face sketches or white backgrounds.
// This preview adds hair; it cannot remove an existing beard.
export const AR_SHAPES = {
  'full-beard': { length: 1.3, mustache: true },
  'short-boxed-beard': { length: 1.02, mustache: true, boxed: true },
  'corporate-beard': { length: 1.08, mustache: true, boxed: true },
  'stubble-3day': { length: 1, mustache: true, stubble: true },
  'goatee': { length: 1.12, chin: true },
  'extended-goatee': { length: 1.12, chin: true, wide: true, mustache: true },
  'circle-beard': { length: 1.05, chin: true, mustache: true, connected: true },
  'van-dyke': { length: 1.25, chin: true, mustache: true, pointed: true },
  'balbo': { length: 1.12, chin: true, wide: true, mustache: true },
  'anchor-beard': { length: 1.12, chin: true, wide: true, mustache: true, pointed: true },
  'ducktail': { length: 1.5, mustache: true, pointed: true },
  'garibaldi': { length: 1.6, mustache: true },
  'bandholz': { length: 1.9, mustache: true },
  'verdi': { length: 1.5, mustache: true, handlebar: true },
  'french-fork': { length: 1.6, mustache: true, fork: true },
  'chin-strap': { strap: true },
  'mutton-chops': { chops: true },
  'beardstache': { length: 1, stubble: true, mustache: true, bigMustache: true },
  'handlebar': { mustache: true, handlebar: true, onlyMustache: true },
  'clean-shaven': { empty: true },
};

export function drawARBeard(ctx, face, slug, opacity = 0.8) {
  const shape = AR_SHAPES[slug];
  if (!shape || !face || shape.empty) return;
  const height = Math.hypot(face.chinTip.x - face.noseTip.x, face.chinTip.y - face.noseTip.y);
  if (!height || !face.jawWidth) return;
  const angle = face.roll * Math.PI / 180;
  const dx = (face.mouthLeft.x + face.mouthRight.x) / 2 - face.noseTip.x;
  const dy = (face.mouthLeft.y + face.mouthRight.y) / 2 - face.noseTip.y;
  const mouthX = (dx * Math.cos(angle) + dy * Math.sin(angle)) / face.jawWidth;
  const mouthY = (-dx * Math.sin(angle) + dy * Math.cos(angle)) / height;
  ctx.save();
  ctx.translate(face.noseTip.x, face.noseTip.y);
  ctx.rotate(angle);
  ctx.scale(face.jawWidth, height);
  ctx.globalAlpha = shape.stubble ? opacity * 0.4 : opacity;
  ctx.fillStyle = '#33251e';
  ctx.strokeStyle = '#33251e';
  ctx.lineJoin = 'round';

  const polygon = points => {
    ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fill();
  };
  if (shape.strap) {
    ctx.lineWidth = 0.055;
    ctx.beginPath();
    ctx.moveTo(-0.44, 0.15); ctx.quadraticCurveTo(-0.4, 0.8, 0, 1);
    ctx.quadraticCurveTo(0.4, 0.8, 0.44, 0.15); ctx.stroke();
  } else if (shape.chops) {
    polygon([[-0.48,0],[-0.32,0.18],[-0.22,0.75],[-0.38,0.83],[-0.48,0.45]]);
    polygon([[0.48,0],[0.32,0.18],[0.22,0.75],[0.38,0.83],[0.48,0.45]]);
  } else if (shape.chin) {
    const width = shape.wide ? 0.3 : 0.16;
    polygon([[-width,mouthY+0.14],[-width,0.93],[shape.pointed?0:-width/2,shape.length],
      [shape.pointed?0:width/2,shape.length],[width,0.93],[width,mouthY+0.14]]);
    if (shape.connected) {
      ctx.lineWidth = 0.06;
      ctx.beginPath(); ctx.ellipse(mouthX,mouthY,0.18,0.2,0,0,Math.PI*2); ctx.stroke();
    }
  } else if (!shape.onlyMustache) {
    polygon([[-0.46,0.15],[-0.23,mouthY+0.04],[-0.14,mouthY+0.16],
      [0.14,mouthY+0.16],[0.23,mouthY+0.04],[0.46,0.15],[0.45,0.73],
      [shape.boxed?0.3:0.25,shape.pointed?1.02:shape.length],
      [0,shape.length],[shape.boxed?-0.3:-0.25,shape.pointed?1.02:shape.length],[-0.45,0.73]]);
    if (shape.fork) {
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      polygon([[0,1.05],[-0.055,shape.length+0.02],[0.055,shape.length+0.02]]); ctx.restore();
    }
  }
  if (shape.mustache) {
    ctx.globalAlpha = opacity;
    const width = shape.handlebar ? 0.25 : shape.bigMustache ? 0.23 : 0.18;
    ctx.beginPath();
    ctx.ellipse(mouthX,mouthY-0.09,width,shape.bigMustache?0.075:0.045,0,0,Math.PI*2);
    ctx.fill();
    if (shape.handlebar) {
      ctx.lineWidth = 0.035;
      ctx.beginPath(); ctx.moveTo(mouthX-width,mouthY-0.09);
      ctx.quadraticCurveTo(mouthX-0.34,mouthY-0.05,mouthX-0.3,mouthY-0.21);
      ctx.moveTo(mouthX+width,mouthY-0.09);
      ctx.quadraticCurveTo(mouthX+0.34,mouthY-0.05,mouthX+0.3,mouthY-0.21); ctx.stroke();
    }
  }
  // Keep the lips visible. Erase only on the isolated transparent overlay canvas.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.ellipse(mouthX,mouthY,0.14,0.04,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

export function captureARFrame(video, overlay) {
  if (!video?.videoWidth || !video?.videoHeight) throw new Error('Kamera još nije spremna.');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const before = canvas.toDataURL('image/jpeg', 0.92);
  if (overlay) ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
  return { before, after: canvas.toDataURL('image/jpeg', 0.92) };
}
