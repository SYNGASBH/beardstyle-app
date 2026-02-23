/**
 * Convert PNG/JPG beard sketches to WebP format
 * Scans all 16 style folders in ./raw/ automatically
 * Usage: node convert-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RAW_DIR = './raw';
const OUTPUT_DIR = '../../frontend/public/assets/sketches';
const THUMB_DIR = '../../frontend/public/assets/thumbnails';
const MAIN_SIZE = 800;
const THUMB_SIZE = 200;
const QUALITY = 85;

function discoverStyles() {
  return fs.readdirSync(RAW_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{2}-/.test(d.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(d => {
      const slug = d.name.replace(/^\d{2}-/, '');
      const folderPath = path.join(RAW_DIR, d.name);
      const images = fs.readdirSync(folderPath)
        .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
        .sort();
      return { folder: d.name, slug, folderPath, images };
    });
}

async function convertImage(inputPath, outputPath, size) {
  await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .grayscale()
    .normalise()
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  return fs.statSync(outputPath).size;
}

async function processStyle(style) {
  if (style.images.length === 0) {
    console.log(`  -- ${style.folder} (${style.slug}) — no images, skipping`);
    return null;
  }

  // Use first image found in the folder
  const srcFile = style.images[0];
  const inputPath = path.join(style.folderPath, srcFile);
  const mainOut = path.join(OUTPUT_DIR, `${style.slug}.webp`);
  const thumbOut = path.join(THUMB_DIR, `${style.slug}-thumb.webp`);

  try {
    const mainSize = await convertImage(inputPath, mainOut, MAIN_SIZE);
    const thumbSize = await convertImage(inputPath, thumbOut, THUMB_SIZE);

    console.log(
      `  OK ${style.folder} — ${srcFile} -> ${style.slug}.webp (${Math.round(mainSize / 1024)}KB) + thumb (${Math.round(thumbSize / 1024)}KB)`
    );

    return {
      slug: style.slug,
      main: `/assets/sketches/${style.slug}.webp`,
      thumbnail: `/assets/thumbnails/${style.slug}-thumb.webp`,
      exists: true,
      thumbnailExists: true,
    };
  } catch (err) {
    console.error(`  FAIL ${style.folder} — ${err.message}`);
    return {
      slug: style.slug,
      main: `/assets/sketches/${style.slug}.webp`,
      thumbnail: `/assets/thumbnails/${style.slug}-thumb.webp`,
      exists: false,
      thumbnailExists: false,
    };
  }
}

async function main() {
  console.log('\nConverting beard sketches to WebP...\n');

  // Ensure output directories exist
  for (const dir of [OUTPUT_DIR, THUMB_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const styles = discoverStyles();
  console.log(`Found ${styles.length} style folders\n`);

  const manifest = [];
  let success = 0;
  let skipped = 0;

  for (const style of styles) {
    const result = await processStyle(style);
    if (result) {
      manifest.push(result);
      if (result.exists) success++;
      else skipped++;
    } else {
      skipped++;
      manifest.push({
        slug: style.slug,
        main: `/assets/sketches/${style.slug}.webp`,
        thumbnail: `/assets/thumbnails/${style.slug}-thumb.webp`,
        exists: false,
        thumbnailExists: false,
      });
    }
  }

  // Write manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  const manifestData = {
    styles: manifest,
    generated: new Date().toISOString(),
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));

  console.log(`\nDone: ${success} converted, ${skipped} skipped`);
  console.log(`Manifest written to ${manifestPath}\n`);
}

main().catch(console.error);
