#!/bin/bash

# Beard Style Image Post-Processing Script
# Requires: ImageMagick (convert, identify commands)
#
# This script processes AI-generated beard style images to ensure:
# - Consistent dimensions (800x800)
# - White background (#FFFFFF)
# - Normalized histogram/levels
# - WebP export with quality 85
# - Thumbnail generation (400x400)

set -e

# Configuration
INPUT_DIR="${1:-./raw}"
OUTPUT_DIR="${2:-./processed}"
THUMBNAIL_DIR="${OUTPUT_DIR}/thumbnails"
ANNOTATED_DIR="${OUTPUT_DIR}/annotated"

DIMENSION="800x800"
THUMB_DIMENSION="400x400"
BACKGROUND="#FFFFFF"
QUALITY=85
FORMAT="webp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Beard Style Image Post-Processor${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Install with: brew install imagemagick (macOS) or apt install imagemagick (Ubuntu)"
    exit 1
fi

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$THUMBNAIL_DIR"
mkdir -p "$ANNOTATED_DIR"

echo -e "${YELLOW}Input directory:${NC} $INPUT_DIR"
echo -e "${YELLOW}Output directory:${NC} $OUTPUT_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$INPUT_DIR" -maxdepth 1 -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \) | wc -l)
echo -e "Found ${GREEN}$FILE_COUNT${NC} images to process"
echo ""

# Process each image
PROCESSED=0
for img in "$INPUT_DIR"/*.{png,jpg,jpeg,webp}; do
    # Skip if no files match
    [ -e "$img" ] || continue

    FILENAME=$(basename "$img")
    NAME="${FILENAME%.*}"

    echo -e "Processing: ${YELLOW}$FILENAME${NC}"

    # Step 1: Resize to exact dimensions with white background
    echo "  → Resizing to $DIMENSION..."
    convert "$img" \
        -resize "${DIMENSION}^" \
        -gravity center \
        -extent "$DIMENSION" \
        -background "$BACKGROUND" \
        -flatten \
        "${OUTPUT_DIR}/${NAME}_temp.png"

    # Step 2: Normalize levels (histogram normalization)
    echo "  → Normalizing levels..."
    convert "${OUTPUT_DIR}/${NAME}_temp.png" \
        -normalize \
        -modulate 100,0,100 \
        "${OUTPUT_DIR}/${NAME}_normalized.png"

    # Step 3: Ensure pure white background
    echo "  → Ensuring white background..."
    convert "${OUTPUT_DIR}/${NAME}_normalized.png" \
        -fuzz 5% \
        -fill "$BACKGROUND" \
        -draw "color 0,0 floodfill" \
        "${OUTPUT_DIR}/${NAME}_white.png"

    # Step 4: Export to WebP
    echo "  → Exporting to WebP (quality: $QUALITY)..."
    convert "${OUTPUT_DIR}/${NAME}_white.png" \
        -quality "$QUALITY" \
        "${OUTPUT_DIR}/${NAME}.webp"

    # Step 5: Create PNG backup
    echo "  → Creating PNG backup..."
    cp "${OUTPUT_DIR}/${NAME}_white.png" "${OUTPUT_DIR}/${NAME}.png"

    # Step 6: Generate thumbnail
    echo "  → Generating thumbnail..."
    convert "${OUTPUT_DIR}/${NAME}.png" \
        -resize "$THUMB_DIMENSION" \
        -quality "$QUALITY" \
        "${THUMBNAIL_DIR}/${NAME}-thumb.webp"

    # Cleanup temp files
    rm -f "${OUTPUT_DIR}/${NAME}_temp.png"
    rm -f "${OUTPUT_DIR}/${NAME}_normalized.png"
    rm -f "${OUTPUT_DIR}/${NAME}_white.png"

    ((PROCESSED++))
    echo -e "  ${GREEN}✓ Done${NC}"
    echo ""
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Processing Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Processed: ${GREEN}$PROCESSED${NC} images"
echo -e "Output: ${YELLOW}$OUTPUT_DIR${NC}"
echo -e "Thumbnails: ${YELLOW}$THUMBNAIL_DIR${NC}"
echo ""

# Verification report
echo -e "${YELLOW}Verification Report:${NC}"
echo "-------------------"

for img in "$OUTPUT_DIR"/*.webp; do
    [ -e "$img" ] || continue
    FILENAME=$(basename "$img")

    # Get dimensions
    DIMS=$(identify -format "%wx%h" "$img")

    # Get file size
    SIZE=$(du -h "$img" | cut -f1)

    if [ "$DIMS" = "$DIMENSION" ]; then
        echo -e "  ${GREEN}✓${NC} $FILENAME - $DIMS - $SIZE"
    else
        echo -e "  ${RED}✗${NC} $FILENAME - $DIMS (expected $DIMENSION) - $SIZE"
    fi
done

echo ""
echo -e "${GREEN}Done!${NC}"
