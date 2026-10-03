// Gera os ícones e a imagem de compartilhamento (og-image) a partir de SVG.
// As fotos da pasta Arquivo/ entram depois, convertidas para WebP com srcset.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const fav = readFileSync('favicon.svg');
for (const [f, s] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]])
  await sharp(fav, { density: 600 }).resize(s, s).png().toFile(f);

const linha = (y, nome, km) => `
  <path d="M108 ${y - 34} 90 ${y - 8}h12v22h12v-22h12Z" fill="#fff"/>
  <text x="160" y="${y}" font-family="Arial" font-weight="700" font-size="44" fill="#fff">${nome}</text>
  <text x="1040" y="${y}" font-family="Arial" font-weight="700" font-size="44" fill="#fff" text-anchor="end">${km} km</text>
  <rect x="80" y="${y + 26}" width="960" height="2" fill="#fff" opacity=".3"/>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#e9eef5"/>
  <rect x="40" y="30" width="1120" height="570" rx="26" fill="#1b4e9b"/>
  <rect x="58" y="48" width="1084" height="534" rx="16" fill="none" stroke="#fff" stroke-width="6"/>
  <rect x="84" y="78" width="150" height="54" rx="8" fill="#fff"/>
  <text x="159" y="116" font-family="Arial" font-weight="700" font-size="32" fill="#1b4e9b" text-anchor="middle">SP 270</text>
  <text x="258" y="117" font-family="Arial" font-weight="700" font-size="36" fill="#fff">Rod. Raposo Tavares · Cotia</text>
  <rect x="80" y="158" width="1040" height="6" fill="#fff"/>
  ${linha(232, 'Rodoanel Mário Covas', 9)}${linha(312, 'São Paulo · Centro', 34)}${linha(392, 'Campinas', 98)}
  <rect x="80" y="450" width="1040" height="6" fill="#fff"/>
  <text x="600" y="530" font-family="Arial" font-weight="900" font-size="64" fill="#fff" text-anchor="middle" letter-spacing="5">TRANSPORTADORA AZUL</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 84, mozjpeg: true }).toFile('assets/img/og-image.jpg');
console.log('imagens geradas');
