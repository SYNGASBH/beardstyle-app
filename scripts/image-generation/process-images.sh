#!/bin/bash
# ========================================
# Beard Style Image Post-Processing Script
# ========================================
# Requirements: ImageMagick 7.x
# Usage: ./process-images.sh [input_dir] [output_dir]
#
# This script:
# 1. Resizes to 800x800px
# 2. Normalizes histogram (grayscale levels)
# 3. Sets background to pure white (#FFFFFF)
# 4. Converts to WebP (quality 85)
# 5. Creates thumbnails (400x400)
# 6. Creates PNG backups

INPUT_DIR="${1:-./raw}"
OUTPUT_DIR="${2:-./processed}"
THUMBNAIL_DIR="$OUTPUT_DIR/thumbnails"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  Beard Style Image Post-Processor"
echo "=========================================="
echo ""

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo -e "${RED}Error: ImageMagick not found. Please install it first.${NC}"
    echo "  Windows: winget install ImageMagick.ImageMagick"
    echo "  Mac: brew install imagemagick"
    echo "  Linux: sudo apt install imagemagick"
    exit 1
fi

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$THUMBNAIL_DIR"
mkdir -p "$OUTPUT_DIR/png"

# Counter
total=0
processed=0
failed=0

# Process each image
for img in "$INPUT_DIR"/*.{png,jpg,jpeg,PNG,JPG,JPEG} 2>/dev/null; do
    [ -e "$img" ] || continue

    total=$((total + 1))
    filename=$(basename "$img")
    basename="${filename%.*}"

    echo -e "${YELLOW}Processing: $filename${NC}"

    # Main processing pipeline
    if magick "$img" \
        -resize 800x800^ \
        -gravity center \
        -extent 800x800 \
        -colorspace Gray \
        -normalize \
        -level 5%,95% \
        -background white \
        -flatten \
        -quality 85 \
        "$OUTPUT_DIR/$basename.webp" 2>/dev/null; then

        echo -e "  ${GREEN}✓ Main image: $basename.webp${NC}"

        # Create thumbnail
        magick "$OUTPUT_DIR/$basename.webp" \
            -resize 400x400 \
            -quality 80 \
            "$THUMBNAIL_DIR/$basename-thumb.webp" 2>/dev/null

        echo -e "  ${GREEN}✓ Thumbnail: $basename-thumb.webp${NC}"

        # Create PNG backup
        magick "$OUTPUT_DIR/$basename.webp" \
            "$OUTPUT_DIR/png/$basename.png" 2>/dev/null

        echo -e "  ${GREEN}✓ PNG backup: $basename.png${NC}"

        processed=$((processed + 1))
    else
        echo -e "  ${RED}✗ Failed to process $filename${NC}"
        failed=$((failed + 1))
    fi

    echo ""
done

echo "=========================================="
echo "  Summary"
echo "=========================================="
echo -e "  Total files:     $total"
echo -e "  ${GREEN}Processed:       $processed${NC}"
echo -e "  ${RED}Failed:          $failed${NC}"
echo ""
echo "  Output directory: $OUTPUT_DIR"
echo "  Thumbnails:       $THUMBNAIL_DIR"
echo "=========================================="

# Pixel alignment check reminder
if [ $processed -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}NEXT STEP: Run alignment check${NC}"
    echo "  1. Open all images in Photoshop/Figma"
    echo "  2. Overlay to check jawline alignment (±2px)"
    echo "  3. If misaligned, manually adjust crop"
    echo ""
fi
