const fs = require('fs');
const path = require('path');
// Read the actual frontend generator so assets and annotations cannot drift.
const source = fs.readFileSync(path.join(__dirname, '../frontend/src/components/academy/guideGeometry.js'), 'utf8');
const createGeometry = new Function(`${source.replace('export function', 'function')}; return createGuideGeometry;`)();
const destination = path.join(__dirname, '../frontend/public/assets/academy/parametric');
fs.mkdirSync(destination, { recursive: true });
for (const style of ['full-beard', 'goatee', 'van-dyke']) {
  const g = createGeometry(style);
  let hairs = '';
  for (let y = 330; y < 690; y += 5) {
    for (let x = 170; x < 640; x += 5) {
      const jitter = ((x * 17 + y * 13) % 11) - 5;
      const bend = (400 - x) * 0.026;
      hairs += `<path d="M${x + jitter} ${y} q${bend.toFixed(2)} 7 ${(bend * 1.4).toFixed(2)} 15"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${g.viewBox}">
<rect width="800" height="800" fill="white"/>
<defs><clipPath id="hair"><path fill-rule="evenodd" d="${g.beard} ${style === 'full-beard' ? g.mouthOpening : ''}"/>${style !== 'full-beard' && g.mustache ? `<path d="${g.mustache}"/>` : ''}</clipPath></defs>
<g fill="none" stroke="#69645e" stroke-width="1.1" stroke-linecap="round">
<path d="M180 330 Q162 258 218 182 Q400 92 582 182 Q638 258 620 330 Q642 540 518 616 Q400 692 282 616 Q158 540 180 330"/>
<path d="M180 340 Q140 310 149 390 Q153 428 181 433 M620 340 Q660 310 651 390 Q647 428 619 433 M282 616 Q287 704 238 747 M518 616 Q513 704 562 747"/>
<path d="M218 306 Q265 285 316 309 M484 309 Q535 285 582 306 M225 322 Q265 342 306 322 M494 322 Q535 342 575 322 M382 316 Q384 371 366 399 Q400 422 434 399 Q416 371 418 316 M342 472 Q400 452 458 472 Q400 500 342 472"/>
<path d="${g.beard}" fill="#eeeae4"/>${g.mustache ? `<path d="${g.mustache}" fill="#eeeae4"/>` : ''}
</g><g clip-path="url(#hair)" fill="none" stroke="#504b46" stroke-width="0.65" opacity="0.85">${hairs}</g>
${style === 'full-beard' ? `<path d="${g.mouthOpening}" fill="white" stroke="#69645e" stroke-width="1.1"/>` : ''}
</svg>`;
  fs.writeFileSync(path.join(destination, `${style}.svg`), svg);
  fs.writeFileSync(path.join(destination, `${style}.zones.json`), JSON.stringify(g, null, 2) + '\n');
}
console.log('Exported 3 matching SVG plates and zone maps.');
