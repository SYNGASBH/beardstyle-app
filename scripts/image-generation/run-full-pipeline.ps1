# ========================================
# COMPLETE BEARD SKETCH PIPELINE
# ========================================
# This script runs the entire post-processing and deployment pipeline
# Prerequisites: ImageMagick installed, raw images in ./raw folder

param(
    [switch]$SkipProcessing,
    [switch]$SkipDeploy,
    [switch]$CreateAnnotated
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BEARD SKETCH GENERATION PIPELINE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Paths
$RawDir = ".\raw"
$ProcessedDir = ".\processed"
$ThumbnailDir = "$ProcessedDir\thumbnails"
$PngDir = "$ProcessedDir\png"
$FrontendAssets = "..\..\frontend\public\assets"
$SketchesDir = "$FrontendAssets\sketches"
$ThumbsDir = "$FrontendAssets\thumbnails"

# Expected files
$ExpectedStyles = @(
    "full-beard",
    "stubble-3day",
    "van-dyke",
    "clean-shaven",
    "short-boxed-beard",
    "corporate-beard",
    "goatee",
    "balbo",
    "circle-beard",
    "ducktail",
    "garibaldi",
    "mutton-chops",
    "anchor-beard",
    "chin-strap",
    "beardstache"
)

# ========================================
# STEP 1: CHECK PREREQUISITES
# ========================================
Write-Host "STEP 1: Checking prerequisites..." -ForegroundColor Yellow

# Check ImageMagick - try PATH first, then common install locations
$magickCmd = $null
$magickTest = Get-Command magick -ErrorAction SilentlyContinue
if ($magickTest) {
    $magickCmd = "magick"
} else {
    $installPaths = @(
        "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe",
        "C:\Program Files\ImageMagick*\magick.exe"
    )
    foreach ($path in $installPaths) {
        $found = Get-ChildItem $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $magickCmd = $found.FullName
            break
        }
    }
}

if (-not $magickCmd) {
    Write-Host "  [X] ImageMagick not found!" -ForegroundColor Red
    Write-Host "  Run: winget install ImageMagick.ImageMagick" -ForegroundColor Yellow
    exit 1
}
Write-Host "  [OK] ImageMagick found: $magickCmd" -ForegroundColor Green

# Check raw folder
if (-not (Test-Path $RawDir)) {
    New-Item -ItemType Directory -Path $RawDir -Force | Out-Null
    Write-Host "  [!] Created raw folder - add your images there" -ForegroundColor Yellow
}

# Count raw images
$rawImages = Get-ChildItem -Path $RawDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)$' }
$rawCount = ($rawImages | Measure-Object).Count
Write-Host "  [OK] Found $rawCount images in raw folder" -ForegroundColor Green

if ($rawCount -eq 0) {
    Write-Host ""
    Write-Host "  NO IMAGES FOUND!" -ForegroundColor Red
    Write-Host "  Add your Midjourney downloads to: $RawDir" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Expected filenames:" -ForegroundColor Yellow
    foreach ($style in $ExpectedStyles) {
        Write-Host "    - $style.png" -ForegroundColor Gray
    }
    exit 1
}

# ========================================
# STEP 2: PROCESS IMAGES
# ========================================
if (-not $SkipProcessing) {
    Write-Host ""
    Write-Host "STEP 2: Processing images..." -ForegroundColor Yellow

    # Create directories
    New-Item -ItemType Directory -Force -Path $ProcessedDir | Out-Null
    New-Item -ItemType Directory -Force -Path $ThumbnailDir | Out-Null
    New-Item -ItemType Directory -Force -Path $PngDir | Out-Null

    $processed = 0
    $failed = 0

    foreach ($img in $rawImages) {
        $basename = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
        Write-Host "  Processing: $($img.Name)" -ForegroundColor Gray

        try {
            # Main image: 800x800, grayscale, normalized, white background
            & $magickCmd $img.FullName `
                -resize "800x800^" `
                -gravity center `
                -extent 800x800 `
                -background white `
                -flatten `
                -colorspace Gray `
                -type Grayscale `
                -normalize `
                -level "5%,95%" `
                -quality 85 `
                "$ProcessedDir\$basename.webp"

            # Thumbnail: 400x400
            & $magickCmd "$ProcessedDir\$basename.webp" `
                -resize 400x400 `
                -quality 80 `
                "$ThumbnailDir\$basename-thumb.webp"

            # PNG backup
            & $magickCmd "$ProcessedDir\$basename.webp" `
                "$PngDir\$basename.png"

            Write-Host "    [OK] $basename" -ForegroundColor Green
            $processed++
        }
        catch {
            Write-Host "    [X] Failed: $basename" -ForegroundColor Red
            $failed++
        }
    }

    Write-Host ""
    Write-Host "  Processed: $processed | Failed: $failed" -ForegroundColor Cyan
}

# ========================================
# STEP 3: VALIDATION
# ========================================
Write-Host ""
Write-Host "STEP 3: Validating processed images..." -ForegroundColor Yellow

$processedImages = Get-ChildItem -Path $ProcessedDir -Filter "*.webp" -File -ErrorAction SilentlyContinue
$validationPassed = $true

foreach ($img in $processedImages) {
    $info = & $magickCmd identify -format "%w %h %[colorspace]" $img.FullName 2>$null
    $parts = $info -split " "

    $width = [int]$parts[0]
    $height = [int]$parts[1]
    $colorspace = $parts[2]

    $sizeOk = ($width -eq 800 -and $height -eq 800)
    # WebP may report sRGB even for grayscale images
    $grayOk = ($colorspace -match "Gray|sRGB")

    if ($sizeOk -and $grayOk) {
        Write-Host "  [OK] $($img.Name): ${width}x${height}, $colorspace" -ForegroundColor Green
    } else {
        Write-Host "  [X] $($img.Name): ${width}x${height}, $colorspace" -ForegroundColor Red
        $validationPassed = $false
    }
}

if (-not $validationPassed) {
    Write-Host ""
    Write-Host "  VALIDATION FAILED - Fix issues before deploying" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 4: DEPLOY TO FRONTEND
# ========================================
if (-not $SkipDeploy) {
    Write-Host ""
    Write-Host "STEP 4: Deploying to frontend assets..." -ForegroundColor Yellow

    # Create asset directories
    New-Item -ItemType Directory -Force -Path $SketchesDir | Out-Null
    New-Item -ItemType Directory -Force -Path $ThumbsDir | Out-Null

    # Copy main sketches
    $webpFiles = Get-ChildItem -Path $ProcessedDir -Filter "*.webp" -File
    foreach ($file in $webpFiles) {
        Copy-Item $file.FullName -Destination $SketchesDir -Force
        Write-Host "  [OK] Copied: $($file.Name) -> sketches/" -ForegroundColor Green
    }

    # Copy thumbnails
    $thumbFiles = Get-ChildItem -Path $ThumbnailDir -Filter "*.webp" -File
    foreach ($file in $thumbFiles) {
        Copy-Item $file.FullName -Destination $ThumbsDir -Force
        Write-Host "  [OK] Copied: $($file.Name) -> thumbnails/" -ForegroundColor Green
    }

    # Copy PNG backups
    $pngBackupDir = "$SketchesDir\png"
    New-Item -ItemType Directory -Force -Path $pngBackupDir | Out-Null
    $pngFiles = Get-ChildItem -Path $PngDir -Filter "*.png" -File
    foreach ($file in $pngFiles) {
        Copy-Item $file.FullName -Destination $pngBackupDir -Force
    }
    Write-Host "  [OK] Copied PNG backups" -ForegroundColor Green
}

# ========================================
# STEP 5: GENERATE MANIFEST
# ========================================
Write-Host ""
Write-Host "STEP 5: Generating asset manifest..." -ForegroundColor Yellow

$manifest = @{
    generated = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    styles = @()
}

foreach ($style in $ExpectedStyles) {
    $mainFile = "$SketchesDir\$style.webp"
    $thumbFile = "$ThumbsDir\$style-thumb.webp"

    $styleInfo = @{
        slug = $style
        main = "/assets/sketches/$style.webp"
        thumbnail = "/assets/thumbnails/$style-thumb.webp"
        exists = (Test-Path $mainFile)
        thumbnailExists = (Test-Path $thumbFile)
    }

    $manifest.styles += $styleInfo

    if ($styleInfo.exists) {
        Write-Host "  [OK] $style" -ForegroundColor Green
    } else {
        Write-Host "  [X] $style (missing)" -ForegroundColor Red
    }
}

$manifestJson = $manifest | ConvertTo-Json -Depth 3
$manifestJson | Out-File -FilePath "$SketchesDir\manifest.json" -Encoding UTF8
Write-Host "  [OK] Manifest saved to sketches/manifest.json" -ForegroundColor Green

# ========================================
# SUMMARY
# ========================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PIPELINE COMPLETE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$existingCount = ($manifest.styles | Where-Object { $_.exists }).Count
$totalCount = $ExpectedStyles.Count

Write-Host "  Styles processed: $existingCount / $totalCount" -ForegroundColor White
Write-Host ""

if ($existingCount -lt $totalCount) {
    Write-Host "  MISSING STYLES:" -ForegroundColor Yellow
    foreach ($style in $manifest.styles) {
        if (-not $style.exists) {
            Write-Host "    - $($style.slug)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "  Assets deployed to:" -ForegroundColor White
Write-Host "    Sketches:   $SketchesDir" -ForegroundColor Gray
Write-Host "    Thumbnails: $ThumbsDir" -ForegroundColor Gray
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Yellow
Write-Host "    1. Run: cd ..\..\frontend && npm start" -ForegroundColor Gray
Write-Host "    2. Check images load correctly" -ForegroundColor Gray
Write-Host "    3. Run alignment check (open overlay-check.html)" -ForegroundColor Gray
Write-Host ""
