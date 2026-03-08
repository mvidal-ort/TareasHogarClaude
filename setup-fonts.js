#!/usr/bin/env node
/**
 * setup-fonts.js
 * Descarga las fuentes de Google Fonts automáticamente.
 * Ejecutar con: node setup-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, 'assets', 'fonts');

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const FONTS = [
  // Nunito
  { name: 'Nunito-Regular.ttf',    url: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDOUhdTO3ew.ttf' },
  { name: 'Nunito-SemiBold.ttf',   url: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIUmdTO3ew.ttf' },
  { name: 'Nunito-Bold.ttf',       url: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLUndTO3ew.ttf' },
  { name: 'Nunito-ExtraBold.ttf',  url: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDOUmdTO3ew.ttf' },
  { name: 'Nunito-Black.ttf',      url: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkmdTO3ew.ttf' },
  // Space Mono
  { name: 'SpaceMono-Regular.ttf', url: 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRUEZ2RFq7AwU.ttf' },
  { name: 'SpaceMono-Bold.ttf',    url: 'https://fonts.gstatic.com/s/spacemono/v13/i7dMIFZifjKcF5UAWdDRaPpZYFKQHwyVd3U.ttf' },
];

const download = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });

(async () => {
  console.log('📥 Descargando fuentes...\n');
  for (const font of FONTS) {
    const dest = path.join(FONTS_DIR, font.name);
    if (fs.existsSync(dest)) {
      console.log(`  ✓ ${font.name} (ya existe)`);
      continue;
    }
    process.stdout.write(`  ⬇ ${font.name}...`);
    try {
      await download(font.url, dest);
      console.log(' ✓');
    } catch (e) {
      console.log(` ✗ Error: ${e.message}`);
    }
  }
  console.log('\n✅ Fuentes listas. Ahora podés correr: npx expo start\n');
})();
