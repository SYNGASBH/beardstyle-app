"""
Convert PNG beard sketches to WebP format
Usage: python convert-to-webp.py
"""

from PIL import Image, ImageOps
import os

RAW_DIR = './raw'
OUTPUT_DIR = '../../frontend/public/assets/sketches'

# File mapping (raw name -> output name)
FILE_MAP = {
    'Stubble (3-Day Shadow).png': 'stubble-3day.webp',
    'van-dyke.png': 'van-dyke.webp',
    'full-beard.png': 'full-beard.webp',
    'ducktail.png': 'ducktail.webp',
}

def convert_image(input_name, output_name):
    input_path = os.path.join(RAW_DIR, input_name)
    output_path = os.path.join(OUTPUT_DIR, output_name)

    if not os.path.exists(input_path):
        print(f"  [SKIP] {input_name} - file not found")
        return False

    try:
        # Open image
        img = Image.open(input_path)

        # Convert to grayscale
        img = img.convert('L')

        # Normalize (auto-contrast)
        img = ImageOps.autocontrast(img)

        # Resize to 800x800 with white background
        img.thumbnail((800, 800), Image.Resampling.LANCZOS)

        # Create white background and paste
        background = Image.new('L', (800, 800), 255)
        offset = ((800 - img.width) // 2, (800 - img.height) // 2)
        background.paste(img, offset)

        # Convert back to RGB for WebP
        rgb_img = Image.new('RGB', (800, 800), (255, 255, 255))
        rgb_img.paste(Image.merge('RGB', [background, background, background]))

        # Save as WebP
        rgb_img.save(output_path, 'WEBP', quality=85)

        file_size = os.path.getsize(output_path) / 1024
        print(f"  [OK] {input_name} -> {output_name} ({file_size:.0f}KB)")
        return True

    except Exception as e:
        print(f"  [ERR] Error converting {input_name}: {e}")
        return False

def main():
    print("\n[*] Converting PNG to WebP...\n")

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    success = 0
    failed = 0

    for input_name, output_name in FILE_MAP.items():
        if convert_image(input_name, output_name):
            success += 1
        else:
            failed += 1

    print(f"\n[OK] Done: {success} converted, {failed} skipped/failed\n")

if __name__ == '__main__':
    main()
