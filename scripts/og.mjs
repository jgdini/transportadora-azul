// Imagem de compartilhamento (1200x630) a partir da foto da frota, com o nome por cima.
import sharp from 'sharp';
const txt = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a1c3a" stop-opacity=".92"/><stop offset=".6" stop-color="#0a1c3a" stop-opacity=".35"/><stop offset="1" stop-color="#0a1c3a" stop-opacity="0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="64" y="64" width="150" height="58" rx="12" fill="#1b5fd1" stroke="#fff" stroke-width="4"/>
  <text x="139" y="105" font-family="Arial" font-weight="900" font-size="32" fill="#fff" text-anchor="middle">AZUL</text>
  <text x="64" y="330" font-family="Arial" font-weight="900" font-size="76" fill="#fff">Coleta de manhã,</text>
  <text x="64" y="415" font-family="Arial" font-weight="900" font-size="76" fill="#f4c21b">entrega à tarde.</text>
  <text x="64" y="500" font-family="Arial" font-size="32" fill="#e3eaf7">Transportadora Azul · Cotia (SP) · 11 caminhões próprios</text>
</svg>`;
await sharp('Arquivo/Fotos/WhatsApp Image 2026-10-02 at 21.54.32 (2).jpeg').rotate().resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(txt) }]).jpeg({ quality: 82, mozjpeg: true }).toFile('assets/img/og-image.jpg');
console.log('og-image ok');
