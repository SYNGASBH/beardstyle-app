/**
 * Download Professional Beard Style Images
 *
 * This script downloads high-quality images from Unsplash for each beard style
 * Images are royalty-free and can be used commercially
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Get from https://unsplash.com/developers

// Beard styles with specific search queries
const beardStyles = [
  { filename: 'full-beard.jpg', query: 'man full thick beard portrait professional' },
  { filename: 'stubble-3day.jpg', query: 'man stubble 3 day shadow portrait' },
  { filename: 'clean-shaven.jpg', query: 'clean shaven man portrait professional' },
  { filename: 'short-boxed-beard.jpg', query: 'man short trimmed boxed beard portrait' },
  { filename: 'corporate-beard.jpg', query: 'businessman beard corporate professional portrait' },
  { filename: 'goatee.jpg', query: 'man goatee beard portrait' },
  { filename: 'van-dyke.jpg', query: 'man van dyke beard pointed mustache' },
  { filename: 'balbo.jpg', query: 'man balbo beard disconnected mustache' },
  { filename: 'circle-beard.jpg', query: 'man circle beard round goatee' },
  { filename: 'ducktail.jpg', query: 'man ducktail beard pointed full' },
  { filename: 'garibaldi.jpg', query: 'man garibaldi full round thick beard' },
  { filename: 'mutton-chops.jpg', query: 'man mutton chops sideburns beard' },
  { filename: 'anchor-beard.jpg', query: 'man anchor beard soul patch' },
  { filename: 'chin-strap.jpg', query: 'man chin strap jawline beard' },
  { filename: 'beardstache.jpg', query: 'man thick mustache beardstache full beard' }
];

const outputDir = path.join(__dirname, 'frontend', 'public', 'assets', 'styles');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Download image from Unsplash
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Search Unsplash for image
 */
async function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.unsplash.com',
      path: `/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=1`,
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            resolve(result.results[0].urls.regular);
          } else {
            reject(new Error('No images found'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download all beard style images
 */
async function downloadAllImages() {
  console.log('🎨 Starting beard style image download...\n');

  for (const style of beardStyles) {
    try {
      console.log(`📥 Downloading: ${style.filename}`);
      console.log(`   Query: ${style.query}`);

      const imageUrl = await searchUnsplash(style.query);
      const filepath = path.join(outputDir, style.filename);

      await downloadImage(imageUrl, filepath);
      console.log(`✅ Saved: ${style.filename}\n`);

      // Wait 1 second between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ Failed to download ${style.filename}:`, err.message);
      console.log('');
    }
  }

  console.log('🎉 Download complete!\n');
  console.log('📁 Images saved to:', outputDir);
  console.log('\n✨ Next steps:');
  console.log('1. Check the images in frontend/public/assets/styles/');
  console.log('2. Restart the frontend: docker-compose restart frontend');
  console.log('3. Visit http://localhost:3000/gallery to see the images!');
}

// Check if access key is set
if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
  console.log('\n⚠️  Unsplash Access Key Not Set!\n');
  console.log('To use this script:');
  console.log('1. Go to https://unsplash.com/developers');
  console.log('2. Create a free account');
  console.log('3. Create a new application');
  console.log('4. Copy the "Access Key"');
  console.log('5. Replace YOUR_UNSPLASH_ACCESS_KEY in this file\n');
  console.log('───────────────────────────────────────────────────────');
  console.log('\n🔄 ALTERNATIVE: Manual Download\n');
  console.log('Visit these URLs and download images manually:\n');

  beardStyles.forEach(style => {
    const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(style.query)}`;
    console.log(`${style.filename}:`);
    console.log(`  ${searchUrl}\n`);
  });

  process.exit(1);
}

// Run the download
downloadAllImages().catch(console.error);
