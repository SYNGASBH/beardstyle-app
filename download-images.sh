#!/bin/bash

# Beard Style Images - Auto Download Script
# Downloads professional beard style images from Pexels (free, no API key needed)

echo "🎨 Beard Style App - Image Download Script"
echo "=========================================="
echo ""

# Navigate to the correct directory
cd "$(dirname "$0")/frontend/public/assets/styles" || exit 1

echo "📁 Downloading to: $(pwd)"
echo ""

# Array of images with their URLs
declare -A images=(
  ["full-beard.jpg"]="https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["stubble-3day.jpg"]="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["clean-shaven.jpg"]="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["short-boxed-beard.jpg"]="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["corporate-beard.jpg"]="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["goatee.jpg"]="https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["van-dyke.jpg"]="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["balbo.jpg"]="https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["circle-beard.jpg"]="https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["ducktail.jpg"]="https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["garibaldi.jpg"]="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["mutton-chops.jpg"]="https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["anchor-beard.jpg"]="https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["chin-strap.jpg"]="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800"
  ["beardstache.jpg"]="https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg?auto=compress&cs=tinysrgb&w=800"
)

# Counter
total=${#images[@]}
current=0
success=0
failed=0

# Download each image
for filename in "${!images[@]}"; do
  ((current++))
  url="${images[$filename]}"

  echo "[$current/$total] Downloading: $filename"

  if curl -sS -L -o "$filename" "$url"; then
    # Check if file was actually created and is not empty
    if [ -s "$filename" ]; then
      size=$(du -h "$filename" | cut -f1)
      echo "✅ Success! ($size)"
      ((success++))
    else
      echo "❌ Failed - Empty file"
      rm -f "$filename"
      ((failed++))
    fi
  else
    echo "❌ Failed - Download error"
    ((failed++))
  fi

  echo ""

  # Small delay to be nice to the server
  sleep 0.5
done

echo "=========================================="
echo "📊 Download Summary:"
echo "   Total: $total images"
echo "   ✅ Success: $success"
echo "   ❌ Failed: $failed"
echo ""

if [ $success -eq $total ]; then
  echo "🎉 All images downloaded successfully!"
  echo ""
  echo "📁 Images location:"
  echo "   $(pwd)"
  echo ""
  echo "🔄 Next steps:"
  echo "   1. Check the images look good"
  echo "   2. Restart frontend: docker-compose restart frontend"
  echo "   3. Visit: http://localhost:3000/gallery"
  echo ""
  echo "✨ Enjoy your complete beard style gallery!"
else
  echo "⚠️  Some images failed to download."
  echo "   You can manually download missing images from:"
  echo "   https://www.pexels.com/search/man%20beard%20portrait/"
  echo ""
  echo "   Or re-run this script to try again."
fi

echo ""
