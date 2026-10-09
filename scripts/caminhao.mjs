// Recorta o caminhão visto de cima (imagem com fundo preto) e gera um WebP com transparência.
// O fundo é quase preto (~17): abaixo de 20 o pixel fica transparente, acima de 40 fica opaco,
// com transição suave entre os dois. A imagem é ampliada 3x (Lanczos) e leva um leve ajuste
// de tons para a cabine escura aparecer sem clarear demais a carroceria.
import sharp from 'sharp';

const SRC = 'C:/Users/JOAO~1.DIN/AppData/Local/Temp/claude/C--Claude-Sites/21480ca0-4643-4d8c-825a-9c920ee00801/images/1.png';
const ESCALA = 3;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const v = Math.max(data[i], data[i + 1], data[i + 2]);
  const a = Math.max(0, Math.min(1, (v - 20) / 20));
  // ajuste de tons: sobe os tons escuros (cabine) sem estourar a carroceria
  const lift = c => Math.round(255 * Math.pow(c / 255, 0.72));
  rgba[j] = lift(data[i]); rgba[j + 1] = lift(data[i + 1]); rgba[j + 2] = lift(data[i + 2]);
  rgba[j + 3] = Math.round(a * 255);
}

// recorte à área com conteúdo
const base = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
const { data: al } = await base.clone().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (al[y * W + x] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const pad = 2;
const recorte = { left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad), width: x1 - x0 + 1 + pad * 2, height: y1 - y0 + 1 + pad * 2 };

await base.clone().extract(recorte)
  .resize({ width: recorte.width * ESCALA, height: recorte.height * ESCALA, kernel: sharp.kernel.lanczos3 })
  .sharpen({ sigma: 0.8, m1: 0.6, m2: 0.4 })
  .webp({ quality: 95, alphaQuality: 100, effort: 6 })
  .toFile('assets/img/caminhao-topo.webp');

const m = await sharp('assets/img/caminhao-topo.webp').metadata();
console.log('caminhao-topo.webp', m.width + 'x' + m.height, 'alpha', m.hasAlpha);
