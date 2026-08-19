const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const renameMap = {
  'Atur Cara Fix.svg': 'atur-cara.svg',
  'Ayat Qur\\\'an with border & bg.svg': 'ayat-quran-border-bg.svg', // Watch out for escaping
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

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);

let changedFilesCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let hasChanges = false;

  for (const [oldName, newName] of Object.entries(renameMap)) {
    // Escape special characters for regex, or just use string replace loop
    let oldContent = content;
    
    // Some paths might be URL encoded in CSS or TSX, like %20 for space
    const urlEncodedOldName = encodeURIComponent(oldName).replace(/%20/g, ' ');
    const urlEncodedOldNameStrict = encodeURIComponent(oldName);

    // Replace literal occurrences
    if (content.includes(oldName)) {
      content = content.split(oldName).join(newName);
      hasChanges = true;
    }
    // Replace url encoded space occurrences
    if (content.includes(urlEncodedOldName)) {
      content = content.split(urlEncodedOldName).join(newName);
      hasChanges = true;
    }
    if (content.includes(urlEncodedOldNameStrict)) {
      content = content.split(urlEncodedOldNameStrict).join(newName);
      hasChanges = true;
    }
  }
  
  // Also replace references to optimized images
  // For Ilustrasi no bg.png which is now ilustrasi-no-bg.webp in optimized/
  // But wait, the original replace above replaced 'Ilustrasi no bg.png' with 'ilustrasi-no-bg.png'.
  // So now we can replace 'ilustrasi-no-bg.png' with 'optimized/ilustrasi-no-bg.webp'.
  if (content.includes('ilustrasi-no-bg.png')) {
    content = content.split('ilustrasi-no-bg.png').join('optimized/ilustrasi-no-bg.webp');
    hasChanges = true;
  }
  if (content.includes('background.png')) {
    content = content.split('background.png').join('optimized/background.webp');
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated references in ${file}`);
    changedFilesCount++;
  }
}

console.log(`Updated ${changedFilesCount} files.`);
