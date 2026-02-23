# ========================================
# BEARD SKETCH QA VALIDATOR v2
# ========================================
# Enhanced validation with ML-compatible scoring
# Usage: .\qa-validator-v2.ps1 -ImagePath "path\to\image.png"
#        .\qa-validator-v2.ps1 -Folder ".\raw" -OutputJson

param(
    [string]$ImagePath,
    [string]$Folder,
    [switch]$OutputJson,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

# ========================================
# SCORE THRESHOLDS (from spec)
# ========================================
$Thresholds = @{
    crop_score = 0.90
    symmetry_score = 0.85
    background_score = 0.95
    graphite_score = 0.80
    off_spec_max = 0.15
}

# ========================================
# REASON CODES
# ========================================
$ReasonCodes = @{
    EYES_PRESENT = "Eyes visible in image"
    EARS_PRESENT = "Ears visible in image"
    UPPER_FACE_PRESENT = "Upper face (forehead/brows) visible"
    PERSPECTIVE_TILT = "Image has perspective tilt or rotation"
    ASYMMETRY = "Significant horizontal asymmetry"
    BACKGROUND_NOT_WHITE = "Background is not pure white"
    BACKGROUND_ELEMENTS = "Background contains elements/texture"
    TEXT_WATERMARK = "Text or watermark detected"
    NOT_GRAPHITE = "Not graphite illustration style"
    COLOR_TINT = "Color tint detected (not pure grayscale)"
    WRONG_DIMENSIONS = "Image dimensions not square or too small"
}

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
# SCORING FUNCTIONS
# ========================================

function Get-CropScore {
    param([string]$Path)

    $reasons = @()
    $score = 1.0

    # Check top portion (should be mostly white/empty - no eyes)
    $topBrightness = & $magickCmd $Path -gravity North -crop 100%x15%+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $topValue = [double]$topBrightness

    if ($topValue -lt 0.70) {
        $score -= 0.3
        $reasons += "UPPER_FACE_PRESENT"
    }

    # Check if image has content in the right places
    $centerBrightness = & $magickCmd $Path -gravity Center -crop 50%x30%+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $centerValue = [double]$centerBrightness

    # Center should have some content (not pure white)
    if ($centerValue -gt 0.95) {
        $score -= 0.2  # Might be empty/wrong crop
    }

    # Check sides for ears
    $leftSide = & $magickCmd $Path -gravity West -crop 15%x50%+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $rightSide = & $magickCmd $Path -gravity East -crop 15%x50%+0+0 +repage -format "%[fx:mean]" info: 2>$null
    $leftValue = [double]$leftSide
    $rightValue = [double]$rightSide

    # Sides should be mostly white (no ears)
    if ($leftValue -lt 0.85 -or $rightValue -lt 0.85) {
        $score -= 0.2
        $reasons += "EARS_PRESENT"
    }

    return @{
        Score = [math]::Max(0, $score)
        Reasons = $reasons
        Details = @{
            TopBrightness = [math]::Round($topValue * 100, 1)
            CenterBrightness = [math]::Round($centerValue * 100, 1)
            LeftSide = [math]::Round($leftValue * 100, 1)
            RightSide = [math]::Round($rightValue * 100, 1)
        }
    }
}

function Get-SymmetryScore {
    param([string]$Path)

    $reasons = @()
    $tempFlipped = [System.IO.Path]::GetTempFileName() + ".png"

    try {
        & $magickCmd $Path -flop $tempFlipped 2>$null
        $diff = & $magickCmd compare -metric RMSE $Path $tempFlipped null: 2>&1

        if ($diff -match "(\d+\.?\d*)") {
            $diffValue = [double]$matches[1]
            $diffPercent = ($diffValue / 65535) * 100

            # Convert to 0-1 score (lower diff = higher score)
            $score = 1.0 - [math]::Min(1.0, $diffPercent / 30)

            if ($diffPercent -gt 20) {
                $reasons += "PERSPECTIVE_TILT"
            }
            if ($diffPercent -gt 15) {
                $reasons += "ASYMMETRY"
            }

            return @{
                Score = [math]::Round($score, 3)
                Reasons = $reasons
                Details = @{
                    DifferencePercent = [math]::Round($diffPercent, 1)
                }
            }
        }
    }
    finally {
        Remove-Item $tempFlipped -ErrorAction SilentlyContinue
    }

    return @{
        Score = 0.5
        Reasons = @()
        Details = @{}
    }
}

function Get-BackgroundScore {
    param([string]$Path)

    $reasons = @()

    # Sample multiple corners
    $corners = @(
        @{ Gravity = "NorthWest"; Crop = "50x50+0+0" },
        @{ Gravity = "NorthEast"; Crop = "50x50+0+0" },
        @{ Gravity = "SouthWest"; Crop = "50x50+0+0" },
        @{ Gravity = "SouthEast"; Crop = "50x50+0+0" }
    )

    $brightnessValues = @()
    foreach ($corner in $corners) {
        $brightness = & $magickCmd $Path -gravity $corner.Gravity -crop $corner.Crop +repage -format "%[fx:mean]" info: 2>$null
        $brightnessValues += [double]$brightness
    }

    $avgBrightness = ($brightnessValues | Measure-Object -Average).Average
    $minBrightness = ($brightnessValues | Measure-Object -Minimum).Minimum

    # Check for variance (might indicate gradient or elements)
    $variance = 0
    foreach ($val in $brightnessValues) {
        $variance += [math]::Pow($val - $avgBrightness, 2)
    }
    $variance = [math]::Sqrt($variance / $brightnessValues.Count)

    $score = $minBrightness  # Use minimum as score

    if ($minBrightness -lt 0.90) {
        $reasons += "BACKGROUND_NOT_WHITE"
    }
    if ($variance -gt 0.05) {
        $reasons += "BACKGROUND_ELEMENTS"
        $score -= 0.1
    }

    return @{
        Score = [math]::Max(0, [math]::Round($score, 3))
        Reasons = $reasons
        Details = @{
            AverageBrightness = [math]::Round($avgBrightness * 100, 1)
            MinBrightness = [math]::Round($minBrightness * 100, 1)
            Variance = [math]::Round($variance * 100, 2)
        }
    }
}

function Get-GraphiteScore {
    param([string]$Path)

    $reasons = @()

    # Check saturation (grayscale = low saturation)
    $saturation = & $magickCmd $Path -colorspace HSL -channel G -separate +channel -format "%[fx:mean]" info: 2>$null
    $satValue = [double]$saturation

    # Check for color tint
    if ($satValue -gt 0.05) {
        $reasons += "COLOR_TINT"
    }
    if ($satValue -gt 0.10) {
        $reasons += "NOT_GRAPHITE"
    }

    # Grayscale score (inverse of saturation)
    $grayscaleScore = 1.0 - [math]::Min(1.0, $satValue * 10)

    # Check for graphite characteristics (contrast, texture)
    $stdDev = & $magickCmd $Path -format "%[fx:standard_deviation]" info: 2>$null
    $stdDevValue = [double]$stdDev

    # Good graphite has moderate contrast (not too flat, not too harsh)
    $contrastScore = 1.0
    if ($stdDevValue -lt 0.1) {
        $contrastScore = 0.7  # Too flat
    } elseif ($stdDevValue -gt 0.4) {
        $contrastScore = 0.8  # Too harsh
    }

    $score = ($grayscaleScore * 0.7) + ($contrastScore * 0.3)

    return @{
        Score = [math]::Round($score, 3)
        Reasons = $reasons
        Details = @{
            Saturation = [math]::Round($satValue * 100, 2)
            StdDeviation = [math]::Round($stdDevValue * 100, 1)
        }
    }
}

function Get-DimensionsCheck {
    param([string]$Path)

    $reasons = @()

    $info = & $magickCmd identify -format "%w %h" $Path 2>$null
    $parts = $info -split " "
    $width = [int]$parts[0]
    $height = [int]$parts[1]

    $isSquare = ($width -eq $height)
    $isLargeEnough = ($width -ge 400 -and $height -ge 400)
    $aspectRatio = if ($height -gt 0) { $width / $height } else { 0 }

    $pass = $isSquare -and $isLargeEnough

    if (-not $pass) {
        $reasons += "WRONG_DIMENSIONS"
    }

    return @{
        Pass = $pass
        Reasons = $reasons
        Details = @{
            Width = $width
            Height = $height
            AspectRatio = [math]::Round($aspectRatio, 2)
            IsSquare = $isSquare
            IsLargeEnough = $isLargeEnough
        }
    }
}

# ========================================
# MAIN VALIDATION FUNCTION
# ========================================

function Validate-BeardSketchV2 {
    param([string]$Path)

    $filename = [System.IO.Path]::GetFileName($Path)
    $imageId = [System.IO.Path]::GetFileNameWithoutExtension($Path)

    # Run all checks
    $dimCheck = Get-DimensionsCheck -Path $Path
    $cropResult = Get-CropScore -Path $Path
    $symmetryResult = Get-SymmetryScore -Path $Path
    $backgroundResult = Get-BackgroundScore -Path $Path
    $graphiteResult = Get-GraphiteScore -Path $Path

    # Calculate off-spec score (aggregate of issues)
    $allReasons = @()
    $allReasons += $dimCheck.Reasons
    $allReasons += $cropResult.Reasons
    $allReasons += $symmetryResult.Reasons
    $allReasons += $backgroundResult.Reasons
    $allReasons += $graphiteResult.Reasons
    $allReasons = $allReasons | Select-Object -Unique

    $offSpecScore = $allReasons.Count * 0.1
    $offSpecScore = [math]::Min(1.0, $offSpecScore)

    # Determine acceptance
    $accepted = (
        $dimCheck.Pass -and
        $cropResult.Score -ge $Thresholds.crop_score -and
        $symmetryResult.Score -ge $Thresholds.symmetry_score -and
        $backgroundResult.Score -ge $Thresholds.background_score -and
        $graphiteResult.Score -ge $Thresholds.graphite_score -and
        $offSpecScore -le $Thresholds.off_spec_max
    )

    # Build result object (ML-compatible format)
    $result = @{
        image_id = $imageId
        filename = $filename
        quality = @{
            accepted = $accepted
            reasons = $allReasons
            scores = @{
                crop_score = $cropResult.Score
                symmetry_score = $symmetryResult.Score
                background_score = $backgroundResult.Score
                graphite_score = $graphiteResult.Score
                off_spec_score = [math]::Round($offSpecScore, 2)
            }
        }
        crop = @{
            only_lower_face = ($cropResult.Score -ge 0.8)
            nostrils_visible = $true  # Assumed if crop is good
            eyes_absent = -not ($allReasons -contains "EYES_PRESENT" -or $allReasons -contains "UPPER_FACE_PRESENT")
            ears_absent = -not ($allReasons -contains "EARS_PRESENT")
        }
        style = @{
            graphite = ($graphiteResult.Score -ge 0.7)
            grayscale_only = -not ($allReasons -contains "COLOR_TINT")
            white_background = ($backgroundResult.Score -ge 0.90)
        }
        details = @{
            dimensions = $dimCheck.Details
            crop = $cropResult.Details
            symmetry = $symmetryResult.Details
            background = $backgroundResult.Details
            graphite = $graphiteResult.Details
        }
    }

    return $result
}

# ========================================
# OUTPUT FUNCTIONS
# ========================================

function Show-ValidationResult {
    param($Result)

    $q = $Result.quality
    $scores = $q.scores

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  QA VALIDATION: $($Result.filename)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    # Scores
    Write-Host ""
    Write-Host "SCORES:" -ForegroundColor Yellow

    $scoreItems = @(
        @{ Name = "Crop"; Value = $scores.crop_score; Threshold = $Thresholds.crop_score },
        @{ Name = "Symmetry"; Value = $scores.symmetry_score; Threshold = $Thresholds.symmetry_score },
        @{ Name = "Background"; Value = $scores.background_score; Threshold = $Thresholds.background_score },
        @{ Name = "Graphite"; Value = $scores.graphite_score; Threshold = $Thresholds.graphite_score },
        @{ Name = "Off-Spec"; Value = $scores.off_spec_score; Threshold = $Thresholds.off_spec_max; Invert = $true }
    )

    foreach ($item in $scoreItems) {
        $pct = [math]::Round($item.Value * 100, 1)
        $threshPct = [math]::Round($item.Threshold * 100, 1)

        if ($item.Invert) {
            $pass = $item.Value -le $item.Threshold
            $symbol = "<="
        } else {
            $pass = $item.Value -ge $item.Threshold
            $symbol = ">="
        }

        $icon = if ($pass) { "[OK]" } else { "[X]" }
        $color = if ($pass) { "Green" } else { "Red" }

        Write-Host "  $icon $($item.Name): ${pct}% ($symbol ${threshPct}%)" -ForegroundColor $color
    }

    # Validation checks
    Write-Host ""
    Write-Host "CHECKS:" -ForegroundColor Yellow

    $checks = @(
        @{ Name = "Lower face only"; Value = $Result.crop.only_lower_face },
        @{ Name = "No eyes"; Value = $Result.crop.eyes_absent },
        @{ Name = "No ears"; Value = $Result.crop.ears_absent },
        @{ Name = "Graphite style"; Value = $Result.style.graphite },
        @{ Name = "Grayscale"; Value = $Result.style.grayscale_only },
        @{ Name = "White background"; Value = $Result.style.white_background }
    )

    foreach ($check in $checks) {
        $icon = if ($check.Value) { "[OK]" } else { "[X]" }
        $color = if ($check.Value) { "Green" } else { "Red" }
        Write-Host "  $icon $($check.Name)" -ForegroundColor $color
    }

    # Reasons
    if ($q.reasons.Count -gt 0) {
        Write-Host ""
        Write-Host "ISSUES:" -ForegroundColor Yellow
        foreach ($reason in $q.reasons) {
            $desc = $ReasonCodes[$reason]
            if (-not $desc) { $desc = $reason }
            Write-Host "  - $reason : $desc" -ForegroundColor Red
        }
    }

    # Summary
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    if ($q.accepted) {
        Write-Host "  RESULT: PASSED" -ForegroundColor Green
        Write-Host "  Image is ready for processing!" -ForegroundColor Green
    } else {
        Write-Host "  RESULT: FAILED" -ForegroundColor Red
        Write-Host "  Fix issues and regenerate" -ForegroundColor Yellow
    }
    Write-Host "========================================" -ForegroundColor Cyan
}

# ========================================
# ENTRY POINT
# ========================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BEARD SKETCH QA VALIDATOR v2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$results = @()

if ($ImagePath) {
    if (Test-Path $ImagePath) {
        $result = Validate-BeardSketchV2 -Path $ImagePath
        $results += $result

        if ($OutputJson) {
            $result | ConvertTo-Json -Depth 5
        } else {
            Show-ValidationResult -Result $result
        }
    } else {
        Write-Host "ERROR: File not found: $ImagePath" -ForegroundColor Red
    }
}
elseif ($Folder) {
    if (Test-Path $Folder) {
        $images = Get-ChildItem -Path $Folder -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|webp)$' }

        foreach ($img in $images) {
            $result = Validate-BeardSketchV2 -Path $img.FullName
            $results += $result

            if (-not $OutputJson) {
                Show-ValidationResult -Result $result
            }
        }

        if ($OutputJson) {
            @{
                validated = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                thresholds = $Thresholds
                results = $results
            } | ConvertTo-Json -Depth 5
        } else {
            # Batch summary
            $passed = ($results | Where-Object { $_.quality.accepted }).Count
            $failed = ($results | Where-Object { -not $_.quality.accepted }).Count

            Write-Host ""
            Write-Host "============================================" -ForegroundColor Cyan
            Write-Host "  BATCH SUMMARY" -ForegroundColor Cyan
            Write-Host "============================================" -ForegroundColor Cyan
            Write-Host "  Total: $($results.Count)" -ForegroundColor White
            Write-Host "  Passed: $passed" -ForegroundColor Green
            Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

            if ($failed -gt 0) {
                Write-Host ""
                Write-Host "  FAILED FILES:" -ForegroundColor Red
                foreach ($r in ($results | Where-Object { -not $_.quality.accepted })) {
                    Write-Host "    - $($r.filename)" -ForegroundColor Red
                }
            }
            Write-Host "============================================" -ForegroundColor Cyan
        }
    } else {
        Write-Host "ERROR: Folder not found: $Folder" -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\qa-validator-v2.ps1 -ImagePath 'path\to\image.png'" -ForegroundColor Gray
    Write-Host "  .\qa-validator-v2.ps1 -Folder '.\raw'" -ForegroundColor Gray
    Write-Host "  .\qa-validator-v2.ps1 -Folder '.\raw' -OutputJson > results.json" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Thresholds:" -ForegroundColor Yellow
    Write-Host "  crop_score      >= $($Thresholds.crop_score * 100)%" -ForegroundColor Gray
    Write-Host "  symmetry_score  >= $($Thresholds.symmetry_score * 100)%" -ForegroundColor Gray
    Write-Host "  background_score >= $($Thresholds.background_score * 100)%" -ForegroundColor Gray
    Write-Host "  graphite_score  >= $($Thresholds.graphite_score * 100)%" -ForegroundColor Gray
    Write-Host "  off_spec_score  <= $($Thresholds.off_spec_max * 100)%" -ForegroundColor Gray
    Write-Host ""
}
