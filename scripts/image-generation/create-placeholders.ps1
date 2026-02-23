# ========================================
# CREATE PLACEHOLDER SVG IMAGES
# ========================================
# Creates placeholder SVG images for testing the app
# These will be replaced with actual Midjourney images later

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SketchesDir = Join-Path $ScriptDir "..\..\frontend\public\assets\sketches"
$ThumbsDir = Join-Path $ScriptDir "..\..\frontend\public\assets\thumbnails"

# Create directories
New-Item -ItemType Directory -Force -Path $SketchesDir | Out-Null
New-Item -ItemType Directory -Force -Path $ThumbsDir | Out-Null

$styles = @(
    @{slug="full-beard"; name="Full Beard"; beardPath="M100,280 Q200,320 300,280 L300,350 Q200,400 100,350 Z M150,200 L150,280 M250,200 L250,280"},
    @{slug="stubble-3day"; name="Stubble"; beardPath=""},
    @{slug="van-dyke"; name="Van Dyke"; beardPath="M180,250 L200,320 L220,250 M160,200 Q200,180 240,200"},
    @{slug="clean-shaven"; name="Clean Shaven"; beardPath=""},
    @{slug="short-boxed-beard"; name="Short Boxed"; beardPath="M120,240 L120,300 L280,300 L280,240 Q200,260 120,240"},
    @{slug="corporate-beard"; name="Corporate"; beardPath="M130,250 Q200,280 270,250 L270,310 Q200,340 130,310 Z"},
    @{slug="goatee"; name="Goatee"; beardPath="M170,250 L200,320 L230,250 Q200,240 170,250"},
    @{slug="balbo"; name="Balbo"; beardPath="M170,270 L200,330 L230,270 M150,200 Q200,190 250,200"},
    @{slug="circle-beard"; name="Circle Beard"; beardPath="M160,220 A50,60 0 1,0 240,220 A50,60 0 1,0 160,220"},
    @{slug="ducktail"; name="Ducktail"; beardPath="M100,250 Q200,280 300,250 L200,380 Z"},
    @{slug="garibaldi"; name="Garibaldi"; beardPath="M80,240 Q200,280 320,240 L320,380 Q200,420 80,380 Z"},
    @{slug="mutton-chops"; name="Mutton Chops"; beardPath="M80,180 L80,300 L140,280 L140,180 M260,180 L260,280 L320,300 L320,180"},
    @{slug="anchor-beard"; name="Anchor Beard"; beardPath="M200,200 L200,340 M160,340 L240,340 M120,260 L200,300 L280,260"},
    @{slug="chin-strap"; name="Chin Strap"; beardPath="M100,260 Q200,300 300,260"},
    @{slug="beardstache"; name="Beardstache"; beardPath="M130,260 Q200,290 270,260 L270,300 Q200,320 130,300 Z M140,200 Q200,180 260,200 L260,220 Q200,200 140,220 Z"}
)

foreach ($style in $styles) {
    $slug = $style.slug
    $name = $style.name
    $beardPath = $style.beardPath

    # Determine beard elements based on style
    $beardElements = ""
    $stubblePattern = ""

    if ($slug -eq "stubble-3day") {
        # Stippling pattern for stubble
        $stubblePattern = @"
    <defs>
        <pattern id="stubble" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#666"/>
            <circle cx="6" cy="6" r="0.8" fill="#555"/>
            <circle cx="4" cy="4" r="0.6" fill="#777"/>
        </pattern>
    </defs>
    <ellipse cx="200" cy="280" rx="100" ry="80" fill="url(#stubble)" opacity="0.6"/>
"@
    } elseif ($slug -eq "clean-shaven") {
        # Just jawline, no beard
        $beardElements = ""
    } else {
        $beardElements = @"
    <path d="$beardPath" fill="none" stroke="#2D2D2D" stroke-width="2" opacity="0.8"/>
    <path d="$beardPath" fill="#E5E5E5" opacity="0.3"/>
"@
    }

    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <!-- Background -->
    <rect width="400" height="400" fill="#FAFAFA"/>

    <!-- Face outline (lower third only) -->
    <path d="M100,50 Q100,180 100,250 Q200,350 300,250 Q300,180 300,50"
          fill="none" stroke="#CCCCCC" stroke-width="1.5" opacity="0.5"/>

    <!-- Jawline -->
    <path d="M100,250 Q200,330 300,250"
          fill="none" stroke="#999" stroke-width="2"/>

    <!-- Nose hint (bottom only) -->
    <ellipse cx="200" cy="60" rx="25" ry="15" fill="none" stroke="#CCC" stroke-width="1"/>

    <!-- Lips -->
    <path d="M170,180 Q200,195 230,180" fill="none" stroke="#AAA" stroke-width="1.5"/>
    <path d="M175,185 Q200,200 225,185" fill="none" stroke="#BBB" stroke-width="1"/>

    $stubblePattern
    $beardElements

    <!-- Style label -->
    <text x="200" y="385" text-anchor="middle" font-family="Arial, sans-serif"
          font-size="14" fill="#666" font-weight="500">$name</text>

    <!-- Technical marks -->
    <line x1="50" y1="250" x2="70" y2="250" stroke="#4A90D9" stroke-width="1" opacity="0.5"/>
    <line x1="330" y1="250" x2="350" y2="250" stroke="#4A90D9" stroke-width="1" opacity="0.5"/>
</svg>
"@

    # Save main sketch
    $svgPath = Join-Path $SketchesDir "$slug.svg"
    $svg | Out-File -FilePath $svgPath -Encoding UTF8
    Write-Host "[OK] Created: $slug.svg" -ForegroundColor Green

    # Save thumbnail (same SVG, will be scaled by browser)
    $thumbPath = Join-Path $ThumbsDir "$slug-thumb.svg"
    $svg | Out-File -FilePath $thumbPath -Encoding UTF8
}

# Create manifest
$manifest = @{
    generated = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    format = "svg"
    note = "Placeholder images - replace with Midjourney WebP"
    styles = @()
}

foreach ($style in $styles) {
    $manifest.styles += @{
        slug = $style.slug
        name = $style.name
        main = "/assets/sketches/$($style.slug).svg"
        thumbnail = "/assets/thumbnails/$($style.slug)-thumb.svg"
    }
}

$manifestPath = Join-Path $SketchesDir "manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Out-File -FilePath $manifestPath -Encoding UTF8
Write-Host "[OK] Created: manifest.json" -ForegroundColor Green

Write-Host ""
Write-Host "Done! Created $($styles.Count) placeholder SVG images." -ForegroundColor Cyan
Write-Host "These are placeholders - replace with actual Midjourney images later." -ForegroundColor Yellow
