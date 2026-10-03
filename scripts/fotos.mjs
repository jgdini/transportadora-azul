// Converte as fotos de Arquivo/Fotos para WebP em vários tamanhos (srcset).
import sharp from 'sharp';
const src = 'Arquivo/Fotos/WhatsApp Image 2026-10-02 at ';
const fotos = {
  'frota-tres':     ['21.54.32 (2).jpeg', [480, 720, 960, 1400]],
  'frota-patio':    ['21.54.32 (3).jpeg', [480, 720, 960, 1400]],
  'frota-garagem':  ['21.54.32 (1).jpeg', [360, 480, 800]],
  'frota-dupla':    ['21.54.21.jpeg',     [360, 640, 960]],
  'galpao':         ['21.54.32 (4).jpeg', [480, 720, 960, 1400]],
  'atego':          ['21.54.32 (5).jpeg', [360, 480, 800]],
  'bau-lateral':    ['21.54.32.jpeg',     [360, 640, 960]],
  'graneleiro':     ['21.54.33.jpeg',     [360, 480, 800]],
};
for (const [nome, [arq, larguras]] of Object.entries(fotos)) {
  for (const w of larguras) {
    const info = await sharp(src + arq).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: nome === 'frota-tres' ? 70 : nome === 'frota-patio' ? 56 : 64, effort: 6 }).toFile(`assets/img/${nome}-${w}.webp`);
    console.log(nome, w, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
  }
}
