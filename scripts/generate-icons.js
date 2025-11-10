const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('Генерация иконок из favicon.svg...\n');

  for (const { name, size } of sizes) {
    const outputPath = path.join(outputDir, name);

    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Создан ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Ошибка при создании ${name}:`, error.message);
    }
  }

  // Копируем SVG для Safari pinned tab
  const safariPinnedTab = path.join(outputDir, 'safari-pinned-tab.svg');
  if (!fs.existsSync(safariPinnedTab)) {
    fs.copyFileSync(inputFile, safariPinnedTab);
    console.log('✓ Создан safari-pinned-tab.svg');
  }

  console.log('\n✓ Все иконки успешно созданы!');
}

generateIcons().catch(console.error);
