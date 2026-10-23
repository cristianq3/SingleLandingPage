// Genera public/og-image.png (1200x630) a partir de og-bg.jpg + logo + titular en trazos.
import opentype from 'opentype.js';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => {
  const b = readFileSync(join(root, 'scripts', 'fonts', f));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const black = load('Montserrat-Black.ttf');

const W = 1200;
const H = 630;
const path = (font, text, x, y, size, fill) => {
  let cx = x;
  const ds = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    ds.push(g.getPath(cx, y, size).toPathData(1));
    cx += (g.advanceWidth / font.unitsPerEm) * size;
  }
  return `<path d="${ds.join(" ")}" fill="${fill}"/>`;
};

const logo = readFileSync(join(root, 'public', 'brand', 'logo-dark-bg.svg'), 'utf8')
  .replace(/width="\d+" height="\d+"/, 'width="300" height="92"');

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0C0C0C" stop-opacity=".95"/><stop offset=".6" stop-color="#0C0C0C" stop-opacity=".55"/><stop offset="1" stop-color="#0C0C0C" stop-opacity="0"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${path(black, 'Tu negocio,', 72, 300, 76, '#FFFFFF')}
  <polygon points="86,402 112,318 492,318 466,402" fill="#0F33FF"/>
  ${path(black, 'en piloto', 112, 384, 76, '#FFFFFF')}
  ${path(black, 'automático.', 72, 470, 76, '#FFFFFF')}
  ${path(black, 'IA · Automatización · CRM · Sistemas de gestión', 74, 548, 26, '#B3BFFF')}
</svg>`;

const bg = await sharp(join(root, 'src', 'assets', 'img', 'og-bg.jpg')).resize(W, H, { fit: 'cover', position: 'right' }).toBuffer();
const logoPng = await sharp(Buffer.from(logo), { density: 200 }).resize({ width: 260 }).png().toBuffer();

await sharp(bg)
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: logoPng, top: 64, left: 72 },
  ])
  .png()
  .toFile(join(root, 'public', 'og-image.png'));

console.log('og-image.png generado');
