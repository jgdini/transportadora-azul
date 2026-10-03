// Recorta o logo da ZUPO (arte sobre fundo preto) e tira o fundo:
// o brilho de cada pixel vira transparência, então dourado e prata ficam sobre qualquer fundo escuro.
import sharp from 'sharp';

const SRC = 'Arquivo/Logo ZUPO Transportadora Premium.png';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const rgba = Buffer.alloc(W * H * 4);
const PISO = 14; // ruído do fundo preto
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const a = Math.max(0, Math.min(1, (Math.max(r, g, b) - PISO) / (255 - PISO)));
  rgba[j] = a ? Math.min(255, r / a) : 0;
  rgba[j + 1] = a ? Math.min(255, g / a) : 0;
  rgba[j + 2] = a ? Math.min(255, b / a) : 0;
  rgba[j + 3] = Math.round(a * 255);
}
const base = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } });

// limites horizontais de uma faixa de linhas
const caixa = (y0, y1) => {
  let x0 = W, x1 = 0;
  for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) if (rgba[(y * W + x) * 4 + 3] > 20) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
};
const marca = caixa(178, 492), nome = caixa(528, 690), sub = caixa(724, 754);
const corte = async r => base().extract(r).png().toBuffer();

const bMarca = await corte(marca), bNome = await corte(nome), bSub = await corte(sub);

// marca (Z) e favicon
await sharp(bMarca).resize({ height: 160 }).webp({ quality: 90, alphaQuality: 90 }).toFile('assets/img/zupo-marca.webp');
const fundoIcone = s => sharp({ create: { width: s, height: s, channels: 4, background: '#0b0b0c' } });
for (const [f, s] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const z = await sharp(bMarca).resize({ width: Math.round(s * 0.78), height: Math.round(s * 0.62), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await fundoIcone(s).composite([{ input: z, gravity: 'center' }]).png().toFile(f);
}

// versão horizontal para o cabeçalho: Z à esquerda, ZUPO e TRANSPORTADORA empilhados à direita
const altZ = 300;
const z = await sharp(bMarca).resize({ height: altZ }).png().toBuffer();
const zW = (await sharp(z).metadata()).width;
const nomeR = await sharp(bNome).resize({ height: 170 }).png().toBuffer();
const nomeW = (await sharp(nomeR).metadata()).width;
const subR = await sharp(bSub).resize({ width: nomeW }).png().toBuffer();
const subH = (await sharp(subR).metadata()).height;
const gap = 40, larg = zW + gap + nomeW, alt = altZ;
const topoNome = Math.round((alt - (170 + 26 + subH)) / 2);
// o sharp redimensiona antes de compor, então compõe primeiro e redimensiona depois
await sharp({ create: { width: larg, height: alt, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: z, left: 0, top: 0 }, { input: nomeR, left: zW + gap, top: topoNome }, { input: subR, left: zW + gap, top: topoNome + 170 + 26 }])
  .png().toBuffer().then(b => sharp(b).resize({ height: 84 }).webp({ quality: 90, alphaQuality: 90 }).toFile('assets/img/zupo-logo.webp'));

// logo completo (sem o slogan) para o rodapé
const comp = caixa(178, 754);
await base().extract(comp).resize({ width: 520 }).webp({ quality: 88, alphaQuality: 90 }).toFile('assets/img/zupo-logo-completo.webp');

const m = await sharp('assets/img/zupo-logo.webp').metadata();
console.log('logo cabeçalho', m.width + 'x' + m.height, '| marca', marca.width + 'x' + marca.height);
