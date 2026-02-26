$RawDir       = "C:\Users\User\Desktop\beard-style-app\scripts\image-generation\raw"
$ProcessedDir = "C:\Users\User\Desktop\beard-style-app\scripts\image-generation\processed"
$MainSize  = "800x800"
$ThumbSize = "400x400"
$Quality   = 85

if (!(Test-Path $ProcessedDir)) { New-Item -ItemType Directory -Path $ProcessedDir | Out-Null }

$files = Get-ChildItem -Path $RawDir -Filter *.png -Recurse

foreach ($file in $files) {
    $relativePath = $file.DirectoryName.Replace($RawDir, "")
    $targetFolder = Join-Path $ProcessedDir $relativePath
    if (!(Test-Path $targetFolder)) { New-Item -ItemType Directory -Path $targetFolder | Out-Null }

    $baseName    = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $mainOutput  = Join-Path $targetFolder "$baseName.webp"
    $thumbOutput = Join-Path $targetFolder "$baseName-thumb.webp"

    Write-Host "Processing $($file.Name) ..." -ForegroundColor Yellow

    magick $file.FullName `
        -resize $MainSize `
        -colorspace Gray `
        -level 5%,95% `
        -background white -alpha remove -alpha off `
        -quality $Quality `
        $mainOutput

    magick $file.FullName `
        -resize $ThumbSize `
        -colorspace Gray `
        -background white -alpha remove -alpha off `
        -quality $Quality `
        $thumbOutput

    Write-Host "  main:  $mainOutput" -ForegroundColor Green
    Write-Host "  thumb: $thumbOutput" -ForegroundColor Green
}

Write-Host "All done." -ForegroundColor Cyan
