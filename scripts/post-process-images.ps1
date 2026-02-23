# Beard Style Image Post-Processing Script (PowerShell)
# Requires: ImageMagick installed and in PATH
#
# Usage: .\post-process-images.ps1 [-InputDir ".\raw"] [-OutputDir ".\processed"]

param(
    [string]$InputDir = ".\raw",
    [string]$OutputDir = ".\processed"
)

# Configuration
$Dimension = "800x800"
$ThumbDimension = "400x400"
$Background = "#FFFFFF"
$Quality = 85

$ThumbnailDir = Join-Path $OutputDir "thumbnails"
$AnnotatedDir = Join-Path $OutputDir "annotated"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Beard Style Image Post-Processor" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check for ImageMagick
$magick = Get-Command "magick" -ErrorAction SilentlyContinue
if (-not $magick) {
    Write-Host "Error: ImageMagick is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Download from: https://imagemagick.org/script/download.php#windows"
    exit 1
}

# Create output directories
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path $ThumbnailDir | Out-Null
New-Item -ItemType Directory -Force -Path $AnnotatedDir | Out-Null

Write-Host "Input directory: " -NoNewline -ForegroundColor Yellow
Write-Host $InputDir
Write-Host "Output directory: " -NoNewline -ForegroundColor Yellow
Write-Host $OutputDir
Write-Host ""

# Get image files
$images = Get-ChildItem -Path $InputDir -Include "*.png", "*.jpg", "*.jpeg", "*.webp" -File

Write-Host "Found " -NoNewline
Write-Host $images.Count -ForegroundColor Green -NoNewline
Write-Host " images to process"
Write-Host ""

$processed = 0

foreach ($img in $images) {
    $filename = $img.Name
    $name = [System.IO.Path]::GetFileNameWithoutExtension($filename)

    Write-Host "Processing: " -NoNewline
    Write-Host $filename -ForegroundColor Yellow

    $tempFile = Join-Path $OutputDir "${name}_temp.png"
    $normalizedFile = Join-Path $OutputDir "${name}_normalized.png"
    $whiteFile = Join-Path $OutputDir "${name}_white.png"
    $outputWebp = Join-Path $OutputDir "${name}.webp"
    $outputPng = Join-Path $OutputDir "${name}.png"
    $thumbFile = Join-Path $ThumbnailDir "${name}-thumb.webp"

    # Step 1: Resize to exact dimensions with white background
    Write-Host "  -> Resizing to $Dimension..."
    & magick $img.FullName `
        -resize "${Dimension}^" `
        -gravity center `
        -extent $Dimension `
        -background $Background `
        -flatten `
        $tempFile

    # Step 2: Normalize levels (histogram normalization)
    Write-Host "  -> Normalizing levels..."
    & magick $tempFile `
        -normalize `
        -modulate "100,0,100" `
        $normalizedFile

    # Step 3: Ensure pure white background
    Write-Host "  -> Ensuring white background..."
    & magick $normalizedFile `
        -fuzz "5%" `
        -fill $Background `
        -draw "color 0,0 floodfill" `
        $whiteFile

    # Step 4: Export to WebP
    Write-Host "  -> Exporting to WebP (quality: $Quality)..."
    & magick $whiteFile `
        -quality $Quality `
        $outputWebp

    # Step 5: Create PNG backup
    Write-Host "  -> Creating PNG backup..."
    Copy-Item $whiteFile $outputPng

    # Step 6: Generate thumbnail
    Write-Host "  -> Generating thumbnail..."
    & magick $outputPng `
        -resize $ThumbDimension `
        -quality $Quality `
        $thumbFile

    # Cleanup temp files
    Remove-Item -Force $tempFile -ErrorAction SilentlyContinue
    Remove-Item -Force $normalizedFile -ErrorAction SilentlyContinue
    Remove-Item -Force $whiteFile -ErrorAction SilentlyContinue

    $processed++
    Write-Host "  " -NoNewline
    Write-Host "[OK]" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "Processing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Processed: " -NoNewline
Write-Host $processed -ForegroundColor Green -NoNewline
Write-Host " images"
Write-Host "Output: " -NoNewline -ForegroundColor Yellow
Write-Host $OutputDir
Write-Host "Thumbnails: " -NoNewline -ForegroundColor Yellow
Write-Host $ThumbnailDir
Write-Host ""

# Verification report
Write-Host "Verification Report:" -ForegroundColor Yellow
Write-Host "-------------------"

$webpFiles = Get-ChildItem -Path $OutputDir -Filter "*.webp" -File

foreach ($webp in $webpFiles) {
    $dims = & magick identify -format "%wx%h" $webp.FullName
    $size = "{0:N2} KB" -f ($webp.Length / 1KB)

    if ($dims -eq $Dimension) {
        Write-Host "  [OK] " -ForegroundColor Green -NoNewline
    } else {
        Write-Host "  [X] " -ForegroundColor Red -NoNewline
    }
    Write-Host "$($webp.Name) - $dims - $size"
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
