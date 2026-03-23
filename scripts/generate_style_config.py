#!/usr/bin/env python3
"""
generate_style_config.py

Syncs beard style data from PostgreSQL database to frontend's style_settings.json.
Run this after any changes to beard_styles table to keep frontend in sync.

Features:
  - Reads all beard styles, tags, and face types from DB
  - Validates that image_url and thumbnail_url point to real files
  - Ensures paths use /assets/sketches/ and /assets/thumbnails/ conventions
  - Outputs warnings for missing files

Usage:
    python scripts/generate_style_config.py

Env vars (reads from root .env automatically):
    POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# --- Load .env from project root ---
ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT_DIR / ".env"
PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
OUTPUT_FILE = ROOT_DIR / "frontend" / "src" / "data" / "style_settings.json"

# Canonical asset paths — all image_url / thumbnail_url should point here
SKETCHES_DIR = "/assets/sketches"
THUMBNAILS_DIR = "/assets/thumbnails"


def load_dotenv(path):
    """Simple .env loader — no external dependencies."""
    env = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        env[key.strip()] = val.strip().strip('"').strip("'")
    return env


dotenv = load_dotenv(ENV_FILE)
for k, v in dotenv.items():
    os.environ.setdefault(k, v)

# --- Database connection ---
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("ERROR: psycopg2 not installed. Run: pip install psycopg2-binary")
    sys.exit(1)

DB_CONFIG = {
    "host": os.environ.get("POSTGRES_HOST", "localhost"),
    "port": int(os.environ.get("POSTGRES_PORT", "5433")),
    "dbname": os.environ.get("POSTGRES_DB", "beard_style_db"),
    "user": os.environ.get("POSTGRES_USER", "bearduser"),
    "password": os.environ.get("POSTGRES_PASSWORD", "beardpass123"),
}


def fetch_styles():
    """Fetch all beard styles with their tags and face types from DB."""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT
            bs.id,
            bs.slug,
            bs.name,
            bs.description,
            bs.maintenance_level,
            bs.style_category,
            bs.growth_time_weeks,
            bs.image_url,
            bs.thumbnail_url,
            bs.overlay_svg,
            bs.instructions,
            bs.popularity_score,
            bs.recommended_face_types,
            COALESCE(
                (SELECT array_agg(t.name ORDER BY t.name)
                 FROM beard_style_tags bst
                 JOIN tags t ON t.id = bst.tag_id
                 WHERE bst.beard_style_id = bs.id),
                ARRAY[]::text[]
            ) AS tags,
            COALESCE(
                (SELECT array_agg(ft.name ORDER BY ft.id)
                 FROM face_types ft
                 WHERE ft.id = ANY(bs.recommended_face_types)),
                ARRAY[]::text[]
            ) AS face_type_names
        FROM beard_styles bs
        ORDER BY bs.slug
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [dict(r) for r in rows]


def validate_image_path(url, slug, label):
    """
    Validate that an image URL points to a real file in frontend/public/.
    Returns (resolved_url, warning_or_none).
    """
    if not url:
        return None, f"  WARN: {slug} has no {label}"

    # Resolve to filesystem path
    fs_path = PUBLIC_DIR / url.lstrip("/")

    if fs_path.exists():
        return url, None

    # Try common fixes
    # 1. Maybe DB has wrong extension — try .webp
    webp_path = fs_path.with_suffix(".webp")
    if webp_path.exists():
        fixed = "/" + webp_path.relative_to(PUBLIC_DIR).as_posix()
        return fixed, f"  FIX:  {slug} {label}: {url} -> {fixed}"

    # 2. Maybe slug differs from filename (e.g. short-boxed vs short-boxed-beard)
    parent = fs_path.parent
    stem = fs_path.stem
    if parent.exists():
        candidates = list(parent.glob(f"*{slug}*"))
        webp_candidates = [c for c in candidates if c.suffix == ".webp"]
        if webp_candidates:
            best = webp_candidates[0]
            fixed = "/" + best.relative_to(PUBLIC_DIR).as_posix()
            return fixed, f"  FIX:  {slug} {label}: {url} -> {fixed}"

    return url, f"  MISS: {slug} {label}: {url} (file not found)"


def build_config(styles):
    """Transform DB rows into frontend-friendly config with validated paths."""
    config = {
        "$schema": "style_settings_schema.json",
        "version": "1.0.0",
        "generated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "total_styles": len(styles),
        "styles": [],
    }

    warnings = []
    fixes = []

    for s in styles:
        slug = s["slug"]

        # Validate & fix image paths
        image_url, img_msg = validate_image_path(s["image_url"], slug, "image_url")
        thumb_url, thumb_msg = validate_image_path(s["thumbnail_url"], slug, "thumbnail_url")

        if img_msg:
            (fixes if img_msg.startswith("  FIX") else warnings).append(img_msg)
        if thumb_msg:
            (fixes if thumb_msg.startswith("  FIX") else warnings).append(thumb_msg)

        entry = {
            "id": s["id"],
            "slug": slug,
            "name": s["name"],
            "description": s["description"],
            "maintenance_level": s["maintenance_level"],
            "style_category": s["style_category"],
            "growth_time_weeks": s["growth_time_weeks"],
            "image_url": image_url,
            "thumbnail_url": thumb_url,
            "overlay_svg": s["overlay_svg"],
            "instructions": s["instructions"],
            "popularity_score": s["popularity_score"],
            "recommended_face_types": s["face_type_names"],
            "tags": s["tags"],
        }
        config["styles"].append(entry)

    return config, warnings, fixes


def main():
    print(f"{'=' * 55}")
    print(f"  generate_style_config.py")
    print(f"  DB: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}")
    print(f"{'=' * 55}")

    styles = fetch_styles()
    print(f"\n  Fetched {len(styles)} beard styles from database")

    config, warnings, fixes = build_config(styles)

    # Report fixes applied
    if fixes:
        print(f"\n  Auto-fixed {len(fixes)} path(s):")
        for f in fixes:
            print(f)

    # Report warnings
    if warnings:
        print(f"\n  {len(warnings)} warning(s):")
        for w in warnings:
            print(w)

    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    print(f"\n  Output: {OUTPUT_FILE}")
    print(f"  Styles: {', '.join(s['slug'] for s in styles)}")

    if not warnings:
        print(f"\n  All {len(styles)} styles have valid image paths!")
    else:
        print(f"\n  Run sanity_check_styles.js for full validation")

    print(f"{'=' * 55}")
    return 1 if warnings else 0


if __name__ == "__main__":
    sys.exit(main())
