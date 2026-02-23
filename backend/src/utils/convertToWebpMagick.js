const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const WIDTHS = [400, 800, 1200];

function runMagick(args) {
  return new Promise((resolve, reject) => {
    execFile("magick", args, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve({ stdout, stderr });
    });
  });
}

async function convertToWebp(inputPath, opts = {}) {
  const { lossless = false, quality = 92 } = opts;
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

  const args = [
    inputPath,
    ...(lossless
      ? ["-define", "webp:lossless=true"]
      : ["-quality", String(quality)]),
    outputPath,
  ];

  await runMagick(args);

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(inputPath);
  }

  return outputPath;
}

async function convertVariants(inputPath, opts = {}) {
  const { widths = WIDTHS, quality = 85 } = opts;
  const ext = path.extname(inputPath);
  const base = inputPath.replace(ext, "");
  const variants = [];

  for (const w of widths) {
    const outFile = `${base}-${w}w.webp`;
    await runMagick([
      inputPath,
      "-resize",
      `${w}x`,
      "-quality",
      String(quality),
      outFile,
    ]);

    const stats = fs.statSync(outFile);
    const filename = path.basename(outFile);

    variants.push({
      width: w,
      filename,
      url: `/uploads/${filename}`,
      size: stats.size,
    });
  }

  // remove original after all variants are created
  if (variants.length === widths.length) {
    fs.unlinkSync(inputPath);
  }

  return variants;
}

module.exports = { convertToWebp, convertVariants };
