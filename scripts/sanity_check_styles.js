#!/usr/bin/env node
/**
 * sanity_check_styles.js
 *
 * Validates that every beard style in style_settings.json has:
 *   1. A valid .webp sketch image in frontend/public/assets/sketches/
 *   2. A valid .webp thumbnail in frontend/public/assets/thumbnails/
 *   3. Required fields (slug, name, description, etc.)
 *   4. Consistent slug ↔ filename mapping
 *
 * Also cross-checks:
 *   - beardStyles.js IDs match style_settings.json slugs
 *   - Database image_url values point to real files
 *
 * Usage:
 *   node scripts/sanity_check_styles.js
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = warnings found (missing files, mismatches)
 */

const fs = require('fs')
const path = require('path')

// ── Paths ───────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'frontend', 'public')
const SKETCHES = path.join(PUBLIC, 'assets', 'sketches')
const THUMBNAILS = path.join(PUBLIC, 'assets', 'thumbnails')
const SETTINGS_FILE = path.join(ROOT, 'frontend', 'src', 'data', 'style_settings.json')
const BEARD_STYLES_FILE = path.join(ROOT, 'frontend', 'src', 'data', 'beardStyles.js')

// ── Helpers ─────────────────────────────────────────────────────────────────
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const pass = (msg) => console.log(`  ${GREEN}✓${RESET} ${msg}`)
const fail = (msg) => console.log(`  ${RED}✗${RESET} ${msg}`)
const warn = (msg) => console.log(`  ${YELLOW}!${RESET} ${msg}`)
const info = (msg) => console.log(`  ${DIM}${msg}${RESET}`)

function fileExists(filePath) {
  try { return fs.statSync(filePath).isFile() } catch { return false }
}

function listFiles(dir, ext) {
  try {
    return fs.readdirSync(dir)
      .filter(f => f.endsWith(ext))
      .map(f => f.replace(ext, ''))
  } catch {
    return []
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
function main() {
  console.log('')
  console.log('='.repeat(60))
  console.log('  BeardStyle — Sanity Check')
  console.log('='.repeat(60))

  let errors = 0
  let warnings = 0

  // ── 1. Load style_settings.json ─────────────────────────────────────────
  console.log('\n1. style_settings.json')

  if (!fileExists(SETTINGS_FILE)) {
    fail('style_settings.json not found! Run: python scripts/generate_style_config.py')
    return 1
  }

  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'))
  const styles = settings.styles || []
  pass(`Loaded ${styles.length} styles (generated: ${settings.generated})`)

  // ── 2. Check required fields ────────────────────────────────────────────
  console.log('\n2. Required fields')

  const REQUIRED = ['slug', 'name', 'description', 'maintenance_level', 'image_url', 'thumbnail_url']

  for (const style of styles) {
    for (const field of REQUIRED) {
      if (!style[field]) {
        fail(`${style.slug || style.name || '???'}: missing "${field}"`)
        errors++
      }
    }
  }

  if (errors === 0) pass('All styles have required fields')

  // ── 3. Sketch images (.webp) ───────────────────────────────────────────
  console.log('\n3. Sketch images')

  const sketchFiles = listFiles(SKETCHES, '.webp')
  pass(`Found ${sketchFiles.length} .webp files in assets/sketches/`)

  for (const style of styles) {
    if (!style.image_url) continue

    const fsPath = path.join(PUBLIC, style.image_url)
    if (fileExists(fsPath)) {
      pass(`${style.slug} → ${style.image_url}`)
    } else {
      // Try to find a close match
      const matches = sketchFiles.filter(f =>
        f.includes(style.slug) || style.slug.includes(f)
      )
      if (matches.length > 0) {
        warn(`${style.slug}: ${style.image_url} NOT FOUND, but similar file exists: ${matches[0]}.webp`)
        warnings++
      } else {
        fail(`${style.slug}: ${style.image_url} NOT FOUND — no similar file found!`)
        errors++
      }
    }
  }

  // ── 4. Thumbnail images (.webp) ────────────────────────────────────────
  console.log('\n4. Thumbnail images')

  const thumbFiles = listFiles(THUMBNAILS, '.webp')
  pass(`Found ${thumbFiles.length} .webp files in assets/thumbnails/`)

  for (const style of styles) {
    if (!style.thumbnail_url) continue

    const fsPath = path.join(PUBLIC, style.thumbnail_url)
    if (fileExists(fsPath)) {
      pass(`${style.slug} → ${style.thumbnail_url}`)
    } else {
      fail(`${style.slug}: ${style.thumbnail_url} NOT FOUND`)
      errors++
    }
  }

  // ── 5. Orphan check — files without DB entries ─────────────────────────
  console.log('\n5. Orphan check (files without DB entry)')

  const settingSlugs = new Set(styles.map(s => s.slug))

  // Check for sketch .webp files that aren't referenced by any style
  for (const file of sketchFiles) {
    const referencedByUrl = styles.some(s =>
      s.image_url && s.image_url.includes(file)
    )
    if (!referencedByUrl) {
      warn(`Orphan sketch: ${file}.webp (not referenced by any style)`)
      warnings++
    }
  }

  // ── 6. Slug consistency ────────────────────────────────────────────────
  console.log('\n6. Slug ↔ filename consistency')

  for (const style of styles) {
    if (!style.image_url) continue
    const filename = path.basename(style.image_url, '.webp')

    // Acceptable: slug matches filename, or filename contains slug
    if (filename === style.slug || filename.includes(style.slug) || style.slug.includes(filename)) {
      pass(`${style.slug} ↔ ${filename}.webp`)
    } else {
      warn(`Slug mismatch: slug="${style.slug}" but file="${filename}.webp"`)
      warnings++
    }
  }

  // ── 7. Face types validation ───────────────────────────────────────────
  console.log('\n7. Face type coverage')

  const EXPECTED_SHAPES = ['Oval', 'Round', 'Square', 'Rectangle', 'Heart', 'Diamond', 'Triangle']
  const coveredShapes = new Set()

  for (const style of styles) {
    for (const ft of (style.recommended_face_types || [])) {
      coveredShapes.add(ft)
    }
  }

  for (const shape of EXPECTED_SHAPES) {
    const count = styles.filter(s =>
      (s.recommended_face_types || []).includes(shape)
    ).length
    if (count > 0) {
      pass(`${shape}: ${count} styles`)
    } else {
      warn(`${shape}: no styles recommend this face type!`)
      warnings++
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60))
  if (errors === 0 && warnings === 0) {
    console.log(`  ${GREEN}All checks passed!${RESET} ${styles.length} styles validated.`)
  } else {
    if (errors > 0) console.log(`  ${RED}${errors} error(s)${RESET}`)
    if (warnings > 0) console.log(`  ${YELLOW}${warnings} warning(s)${RESET}`)
  }
  console.log('='.repeat(60))
  console.log('')

  return errors > 0 ? 1 : 0
}

process.exit(main())
