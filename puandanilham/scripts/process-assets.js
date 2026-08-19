const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, '../public/assets');
const optimizedDir = path.join(assetsDir, 'optimized');

if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Phase 1.2
async function optimizeImages() {
  console.log('Optimizing images...');
  
  const ilustrasiPath = path.join(assetsDir, 'Ilustrasi no bg.png');
  if (fs.existsSync(ilustrasiPath)) {
    await sharp(ilustrasiPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(optimizedDir, 'ilustrasi-no-bg.webp'));
    console.log('Optimized Ilustrasi no bg.png -> ilustrasi-no-bg.webp');
  }

  const bgPath = path.join(assetsDir, 'Backgroudn.png');
  if (fs.existsSync(bgPath)) {
    await sharp(bgPath)
      .webp({ quality: 75 })
      .toFile(path.join(optimizedDir, 'background.webp'));
    console.log('Optimized Backgroudn.png -> background.webp');
  }
}

// Phase 1.3
const renameMap = {
  'Atur Cara Fix.svg': 'atur-cara.svg',
  'Ayat Qur\'an with border & bg.svg': 'ayat-quran-border-bg.svg',
  'Backgroudn.png': 'background.png',
  'Border Floral 1.svg': 'border-floral.svg',
  'Dress Code Illustration.svg': 'dress-code-illustration.svg',
  'Flower Decoration Pop.gif': 'flower-decoration-pop.gif',
  'Flower Pattern.png': 'flower-pattern.png',
  'Ilustrasi no bg.png': 'ilustrasi-no-bg.png',
  'Kalimat Jemputan Fix.svg': 'kalimat-jemputan.svg',
  'Kalimat Jemputan (gelar lengkap).svg': 'kalimat-jemputan-gelar-lengkap.svg',
  'Location Ilustration.svg': 'location-illustration.svg',
  'Puan&Ilham.svg': 'puan-dan-ilham.svg',
  'September 4th Calendar.svg': 'september-4th-calendar.svg',
  'Title Main Section.svg': 'title-main-section.svg',
  'Title Onboarding.svg': 'title-onboarding.svg',
  'Title Photobooth.svg': 'title-photobooth.svg',
  'Strip Photobooth 1 Photo.svg': 'strip-photobooth-1-photo.svg',
  'Strip Photobooth 2 Photo.svg': 'strip-photobooth-2-photo.svg',
  'Strip Photobooth 4 Photo.svg': 'strip-photobooth-4-photo.svg',
  'Date&Time.svg': 'date-time.svg',
  'Ilustrasi with border.svg': 'ilustrasi-with-border.svg',
  'Logo Website Jemputan.svg': 'logo-website-jemputan.svg',
  'Texture.png': 'texture.png',
  'Dayang Nurfaizah, Hael Husaini - Gurindam Jiwa (Official Music Video).mp3': 'gurindam-jiwa.mp3'
};

async function renameFiles() {
  console.log('Renaming files...');
  for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldPath = path.join(assetsDir, oldName);
    const newPath = path.join(assetsDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldName} -> ${newName}`);
    } else {
      console.log(`Skipped (not found): ${oldName}`);
    }
  }
}

async function convertGif() {
  const gifPath = path.join(assetsDir, 'flower-decoration-pop.gif'); // After rename
  const webmPath = path.join(optimizedDir, 'flower-decoration-pop.webm');
  
  if (fs.existsSync(gifPath)) {
    try {
      console.log('Converting GIF to WebM using ffmpeg...');
      execSync(`ffmpeg -i "${gifPath}" -c:v libvpx-vp9 -b:v 0 -crf 30 -pix_fmt yuva420p -y "${webmPath}"`, { stdio: 'ignore' });
      console.log('GIF converted successfully.');
    } catch (e) {
      console.log('ffmpeg failed or not available, skipping GIF to video conversion.', e.message);
    }
  }
}

async function main() {
  await optimizeImages();
  await renameFiles();
  await convertGif();
  console.log('Done!');
}

main();
