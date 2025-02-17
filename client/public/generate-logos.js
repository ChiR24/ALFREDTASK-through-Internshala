const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateLogos() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, 'logo.svg'));

  // Generate PNG versions
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, 'logo192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'logo512.png'));

  // Generate favicon sizes
  const faviconSizes = [16, 32, 48];
  for (const size of faviconSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `favicon-${size}x${size}.png`));
  }

  console.log('✓ Generated logo files successfully!');
}

generateLogos().catch(console.error); 