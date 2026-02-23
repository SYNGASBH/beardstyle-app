# ========================================
# Beard Style Image Post-Processing Script
# PowerShell Version for Windows
# ========================================
# Requirements: ImageMagick 7.x
# Usage: .\process-images.ps1 -InputDir ".\raw" -OutputDir ".\processed"

param(
    [string]$InputDir = ".\raw",
    [string]$OutputDir = ".\processed"
)

$ThumbnailDir = Join-Path $OutputDir "thumbnails"
$PngDir = Join-Path $OutputDir "png"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Beard Style Image Post-Processor" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$magickPath = Get-Command magick -ErrorAction SilentlyContinue
if (-not $magickPath) {
    Write-Host "Error: ImageMagick not found. Please install it first." -ForegroundColor Red
    Write-Host "  Run: winget install ImageMagick.ImageMagick" -ForegroundColor Yellow
    exit 1
}

# Create directories
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path $ThumbnailDir | Out-Null
New-Item -ItemType Directory -Force -Path $PngDir | Out-Null

# Counter
$total = 0
$processed = 0
$failed = 0

# Get all images
$images = Get-ChildItem -Path $InputDir -Include *.png,*.jpg,*.jpeg -File -ErrorAction SilentlyContinue

foreach ($img in $images) {
    $total++
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)

    Write-Host "Processing: $($img.Name)" -ForegroundColor Yellow

    try {
        # Main processing pipeline
        $outputWebp = Join-Path $OutputDir "$basename.webp"
        $outputThumb = Join-Path $ThumbnailDir "$basename-thumb.webp"
        $outputPng = Join-Path $PngDir "$basename.png"

        # Process main image
        & magick $img.FullName `
            -resize "800x800^" `
            -gravity center `
            -extent 800x800 `
            -colorspace Gray `
            -normalize `
            -level "5%,95%" `
            -background white `
            -flatten `
            -quality 85 `
            $outputWebp

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  + Main image: $basename.webp" -ForegroundColor Green

            # Create thumbnail
            & magick $outputWebp -resize 400x400 -quality 80 $outputThumb
            Write-Host "  + Thumbnail: $basename-thumb.webp" -ForegroundColor Green

            # Create PNG backup
            & magick $outputWebp $outputPng
            Write-Host "  + PNG backup: $basename.png" -ForegroundColor Green

            $processed++
        } else {
            throw "ImageMagick failed"
        }
    }
    catch {
        Write-Host "  X Failed to process $($img.Name)" -ForegroundColor Red
        $failed++
    }

    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Total files:     $total"
Write-Host "  Processed:       $processed" -ForegroundColor Green
Write-Host "  Failed:          $failed" -ForegroundColor Red
Write-Host ""
Write-Host "  Output directory: $OutputDir"
Write-Host "  Thumbnails:       $ThumbnailDir"
Write-Host "==========================================" -ForegroundColor Cyan

if ($processed -gt 0) {
    Write-Host ""
    Write-Host "NEXT STEP: Run alignment check" -ForegroundColor Yellow
    Write-Host "  1. Open all images in Photoshop/Figma"
    Write-Host "  2. Overlay to check jawline alignment (+/-2px)"
    Write-Host "  3. If misaligned, manually adjust crop"
    Write-Host ""
}
