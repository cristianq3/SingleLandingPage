// Genera los assets de marca de Soluweb (SVG con texto convertido a trazos + PNG).
// Uso: npm run brand
import opentype from 'opentype.js';
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'brand');
mkdirSync(out, { recursive: true });

const fontBuf = readFileSync(join(root, 'scripts', 'fonts', 'Montserrat-Black.ttf'));
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

export const BRAND = {
  blue: '#0F33FF',
  ink: '#0C0C0C',
  white: '#FFFFFF',
  yellow: '#FFF498',
};

const SIZE = 100; // tamaño de fuente base
const TRACK = -3; // tracking apretado como el logo original

function textPath(str, x, y, size = SIZE) {
  let cursor = x;
  const parts = [];
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    parts.push(g.getPath(cursor, y, size).toPathData(2));
    cursor += (g.advanceWidth / font.unitsPerEm) * size + TRACK;
  }
  return { d: parts.join(' '), end: cursor - TRACK };
}

function wordmark({ solu, web, shape }) {
  const base = 0;
  const a = textPath('solu', 0, base);
  const gap = 4;
  const b = textPath('web.', a.end + gap, base);
  // Paralelogramo inclinado (motivo de marca)
  const top = base - 92;
  const bottom = base + 24;
  const skew = 50;
  const left = a.end + gap - 42;
  const right = b.end + 14;
  const poly = `${left},${bottom} ${left + skew},${top} ${right + skew},${top} ${right},${bottom}`;
  const minX = -6;
  const maxX = right + skew + 6;
  const w = maxX - minX;
  const h = bottom - top + 12;
  return {
    w,
    h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${top - 6} ${w} ${h}" width="${Math.round(w * 2)}" height="${Math.round(h * 2)}" role="img" aria-label="Soluweb">
  <title>Soluweb</title>
  <polygon points="${poly}" fill="${shape}"/>
  <path d="${a.d}" fill="${solu}"/>
  <path d="${b.d}" fill="${web}"/>
</svg>`,
  };
}

function icon({ bg, shape, fg, rounded = true }) {
  // Isotipo: "s." sobre el paralelogramo
  const IS = 84;
  const s = textPath('s.', 0, 0, IS);
  const tw = s.end;
  const vb = 160;
  const tx = (vb - tw) / 2 + 2;
  const ty = 106;
  const t = textPath('s.', tx, ty, IS);
  const poly = `22,128 54,32 138,32 106,128`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" width="512" height="512" role="img" aria-label="Soluweb">
  <title>Soluweb</title>
  ${bg ? `<rect width="${vb}" height="${vb}" rx="${rounded ? 34 : 0}" fill="${bg}"/>` : ''}
  <polygon points="${poly}" fill="${shape}"/>
  <path d="${t.d}" fill="${fg}"/>
</svg>`;
}

const variants = {
  'logo-dark-bg': wordmark({ solu: BRAND.white, web: BRAND.white, shape: BRAND.blue }),
  'logo-light-bg': wordmark({ solu: BRAND.ink, web: BRAND.white, shape: BRAND.blue }),
  'logo-mono-white': wordmark({ solu: BRAND.white, web: BRAND.ink, shape: BRAND.white }),
  'logo-mono-black': wordmark({ solu: BRAND.ink, web: BRAND.white, shape: BRAND.ink }),
};

for (const [name, v] of Object.entries(variants)) {
  writeFileSync(join(out, `${name}.svg`), v.svg);
  await sharp(Buffer.from(v.svg), { density: 300 })
    .resize({ width: 1600 })
    .png()
    .toFile(join(out, `${name}.png`));
}

const icons = {
  'icon-dark': icon({ bg: BRAND.ink, shape: BRAND.blue, fg: BRAND.white }),
  'icon-light': icon({ bg: BRAND.white, shape: BRAND.blue, fg: BRAND.white }),
  'icon-blue': icon({ bg: BRAND.blue, shape: BRAND.white, fg: BRAND.blue }),
  'icon-transparent': icon({ bg: null, shape: BRAND.blue, fg: BRAND.white }),
};
for (const [name, svg] of Object.entries(icons)) {
  writeFileSync(join(out, `${name}.svg`), svg);
  await sharp(Buffer.from(svg), { density: 300 }).resize(512, 512).png().toFile(join(out, `${name}.png`));
}

// Favicons
const pub = join(root, 'public');
writeFileSync(join(pub, 'favicon.svg'), icons['icon-dark']);
await sharp(Buffer.from(icons['icon-dark']), { density: 300 }).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));
await sharp(Buffer.from(icons['icon-dark']), { density: 300 }).resize(32, 32).png().toFile(join(pub, 'favicon-32.png'));
await sharp(Buffer.from(icons['icon-dark']), { density: 300 }).resize(192, 192).png().toFile(join(pub, 'icon-192.png'));
await sharp(Buffer.from(icons['icon-dark']), { density: 300 }).resize(512, 512).png().toFile(join(pub, 'icon-512.png'));

console.log('Brand assets generados en public/brand');
