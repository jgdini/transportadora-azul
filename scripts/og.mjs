// Imagem de compartilhamento (1200x630): foto da frota escurecida, logo da ZUPO e a promessa de segurança.
import sharp from 'sharp';
const foto = await sharp('Arquivo/Fotos/WhatsApp Image 2026-10-02 at 21.54.32 (2).jpeg').rotate()
  .resize(1200, 630, { fit: 'cover' }).modulate({ saturation: 0.7, brightness: 0.8 }).toBuffer();
const veu = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b0b0c" stop-opacity=".96"/><stop offset=".55" stop-color="#0b0b0c" stop-opacity=".7"/><stop offset="1" stop-color="#0b0b0c" stop-opacity=".1"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="70" y="370" font-family="Arial" font-weight="300" font-size="62" fill="#ffffff">Sua carga segurada</text>
  <text x="70" y="446" font-family="Arial" font-weight="300" font-size="62" fill="#ffffff">do embarque à entrega.</text>
  <rect x="70" y="492" width="44" height="2" fill="#c9a44e"/>
  <text x="130" y="500" font-family="Arial" font-weight="700" font-size="20" letter-spacing="5" fill="#c9a44e">SEGURO · RASTREIO 24 H · FROTA PRÓPRIA</text>
</svg>`;
const logo = await sharp('assets/img/zupo-logo.webp').resize({ height: 92 }).png().toBuffer();
await sharp(foto).composite([{ input: Buffer.from(veu) }, { input: logo, left: 66, top: 90 }])
  .jpeg({ quality: 84, mozjpeg: true }).toFile('assets/img/og-image.jpg');
console.log('og-image ok');
