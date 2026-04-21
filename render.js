const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = './creatives/html';
const OUTPUT_DIR = './creatives/output';

const sizes = [
  { name: '336x280', width: 336, height: 280 },
  //{ name: '300x250', width: 300, height: 250 },
  //{ name: '320x100', width: 320, height: 100 }
];

(async () => {
  await fs.ensureDir(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const filePath = `file://${path.resolve(INPUT_DIR, file)}`;

    for (const size of sizes) {
      await page.setViewport({
        width: size.width,
        height: size.height,
        deviceScaleFactor: 2 // 🔥 retina quality
      });

      await page.goto(filePath, { waitUntil: 'networkidle0' });

      const tempPath = path.join(OUTPUT_DIR, `temp_${file}_${size.name}.png`);
      const finalPath = path.join(
        OUTPUT_DIR,
        `${file.replace('.html', '')}_${size.name}.png`
      );

      await page.screenshot({
        path: tempPath,
        clip: {
          x: 0,
          y: 0,
          width: size.width,
          height: size.height
        }
      });

      // 🔥 Compressão automática
      let quality = 90;
      let buffer = await sharp(tempPath).png({ quality }).toBuffer();

      while (buffer.length > 150 * 1024 && quality > 50) {
        quality -= 5;
        buffer = await sharp(tempPath).png({ quality }).toBuffer();
      }

      await fs.writeFile(finalPath, buffer);
      await fs.remove(tempPath);

      console.log(`✅ ${finalPath} (${Math.round(buffer.length / 1024)}kb)`);
    }
  }

  await browser.close();
})();