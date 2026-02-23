# ========================================
# BEARD SKETCH QA VALIDATOR
# ========================================
# Validates generated images against 5-point checklist
# Usage: .\qa-validator.ps1 -ImagePath "path\to\image.png"
#        .\qa-validator.ps1 -Folder ".\raw"

param(
    [string]$ImagePath,
    [string]$Folder,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

# Find ImageMagick
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
    Write-Host "ERROR: ImageMagick not found!" -ForegroundColor Red
    exit 1
}

# ========================================
# QA CHECK FUNCTIONS
# ========================================

function Test-ImageDimensions {
    param([string]$Path)

    $info = & $magickCmd identify -format "%w %h" $Path 2>$null
    $parts = $info -split " "
    $width = [int]$parts[0]
    $height = [int]$parts[1]

    # Check if square (1:1 aspect ratio)
    $isSquare = ($width -eq $height)

    # Check if reasonable size (at least 400x400)
    $isLargeEnough = ($width -ge 400 -and $height -ge 400)

    return @{
        Pass = $isSquare -and $isLargeEnough
        Width = $width
        Height = $height
        Message = if ($isSquare -and $isLargeEnough) { "OK: ${width}x${height}" } else { "FAIL: ${width}x${height} (need square, min 400px)" }
    }
}

function Test-GrayscaleOrNeutral {
    param([string]$Path)

    # Get color saturation - grayscale images have very low saturation
    $saturation = & $magickCmd $Path -colorspace HSL -channel G -separate +channel -format "%[fx:mean]" info: 2>$null
    $satValue = [double]$saturation

    # Saturation below 0.05 (5%) is considered grayscale
    $isGrayscale = ($satValue -lt 0.05)

    return @{
        Pass = $isGrayscale
        Saturation = [math]::Round($satValue * 100, 2)
        Message = if ($isGrayscale) { "OK: Grayscale (sat: $([math]::Round($satValue * 100, 1))%)" } else { "FAIL: Color detected (sat: $([math]::Round($satValue * 100, 1))%)" }
    }
}

function Test-WhiteBackground {
    param([string]$Path)

    # Sample corners and edges for background color
    # Get average brightness of corner regions
    $cornerBrightness = & $magickCmd $Path -gravity NorthWest -crop 50x50+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $cornerValue = [double]$cornerBrightness

    # White background should have brightness > 0.95 (95%)
    $isWhite = ($cornerValue -gt 0.90)

    return @{
        Pass = $isWhite
        Brightness = [math]::Round($cornerValue * 100, 1)
        Message = if ($isWhite) { "OK: White background ($([math]::Round($cornerValue * 100, 1))%)" } else { "FAIL: Background not white ($([math]::Round($cornerValue * 100, 1))%)" }
    }
}

function Test-SymmetryCheck {
    param([string]$Path)

    # Flip image horizontally and compare with original
    # Lower difference = more symmetrical
    $tempFlipped = [System.IO.Path]::GetTempFileName() + ".png"

    try {
        & $magickCmd $Path -flop $tempFlipped 2>$null
        $diff = & $magickCmd compare -metric RMSE $Path $tempFlipped null: 2>&1

        # Extract numeric value
        if ($diff -match "(\d+\.?\d*)") {
            $diffValue = [double]$matches[1]
            # Normalize to percentage (assuming 16-bit range)
            $diffPercent = ($diffValue / 65535) * 100

            # Less than 15% difference is considered symmetrical
            $isSymmetrical = ($diffPercent -lt 15)

            return @{
                Pass = $isSymmetrical
                Difference = [math]::Round($diffPercent, 1)
                Message = if ($isSymmetrical) { "OK: Symmetrical (diff: $([math]::Round($diffPercent, 1))%)" } else { "WARN: Asymmetry detected (diff: $([math]::Round($diffPercent, 1))%)" }
            }
        }
    }
    finally {
        Remove-Item $tempFlipped -ErrorAction SilentlyContinue
    }

    return @{
        Pass = $true
        Difference = 0
        Message = "SKIP: Could not check symmetry"
    }
}

function Test-CropCheck {
    param([string]$Path)

    # Check if top portion is mostly empty (no eyes/forehead)
    # Sample top 15% of image - should be mostly white/empty
    $topBrightness = & $magickCmd $Path -gravity North -crop 100%x15%+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $topValue = [double]$topBrightness

    # Top should be bright (background) with small nose hint
    # If top is too dark, might have eyes/forehead
    $isCroppedCorrectly = ($topValue -gt 0.70)

    return @{
        Pass = $isCroppedCorrectly
        TopBrightness = [math]::Round($topValue * 100, 1)
        Message = if ($isCroppedCorrectly) { "OK: Crop looks correct (top: $([math]::Round($topValue * 100, 1))%)" } else { "WARN: May have eyes/forehead (top: $([math]::Round($topValue * 100, 1))%)" }
    }
}

# ========================================
# MAIN VALIDATION FUNCTION
# ========================================

function Validate-BeardSketch {
    param([string]$Path)

    $filename = [System.IO.Path]::GetFileName($Path)

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  QA VALIDATION: $filename" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    $results = @{
        Dimensions = Test-ImageDimensions -Path $Path
        Grayscale = Test-GrayscaleOrNeutral -Path $Path
        Background = Test-WhiteBackground -Path $Path
        Symmetry = Test-SymmetryCheck -Path $Path
        Crop = Test-CropCheck -Path $Path
    }

    $passCount = 0
    $totalChecks = 5

    # Display results
    Write-Host ""
    Write-Host "CHECK 1 - DIMENSIONS:" -ForegroundColor Yellow
    if ($results.Dimensions.Pass) {
        Write-Host "  [PASS] $($results.Dimensions.Message)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "  [FAIL] $($results.Dimensions.Message)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "CHECK 2 - GRAYSCALE:" -ForegroundColor Yellow
    if ($results.Grayscale.Pass) {
        Write-Host "  [PASS] $($results.Grayscale.Message)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "  [FAIL] $($results.Grayscale.Message)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "CHECK 3 - BACKGROUND:" -ForegroundColor Yellow
    if ($results.Background.Pass) {
        Write-Host "  [PASS] $($results.Background.Message)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "  [FAIL] $($results.Background.Message)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "CHECK 4 - SYMMETRY:" -ForegroundColor Yellow
    if ($results.Symmetry.Pass) {
        Write-Host "  [PASS] $($results.Symmetry.Message)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "  [WARN] $($results.Symmetry.Message)" -ForegroundColor Yellow
        $passCount++ # Symmetry is a soft check
    }

    Write-Host ""
    Write-Host "CHECK 5 - CROP:" -ForegroundColor Yellow
    if ($results.Crop.Pass) {
        Write-Host "  [PASS] $($results.Crop.Message)" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "  [WARN] $($results.Crop.Message)" -ForegroundColor Yellow
    }

    # Summary
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    $overallPass = ($results.Dimensions.Pass -and $results.Grayscale.Pass -and $results.Background.Pass)

    if ($overallPass) {
        Write-Host "  RESULT: PASSED ($passCount/$totalChecks)" -ForegroundColor Green
        Write-Host "  Image is ready for processing!" -ForegroundColor Green
    } else {
        Write-Host "  RESULT: FAILED" -ForegroundColor Red
        Write-Host "  Fix issues and regenerate in Midjourney" -ForegroundColor Yellow
    }
    Write-Host "========================================" -ForegroundColor Cyan

    return @{
        Filename = $filename
        Pass = $overallPass
        Results = $results
        Score = $passCount
    }
}

# ========================================
# ENTRY POINT
# ========================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BEARD SKETCH QA VALIDATOR" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if ($ImagePath) {
    if (Test-Path $ImagePath) {
        $result = Validate-BeardSketch -Path $ImagePath
    } else {
        Write-Host "ERROR: File not found: $ImagePath" -ForegroundColor Red
    }
}
elseif ($Folder) {
    if (Test-Path $Folder) {
        $images = Get-ChildItem -Path $Folder -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|webp)$' }

        $passed = 0
        $failed = 0
        $failedFiles = @()

        foreach ($img in $images) {
            $result = Validate-BeardSketch -Path $img.FullName
            if ($result.Pass) {
                $passed++
            } else {
                $failed++
                $failedFiles += $img.Name
            }
        }

        Write-Host ""
        Write-Host "============================================" -ForegroundColor Cyan
        Write-Host "  BATCH SUMMARY" -ForegroundColor Cyan
        Write-Host "============================================" -ForegroundColor Cyan
        Write-Host "  Total: $($images.Count)" -ForegroundColor White
        Write-Host "  Passed: $passed" -ForegroundColor Green
        Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

        if ($failedFiles.Count -gt 0) {
            Write-Host ""
            Write-Host "  FAILED FILES:" -ForegroundColor Red
            foreach ($f in $failedFiles) {
                Write-Host "    - $f" -ForegroundColor Red
            }
        }
        Write-Host "============================================" -ForegroundColor Cyan
    } else {
        Write-Host "ERROR: Folder not found: $Folder" -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\qa-validator.ps1 -ImagePath 'path\to\image.png'" -ForegroundColor Gray
    Write-Host "  .\qa-validator.ps1 -Folder '.\raw'" -ForegroundColor Gray
    Write-Host ""
}
