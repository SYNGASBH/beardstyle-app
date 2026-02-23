# ========================================
# DEPLOYMENT VERIFICATION SCRIPT
# ========================================
# Run this after deployment to verify everything is in place

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendAssets = Join-Path $ScriptDir "..\..\frontend\public\assets"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

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

$totalChecks = 0
$passedChecks = 0

Write-Host "Checking sketches..." -ForegroundColor Yellow
foreach ($style in $ExpectedStyles) {
    $totalChecks++
    $filePath = Join-Path $FrontendAssets "sketches\$style.webp"

    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length / 1KB
        Write-Host "  [OK] $style.webp ($([math]::Round($size, 1)) KB)" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  [X] $style.webp (MISSING)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking thumbnails..." -ForegroundColor Yellow
foreach ($style in $ExpectedStyles) {
    $totalChecks++
    $filePath = Join-Path $FrontendAssets "thumbnails\$style-thumb.webp"

    if (Test-Path $filePath) {
        Write-Host "  [OK] $style-thumb.webp" -ForegroundColor Green
        $passedChecks++
    } else {
        Write-Host "  [X] $style-thumb.webp (MISSING)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking manifest..." -ForegroundColor Yellow
$totalChecks++
$manifestPath = Join-Path $FrontendAssets "sketches\manifest.json"
if (Test-Path $manifestPath) {
    Write-Host "  [OK] manifest.json" -ForegroundColor Green
    $passedChecks++
} else {
    Write-Host "  [X] manifest.json (MISSING)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESULTS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Passed: $passedChecks / $totalChecks" -ForegroundColor $(if ($passedChecks -eq $totalChecks) { "Green" } else { "Yellow" })
Write-Host ""

if ($passedChecks -eq $totalChecks) {
    Write-Host "  ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Next steps:" -ForegroundColor White
    Write-Host "    1. cd frontend" -ForegroundColor Gray
    Write-Host "    2. npm start" -ForegroundColor Gray
    Write-Host "    3. Navigate to beard styles page" -ForegroundColor Gray
    Write-Host "    4. Verify images display correctly" -ForegroundColor Gray
} else {
    Write-Host "  SOME CHECKS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Run the pipeline again:" -ForegroundColor Yellow
    Write-Host "    .\run-full-pipeline.ps1" -ForegroundColor Gray
}

Write-Host ""
