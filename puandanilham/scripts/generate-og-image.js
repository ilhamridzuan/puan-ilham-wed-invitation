const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const bgPath = path.join(__dirname, '../public/assets/background.png');
const outPath = path.join(__dirname, '../public/og-image.jpg');

async function main() {
  if (fs.existsSync(bgPath)) {
    await sharp(bgPath)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(outPath);
    console.log('Created og-image.jpg');
  } else {
    console.log('background.png not found');
  }
}

main();
