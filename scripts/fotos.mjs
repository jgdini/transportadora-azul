// Converte as fotos tratadas de Arquivo/Fotos para WebP em vários tamanhos (srcset).
import sharp from 'sharp';
const src = n => `Arquivo/Fotos/Fotos Novas (${n}).PNG`;
const fotos = {
  'frota-tres':  [5, [480, 720, 960, 1400]], // três caminhões no pôr do sol (topo)
  'galpao':      [6, [360, 480, 720, 960, 1400]], // galpão coberto com baú e graneleiro
  'doca':        [1, [360, 480, 720, 960, 1400]], // dois baús na doca
  'garagem':     [3, [360, 480, 800]],       // garagem coberta (vertical)
  'atego':       [2, [360, 480, 800]],       // Atego baú na grama (vertical)
  'graneleiro':  [4, [360, 480, 800, 1086]], // graneleiro com lona (vertical)
};
for (const [nome, [n, larguras]] of Object.entries(fotos)) {
  for (const w of larguras) {
    const info = await sharp(src(n)).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: nome === 'frota-tres' ? 72 : 66, effort: 6 }).toFile(`assets/img/${nome}-${w}.webp`);
    console.log(nome, w, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
  }
}
