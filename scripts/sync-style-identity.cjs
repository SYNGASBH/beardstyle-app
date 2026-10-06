// Frontend catalog is authoritative; backend copy keeps separate Docker builds working.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'frontend/src/data/styleIdentity.json');
const target = path.join(root, 'backend/src/data/styleIdentity.json');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(source, 'utf8') !== fs.readFileSync(target, 'utf8')) {
    throw new Error('Catalog copies differ. Run node scripts/sync-style-identity.cjs');
  }
} else {
  fs.copyFileSync(source, target);
}
