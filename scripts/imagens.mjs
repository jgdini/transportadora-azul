// Gera os ícones a partir do favicon.svg. A imagem de compartilhamento sai do scripts/og.mjs
// e as fotos do scripts/fotos.mjs.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const fav = readFileSync('favicon.svg');
for (const [f, s] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]])
  await sharp(fav, { density: 600 }).resize(s, s).png().toFile(f);
console.log('ícones gerados');
