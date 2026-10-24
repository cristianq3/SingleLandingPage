// Generador de Banners Web para Portales de Noticias — Soluweb
// Formatos IAB estándar: 970x250, 728x90, 300x250, 300x600, 320x100, 1200x628
import opentype from 'opentype.js';
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPublic = join(root, 'public', 'banners');
const outLocal = join(root, 'banners-web');

mkdirSync(outPublic, { recursive: true });
mkdirSync(outLocal, { recursive: true });

const loadFont = (file) => {
  const b = readFileSync(join(root, 'scripts', 'fonts', file));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};

const fBlack = loadFont('Montserrat-Black.ttf');
const fBold = loadFont('Montserrat-Bold.ttf');
const fReg = loadFont('Montserrat-Regular.ttf');

const logoSvg = readFileSync(join(root, 'public', 'brand', 'logo-dark-bg.svg'), 'utf8');
const iconSvg = readFileSync(join(root, 'public', 'brand', 'icon-dark.svg'), 'utf8');

function textWidth(font, str, size, track = 0) {
  let w = 0;
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    w += (g.advanceWidth / font.unitsPerEm) * size + track;
  }
  return w - track;
}

function renderLine(font, str, x, y, size, fill = '#FFFFFF', track = 0) {
  let cx = x;
  let out = '';
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    const p = g.getPath(cx, y, size);
    const d = p.commands
      .map((cmd) => {
        if (cmd.type === 'M') return `M${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
        if (cmd.type === 'L') return `L${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
        if (cmd.type === 'Q') return `Q${cmd.x1.toFixed(2)},${cmd.y1.toFixed(2)} ${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
        if (cmd.type === 'C') return `C${cmd.x1.toFixed(2)},${cmd.y1.toFixed(2)} ${cmd.x2.toFixed(2)},${cmd.y2.toFixed(2)} ${cmd.x.toFixed(2)},${cmd.y.toFixed(2)}`;
        if (cmd.type === 'Z') return 'Z';
        return '';
      })
      .join(' ');
    if (d) out += `<path d="${d}" fill="${fill}"/>`;
    cx += (g.advanceWidth / font.unitsPerEm) * size + track;
  }
  return out;
}

function renderRichLine(font, str, x, y, size, defaultFill = '#FFFFFF', track = -1) {
  const tokens = str.split(/(\[[^\]]+\]|\{[^}]+\})/g).filter(Boolean);
  let cx = x;
  let out = '';
  for (const tok of tokens) {
    if (tok.startsWith('[') && tok.endsWith(']')) {
      const word = tok.slice(1, -1);
      const w = textWidth(font, word, size, track);
      const padX = size * 0.24;
      const top = y - size * 0.88;
      const bot = y + size * 0.22;
      const skew = size * 0.28;
      const lx = cx - padX * 0.4;
      const rx = cx + w + padX * 0.7;
      out += `<polygon points="${lx.toFixed(1)},${bot.toFixed(1)} ${(lx + skew).toFixed(1)},${top.toFixed(1)} ${(rx + skew).toFixed(1)},${top.toFixed(1)} ${rx.toFixed(1)},${bot.toFixed(1)}" fill="#0F33FF"/>`;
      out += renderLine(font, word, cx + skew * 0.35, y, size, '#FFFFFF', track);
      cx += w + skew * 0.55;
    } else if (tok.startsWith('{') && tok.endsWith('}')) {
      const word = tok.slice(1, -1);
      const w = textWidth(font, word, size, track);
      out += renderLine(font, word, cx, y, size, '#FFF498', track);
      cx += w;
    } else {
      const w = textWidth(font, tok, size, track);
      out += renderLine(font, tok, cx, y, size, defaultFill, track);
      cx += w;
    }
  }
  return out;
}

function renderBadge(text, x, y, bg = '#0F33FF', fg = '#FFFFFF', size = 16) {
  const w = textWidth(fBold, text, size, 1.5);
  const padX = 18;
  const h = size + 16;
  const skew = 10;
  const poly = `${x},${y + h} ${x + skew},${y} ${x + w + padX * 2 + skew},${y} ${x + w + padX * 2},${y + h}`;
  return `<polygon points="${poly}" fill="${bg}"/>` + renderLine(fBold, text, x + padX + skew * 0.4, y + size + 2, size, fg, 1.5);
}

// -------------------------------------------------------------
// 0. FORMATO EXACTO SOLICITADO: 327 x 256 px (y Retina 654 x 512 px)
// -------------------------------------------------------------
async function buildBanner327x256() {
  const targetUrl = 'https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner_327x256&utm_campaign=noticias_pymes';
  
  // Renderizamos en 2x (654 x 512) para máxima nitidez Retina y sub-pixel antialiasing
  const w = 654;
  const h = 512;

  // --- VARIANTE 1: WhatsApp & Fuga de Ventas ---
  const bg1 = await sharp(join(root, 'src', 'assets', 'img', 'hero.jpg'))
    .resize(w, h, { fit: 'cover', position: 'right top' })
    .modulate({ brightness: 0.36, saturation: 1.25 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 300 }).resize({ width: 230 }).png().toBuffer();

  let svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g327_1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.96"/>
        <stop offset="45%" stop-color="#0C0C0C" stop-opacity="0.75"/>
        <stop offset="85%" stop-color="#0C0C0C" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.99"/>
      </linearGradient>
      <radialGradient id="blueGlow327" cx="80%" cy="20%" r="55%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid327" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.04"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g327_1)"/>
    <rect width="${w}" height="${h}" fill="url(#blueGlow327)"/>
    <rect width="${w}" height="${h}" fill="url(#grid327)"/>
    
    <!-- Borde exterior neón fino -->
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="20" fill="none" stroke="#0F33FF" stroke-opacity="0.55" stroke-width="3"/>
    
    <!-- Paralelogramo decorativo -->
    <polygon points="${w - 140},0 ${w - 50},0 ${w - 110},${h} ${w - 200},${h}" fill="#0F33FF" fill-opacity="0.10"/>
  `;

  // Eyebrow badge a la derecha
  svg1 += renderBadge('IA & CRM PYME', 420, 36, '#0F33FF', '#FFFFFF', 16);

  // Titular de alto impacto
  svg1 += renderRichLine(fBlack, '¿Tu negocio pierde ventas', 34, 130, 31, '#FFFFFF', -0.5);
  svg1 += renderRichLine(fBlack, 'por responder [tarde]?', 34, 172, 31, '#FFFFFF', -0.5);

  // Bajada
  svg1 += renderLine(fReg, 'Agentes de IA 24/7 en WhatsApp y CRM comercial.', 34, 216, 21, '#D4D4D8', 0);
  
  // Highlight spark
  svg1 += `<circle cx="46" cy="254" r="8" fill="#FFF498" fill-opacity="0.2" stroke="#FFF498" stroke-width="2"/>`;
  svg1 += `<path d="M42 254 L45 257 L50 251" fill="none" stroke="#FFF498" stroke-width="2.5" stroke-linecap="round"/>`;
  svg1 += renderLine(fBold, 'Respuestas en 3 seg · Puesta en marcha en 14 días', 64, 260, 18, '#FFF498', 0.2);

  // Botón CTA de ancho completo
  const btnX = 34;
  const btnY = 300;
  const btnW = w - 68;
  const btnH = 88;
  svg1 += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="22" fill="#0F33FF"/>`;
  svg1 += `<polygon points="${btnX + btnW - 80},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 30},${btnY + btnH} ${btnX + btnW - 110},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.15"/>`;
  
  // Texto botón
  svg1 += renderLine(fBlack, 'SOLICITAR AUDITORÍA GRATIS', btnX + 44, btnY + 44, 23, '#FFFFFF', 0.5);
  svg1 += renderLine(fBold, '→', btnX + btnW - 65, btnY + 45, 30, '#FFF498', 0);
  svg1 += renderLine(fBold, 'Cupos bonificados para empresas', btnX + 44, btnY + 68, 16, '#E0E7FF', 0);

  // Footer URL centrada
  const footStr1 = 'soluweb.com.ar';
  const footW1 = textWidth(fBold, footStr1, 22, 1);
  svg1 += renderLine(fBold, footStr1, (w - footW1) / 2, 458, 22, '#A1A1AA', 1);

  svg1 += `</svg>`;

  const buffer2x_1 = await sharp(bg1)
    .composite([
      { input: Buffer.from(svg1), top: 0, left: 0 },
      { input: logoPng, top: 32, left: 34 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  const buffer1x_1 = await sharp(buffer2x_1)
    .resize(327, 256)
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'banner-noticias-327x256.png'), buffer1x_1);
  writeFileSync(join(outLocal, 'banner-noticias-327x256.png'), buffer1x_1);
  writeFileSync(join(outPublic, 'banner-noticias-327x256@2x.png'), buffer2x_1);
  writeFileSync(join(outLocal, 'banner-noticias-327x256@2x.png'), buffer2x_1);
  console.log('✓ banner-noticias-327x256.png (y @2x Retina)');

  // --- VARIANTE 2: Ahorro Operativo & Tareas de Robot ---
  const bg2 = await sharp(join(root, 'src', 'assets', 'img', 'svc-automatizacion.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.35, saturation: 1.25 })
    .toBuffer();

  let svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g327_2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.96"/>
        <stop offset="50%" stop-color="#0C0C0C" stop-opacity="0.75"/>
        <stop offset="90%" stop-color="#0C0C0C" stop-opacity="0.98"/>
      </linearGradient>
      <radialGradient id="blueGlow327_2" cx="20%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid327_2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.04"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g327_2)"/>
    <rect width="${w}" height="${h}" fill="url(#blueGlow327_2)"/>
    <rect width="${w}" height="${h}" fill="url(#grid327_2)"/>
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="20" fill="none" stroke="#0F33FF" stroke-opacity="0.55" stroke-width="3"/>
    <polygon points="${w - 180},0 ${w - 90},0 ${w - 150},${h} ${w - 240},${h}" fill="#0F33FF" fill-opacity="0.10"/>
  `;

  svg2 += renderBadge('EFICIENCIA OPERATIVA', 360, 36, '#0F33FF', '#FFFFFF', 16);

  svg2 += renderRichLine(fBlack, 'Dejá de pagar sueldos', 34, 130, 31, '#FFFFFF', -0.5);
  svg2 += renderRichLine(fBlack, 'para tareas de [robot]', 34, 172, 31, '#FFFFFF', -0.5);

  svg2 += renderLine(fReg, 'Automatizá WhatsApp, facturación ARCA y presupuestos.', 34, 216, 20.5, '#D4D4D8', 0);

  svg2 += `<circle cx="46" cy="254" r="8" fill="#FFF498" fill-opacity="0.2" stroke="#FFF498" stroke-width="2"/>`;
  svg2 += `<path d="M42 254 L45 257 L50 251" fill="none" stroke="#FFF498" stroke-width="2.5" stroke-linecap="round"/>`;
  svg2 += renderLine(fBold, 'Ahorrá más de 20 horas por semana en tu empresa', 64, 260, 18, '#FFF498', 0.2);

  svg2 += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="22" fill="#0F33FF"/>`;
  svg2 += `<polygon points="${btnX + btnW - 80},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 30},${btnY + btnH} ${btnX + btnW - 110},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.15"/>`;
  svg2 += renderLine(fBlack, 'CONOCER SOLUCIONES', btnX + 44, btnY + 44, 23, '#FFFFFF', 0.5);
  svg2 += renderLine(fBold, '→', btnX + btnW - 65, btnY + 45, 30, '#FFF498', 0);
  svg2 += renderLine(fBold, 'Auditoría inicial 100% Bonificada', btnX + 44, btnY + 68, 16, '#E0E7FF', 0);

  // Footer URL centrada
  const footStr2 = 'soluweb.com.ar';
  const footW2 = textWidth(fBold, footStr2, 22, 1);
  svg2 += renderLine(fBold, footStr2, (w - footW2) / 2, 458, 22, '#A1A1AA', 1);

  svg2 += `</svg>`;

  const buffer2x_2 = await sharp(bg2)
    .composite([
      { input: Buffer.from(svg2), top: 0, left: 0 },
      { input: logoPng, top: 32, left: 34 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  const buffer1x_2 = await sharp(buffer2x_2)
    .resize(327, 256)
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'banner-noticias-327x256-v2.png'), buffer1x_2);
  writeFileSync(join(outLocal, 'banner-noticias-327x256-v2.png'), buffer1x_2);
  writeFileSync(join(outPublic, 'banner-noticias-327x256-v2@2x.png'), buffer2x_2);
  writeFileSync(join(outLocal, 'banner-noticias-327x256-v2@2x.png'), buffer2x_2);
  console.log('✓ banner-noticias-327x256-v2.png (y @2x Retina)');

  // --- VARIANTE 3: Demo en Vivo & Soluciones Integrales ---
  const bg3 = await sharp(join(root, 'src', 'assets', 'img', 'svc-crm.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.35, saturation: 1.25 })
    .toBuffer();

  let svg3 = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g327_3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.96"/>
        <stop offset="45%" stop-color="#0C0C0C" stop-opacity="0.75"/>
        <stop offset="90%" stop-color="#0C0C0C" stop-opacity="0.98"/>
      </linearGradient>
      <radialGradient id="blueGlow327_3" cx="75%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid327_3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.04"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g327_3)"/>
    <rect width="${w}" height="${h}" fill="url(#blueGlow327_3)"/>
    <rect width="${w}" height="${h}" fill="url(#grid327_3)"/>
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="20" fill="none" stroke="#0F33FF" stroke-opacity="0.55" stroke-width="3"/>
    <polygon points="${w - 140},0 ${w - 50},0 ${w - 110},${h} ${w - 200},${h}" fill="#0F33FF" fill-opacity="0.10"/>
  `;

  svg3 += renderBadge('NEGOCIOS & IA', 420, 36, '#0F33FF', '#FFFFFF', 16);

  svg3 += renderRichLine(fBlack, 'Sumá [IA] a tu negocio', 34, 130, 31, '#FFFFFF', -0.5);
  svg3 += renderRichLine(fBlack, 'y vendé en automático', 34, 172, 31, '#FFFFFF', -0.5);

  svg3 += renderLine(fReg, 'Chatbots 24/7 en WhatsApp, CRM y agenda de turnos.', 34, 216, 20.5, '#D4D4D8', 0);

  svg3 += `<circle cx="46" cy="254" r="8" fill="#FFF498" fill-opacity="0.2" stroke="#FFF498" stroke-width="2"/>`;
  svg3 += `<path d="M42 254 L45 257 L50 251" fill="none" stroke="#FFF498" stroke-width="2.5" stroke-linecap="round"/>`;
  svg3 += renderLine(fBold, 'Puesta en marcha en 14 días · Sin cambiar tu número', 64, 260, 18, '#FFF498', 0.2);

  svg3 += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="22" fill="#0F33FF"/>`;
  svg3 += `<polygon points="${btnX + btnW - 80},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 30},${btnY + btnH} ${btnX + btnW - 110},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.15"/>`;
  svg3 += renderLine(fBlack, 'PEDIR DEMO EN VIVO', btnX + 44, btnY + 44, 23, '#FFFFFF', 0.5);
  svg3 += renderLine(fBold, '→', btnX + btnW - 65, btnY + 45, 30, '#FFF498', 0);
  svg3 += renderLine(fBold, 'Diagnóstico de WhatsApp sin cargo', btnX + 44, btnY + 68, 16, '#E0E7FF', 0);

  const footStr3 = 'soluweb.com.ar';
  const footW3 = textWidth(fBold, footStr3, 22, 1);
  svg3 += renderLine(fBold, footStr3, (w - footW3) / 2, 458, 22, '#A1A1AA', 1);

  svg3 += `</svg>`;

  const buffer2x_3 = await sharp(bg3)
    .composite([
      { input: Buffer.from(svg3), top: 0, left: 0 },
      { input: logoPng, top: 32, left: 34 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  const buffer1x_3 = await sharp(buffer2x_3)
    .resize(327, 256)
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'banner-noticias-327x256-v3.png'), buffer1x_3);
  writeFileSync(join(outLocal, 'banner-noticias-327x256-v3.png'), buffer1x_3);
  writeFileSync(join(outPublic, 'banner-noticias-327x256-v3@2x.png'), buffer2x_3);
  writeFileSync(join(outLocal, 'banner-noticias-327x256-v3@2x.png'), buffer2x_3);
  console.log('✓ banner-noticias-327x256-v3.png (y @2x Retina)');
}

// -------------------------------------------------------------
// 1. BILLBOARD / SUPER LEADERBOARD (970 x 250 px)
// -------------------------------------------------------------
async function buildBillboard() {
  const w = 970;
  const h = 250;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'hero.jpg'))
    .resize(w, h, { fit: 'cover', position: 'right top' })
    .modulate({ brightness: 0.38, saturation: 1.2 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 175 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.97"/>
        <stop offset="55%" stop-color="#0C0C0C" stop-opacity="0.85"/>
        <stop offset="85%" stop-color="#0C0C0C" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.10"/>
      </linearGradient>
      <radialGradient id="blueGlow" cx="20%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.035"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g1)"/>
    <rect width="${w}" height="${h}" fill="url(#blueGlow)"/>
    <rect width="${w}" height="${h}" fill="url(#grid)"/>
    <!-- Borde exterior fino -->
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="8" fill="none" stroke="#0F33FF" stroke-opacity="0.4" stroke-width="1.5"/>
    <polygon points="${w - 180},0 ${w - 120},0 ${w - 160},${h} ${w - 220},${h}" fill="#0F33FF" fill-opacity="0.12"/>
  `;

  // Eyebrow
  svg += renderBadge('TECNOLOGÍA & INTELIGENCIA ARTIFICIAL', 40, 24, '#0F33FF', '#FFFFFF', 12);

  // Titular
  svg += renderRichLine(fBlack, '¿Tu empresa pierde clientes por', 40, 94, 30, '#FFFFFF', -0.5);
  svg += renderRichLine(fBlack, 'responder [tarde] en WhatsApp?', 40, 134, 30, '#FFFFFF', -0.5);

  // Bajada
  svg += renderLine(fReg, 'Agentes de IA 24/7, CRM comercial y automatización de procesos para PyMEs.', 40, 168, 16, '#A1A1AA', 0);
  svg += renderLine(fBold, 'Implementación llave en mano en 14 días · Sin cambiar tus números ni sistemas.', 40, 192, 14, '#D4D4D8', 0);

  // Footer tag
  svg += renderLine(fBold, 'soluweb.com.ar', 40, 226, 15, '#FFF498', 1);
  svg += renderLine(fReg, '· Consultora de Automatización & IA', 185, 226, 14, '#71717A', 0);

  // Botón CTA a la derecha
  const btnX = 690;
  const btnY = 90;
  const btnW = 240;
  const btnH = 68;
  svg += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="16" fill="#0F33FF"/>`;
  svg += `<polygon points="${btnX + btnW - 50},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 20},${btnY + btnH} ${btnX + btnW - 70},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.14"/>`;
  svg += renderLine(fBlack, 'AUDITORÍA GRATIS', btnX + 22, btnY + 34, 17, '#FFFFFF', 0.5);
  svg += renderLine(fBold, 'INGRESAR AL SITIO →', btnX + 22, btnY + 54, 13, '#FFF498', 1);

  // Kicker debajo del botón
  svg += renderLine(fReg, 'Cupos limitados por mes', btnX + 45, btnY + 86, 12, '#A1A1AA', 0);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 22, left: w - 215 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'billboard-970x250.png'), outBuffer);
  writeFileSync(join(outLocal, 'billboard-970x250.png'), outBuffer);
  console.log('✓ billboard-970x250.png');
}

// -------------------------------------------------------------
// 2. LEADERBOARD CLÁSICO (728 x 90 px)
// -------------------------------------------------------------
async function buildLeaderboard() {
  const w = 728;
  const h = 90;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'hero.jpg'))
    .resize(w, h, { fit: 'cover', position: 'right' })
    .modulate({ brightness: 0.35, saturation: 1.2 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 200 }).resize({ width: 125 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.97"/>
        <stop offset="60%" stop-color="#0C0C0C" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.30"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g2)"/>
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="6" fill="none" stroke="#0F33FF" stroke-opacity="0.4" stroke-width="1.5"/>
    <polygon points="${w - 230},0 ${w - 180},0 ${w - 200},${h} ${w - 250},${h}" fill="#0F33FF" fill-opacity="0.12"/>
  `;

  // Línea divisoria vertical
  svg += `<line x1="155" y1="14" x2="155" y2="76" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1"/>`;

  // Texto central
  svg += renderRichLine(fBlack, 'Llevá la [IA] y Automatización a tu PyME', 175, 38, 17, '#FFFFFF', -0.5);
  svg += renderLine(fReg, 'WhatsApp 24/7 · CRM a medida · Facturación automática', 175, 62, 13, '#B3BFFF', 0);

  // Botón a la derecha
  const btnX = 555;
  const btnY = 22;
  const btnW = 150;
  const btnH = 46;
  svg += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="10" fill="#0F33FF"/>`;
  svg += renderLine(fBlack, 'VER WEB →', btnX + 24, btnY + 29, 14, '#FFF498', 1);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 31, left: 16 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'leaderboard-728x90.png'), outBuffer);
  writeFileSync(join(outLocal, 'leaderboard-728x90.png'), outBuffer);
  console.log('✓ leaderboard-728x90.png');
}

// -------------------------------------------------------------
// 3. MEDIUM RECTANGLE / MPU (300 x 250 px)
// -------------------------------------------------------------
async function buildRectangle() {
  const w = 300;
  const h = 250;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'svc-ia.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.32, saturation: 1.15 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 130 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.95"/>
        <stop offset="45%" stop-color="#0C0C0C" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.96"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g3)"/>
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="8" fill="none" stroke="#0F33FF" stroke-opacity="0.45" stroke-width="1.5"/>
    <polygon points="${w - 70},0 ${w},0 ${w - 30},${h} ${w - 100},${h}" fill="#0F33FF" fill-opacity="0.08"/>
  `;

  // Eyebrow badge
  svg += renderBadge('IA PARA NEGOCIOS', 18, 54, '#0F33FF', '#FFFFFF', 10);

  // Titular
  svg += renderRichLine(fBlack, '¿Tu negocio atiende', 18, 102, 19, '#FFFFFF', -0.5);
  svg += renderRichLine(fBlack, 'consultas [a mano]?', 18, 126, 19, '#FFFFFF', -0.5);

  // Bajada
  svg += renderLine(fReg, 'Agentes 24/7 en WhatsApp, CRM y', 18, 150, 12.5, '#A1A1AA', 0);
  svg += renderLine(fReg, 'automatización de ventas para PyMEs.', 18, 168, 12.5, '#D4D4D8', 0);

  // Botón
  const btnX = 18;
  const btnY = 188;
  const btnW = 264;
  const btnH = 44;
  svg += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="12" fill="#0F33FF"/>`;
  svg += `<polygon points="${btnX + btnW - 40},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 15},${btnY + btnH} ${btnX + btnW - 55},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.14"/>`;
  svg += renderLine(fBlack, 'CONOCER SOLUWEB →', btnX + 42, btnY + 28, 13.5, '#FFF498', 1);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 18, left: 18 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'rectangle-300x250.png'), outBuffer);
  writeFileSync(join(outLocal, 'rectangle-300x250.png'), outBuffer);
  console.log('✓ rectangle-300x250.png');
}

// -------------------------------------------------------------
// 4. HALF PAGE BANNER (300 x 600 px) - Rascacielos Lateral
// -------------------------------------------------------------
async function buildHalfPage() {
  const w = 300;
  const h = 600;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'svc-automatizacion.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.35, saturation: 1.2 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 140 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.96"/>
        <stop offset="40%" stop-color="#0C0C0C" stop-opacity="0.75"/>
        <stop offset="75%" stop-color="#0C0C0C" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.99"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g4)"/>
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="10" fill="none" stroke="#0F33FF" stroke-opacity="0.45" stroke-width="1.5"/>
    <polygon points="${w - 90},0 ${w},0 ${w - 40},${h} ${w - 130},${h}" fill="#0F33FF" fill-opacity="0.08"/>
  `;

  // Eyebrow badge
  svg += renderBadge('TRANSFORMACIÓN DIGITAL', 20, 68, '#0F33FF', '#FFFFFF', 10);

  // Titular
  svg += renderRichLine(fBlack, 'Dejá de pagar', 20, 126, 24, '#FFFFFF', -0.5);
  svg += renderRichLine(fBlack, 'sueldos para tareas', 20, 156, 24, '#FFFFFF', -0.5);
  svg += renderRichLine(fBlack, 'de [robot]', 20, 188, 24, '#FFFFFF', -0.5);

  // Subtítulo
  svg += renderLine(fReg, 'Agentes de IA y sistemas de gestión', 20, 222, 13.5, '#A1A1AA', 0);
  svg += renderLine(fReg, 'a medida para PyMEs en Argentina.', 20, 242, 13.5, '#D4D4D8', 0);

  // Tarjetas de beneficios
  const bullets = [
    { title: 'Chatbot IA en WhatsApp', sub: 'Responde y agenda en 3 seg 24/7' },
    { title: 'CRM Comercial Integrado', sub: 'Cero presupuestos olvidados' },
    { title: 'Facturación y Cobranzas', sub: 'ARCA y Mercado Pago automáticos' },
    { title: 'Puesta en marcha en 14 días', sub: 'Solución llave en mano' },
  ];

  let bY = 274;
  for (const b of bullets) {
    svg += `<rect x="20" y="${bY}" width="260" height="52" rx="12" fill="#141418" stroke="#0F33FF" stroke-opacity="0.35" stroke-width="1.5"/>`;
    svg += `<circle cx="38" cy="${bY + 26}" r="11" fill="rgba(15,51,255,0.25)" stroke="#0F33FF" stroke-width="1.5"/>`;
    svg += `<path d="M34 ${bY + 26} L37 ${bY + 29} L42 ${bY + 23}" fill="none" stroke="#FFF498" stroke-width="2" stroke-linecap="round"/>`;
    svg += renderLine(fBold, b.title, 56, bY + 22, 12, '#FFFFFF', -0.2);
    svg += renderLine(fReg, b.sub, 56, bY + 39, 10.5, '#A1A1AA', 0);
    bY += 60;
  }

  // CTA Card
  const ctaY = 515;
  svg += `<rect x="20" y="${ctaY}" width="260" height="52" rx="14" fill="#0F33FF"/>`;
  svg += `<polygon points="230,${ctaY} 280,${ctaY} 260,${ctaY + 52} 210,${ctaY + 52}" fill="#FFFFFF" fill-opacity="0.14"/>`;
  svg += renderLine(fBlack, 'AUDITORÍA BONIFICADA', 42, ctaY + 23, 13, '#FFFFFF', 0.5);
  svg += renderLine(fBold, 'INGRESAR AHORA →', 42, ctaY + 41, 12, '#FFF498', 1);

  // Footer
  svg += renderLine(fBold, 'soluweb.com.ar', 98, 588, 12, '#71717A', 0.5);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 24, left: 20 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'halfpage-300x600.png'), outBuffer);
  writeFileSync(join(outLocal, 'halfpage-300x600.png'), outBuffer);
  console.log('✓ halfpage-300x600.png');
}

// -------------------------------------------------------------
// 5. MOBILE LEADERBOARD (320 x 100 px) - Formato Móvil
// -------------------------------------------------------------
async function buildMobileLeaderboard() {
  const w = 320;
  const h = 100;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'hero.jpg'))
    .resize(w, h, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.32, saturation: 1.2 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 105 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g5" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.97"/>
        <stop offset="70%" stop-color="#0C0C0C" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g5)"/>
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="6" fill="none" stroke="#0F33FF" stroke-opacity="0.45" stroke-width="1.5"/>
  `;

  // Titular
  svg += renderRichLine(fBlack, 'Sumá [IA] y CRM a tu PyME', 12, 48, 14, '#FFFFFF', -0.5);
  svg += renderLine(fReg, 'Atención 24/7 en WhatsApp y orden.', 12, 66, 11, '#B3BFFF', 0);
  svg += renderLine(fBold, 'soluweb.com.ar', 12, 85, 11, '#FFF498', 0.5);

  // Botón a la derecha
  const btnX = 224;
  const btnY = 32;
  const btnW = 86;
  const btnH = 38;
  svg += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="8" fill="#0F33FF"/>`;
  svg += renderLine(fBlack, 'ENTRAR →', btnX + 10, btnY + 24, 11.5, '#FFF498', 0.5);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 12, left: 12 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'mobile-320x100.png'), outBuffer);
  writeFileSync(join(outLocal, 'mobile-320x100.png'), outBuffer);
  console.log('✓ mobile-320x100.png');
}

// -------------------------------------------------------------
// 6. IN-FEED / DISPLAY HORIZONTAL (1200 x 628 px)
// -------------------------------------------------------------
async function buildDisplayHorizontal() {
  const w = 1200;
  const h = 628;
  const bg = await sharp(join(root, 'src', 'assets', 'img', 'hero.jpg'))
    .resize(w, h, { fit: 'cover', position: 'right' })
    .modulate({ brightness: 0.38, saturation: 1.2 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 220 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g6" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.98"/>
        <stop offset="55%" stop-color="#0C0C0C" stop-opacity="0.88"/>
        <stop offset="85%" stop-color="#0C0C0C" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.10"/>
      </linearGradient>
      <radialGradient id="blueGlow6" cx="25%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid6" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.04"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g6)"/>
    <rect width="${w}" height="${h}" fill="url(#blueGlow6)"/>
    <rect width="${w}" height="${h}" fill="url(#grid6)"/>
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="16" fill="none" stroke="#0F33FF" stroke-opacity="0.5" stroke-width="2"/>
    <polygon points="${w - 240},0 ${w - 140},0 ${w - 200},${h} ${w - 300},${h}" fill="#0F33FF" fill-opacity="0.12"/>
  `;

  // Eyebrow badge
  svg += renderBadge('CONSULTORA DE INTELIGENCIA ARTIFICIAL & CRM', 60, 60, '#0F33FF', '#FFFFFF', 15);

  // Titular
  svg += renderRichLine(fBlack, '¿Tu negocio pierde ventas', 60, 160, 44, '#FFFFFF', -1);
  svg += renderRichLine(fBlack, 'por responder [tarde] en WhatsApp?', 60, 218, 44, '#FFFFFF', -1);

  // Bajada
  svg += renderLine(fReg, 'Diseñamos e implementamos Agentes de IA 24/7 entrenados con tu catálogo real,', 60, 276, 21, '#A1A1AA', 0);
  svg += renderLine(fReg, 'CRM a medida y automatizaciones de facturación que ahorran 20 horas por semana.', 60, 310, 21, '#D4D4D8', 0);

  // Bullets
  const bullets = [
    '✓ Respuestas inteligentes en 3 segundos los 365 días del año',
    '✓ Calificación automática de clientes y agenda directa en Calendar',
    '✓ Conectado a AFIP/ARCA, Mercado Pago y tus sistemas de gestión',
    '✓ Puesta en marcha llave en mano en 14 días con garantía',
  ];

  let curY = 362;
  for (const b of bullets) {
    svg += renderLine(fBold, b, 60, curY, 17, '#E0E7FF', 0.2);
    curY += 34;
  }

  // Botón CTA
  const btnX = 60;
  const btnY = 510;
  const btnW = 380;
  const btnH = 64;
  svg += `<rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="18" fill="#0F33FF"/>`;
  svg += `<polygon points="${btnX + btnW - 60},${btnY} ${btnX + btnW},${btnY} ${btnX + btnW - 24},${btnY + btnH} ${btnX + btnW - 84},${btnY + btnH}" fill="#FFFFFF" fill-opacity="0.14"/>`;
  svg += renderLine(fBlack, 'SOLICITAR AUDITORÍA BONIFICADA', btnX + 32, btnY + 32, 16, '#FFFFFF', 0.5);
  svg += renderLine(fBold, 'INGRESAR A SOLUWEB.COM.AR →', btnX + 32, btnY + 52, 13, '#FFF498', 1);

  // Footer URL
  svg += renderLine(fBold, 'soluweb.com.ar', 480, 552, 18, '#71717A', 0.5);

  svg += `</svg>`;

  const outBuffer = await sharp(bg)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 52, left: w - 280 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  writeFileSync(join(outPublic, 'display-1200x628.png'), outBuffer);
  writeFileSync(join(outLocal, 'display-1200x628.png'), outBuffer);
  console.log('✓ display-1200x628.png');
}

// -------------------------------------------------------------
// Generación del archivo HTML de muestra interactiva con códigos de inserción
// -------------------------------------------------------------
function buildShowcaseHtml() {
  const targetUrl = 'https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner&utm_campaign=noticias_pymes';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banners Publicitarios para Portales de Noticias — Soluweb</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #09090b;
      color: #fafafa;
      font-family: 'Montserrat', sans-serif;
      padding: 40px 20px 80px;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .badge {
      display: inline-block;
      background: #0F33FF;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 1.5px;
      padding: 6px 16px;
      border-radius: 4px;
      transform: skew(-12deg);
      margin-bottom: 16px;
    }
    .badge span { display: inline-block; transform: skew(12deg); }
    h1 {
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 900;
      margin-bottom: 12px;
    }
    h1 span { color: #0F33FF; }
    p.lead {
      color: #a1a1aa;
      font-size: 16px;
      max-width: 720px;
      margin: 0 auto;
    }
    .info-box {
      background: rgba(15, 51, 255, 0.1);
      border: 1px solid rgba(15, 51, 255, 0.3);
      border-radius: 12px;
      padding: 18px 24px;
      margin: 32px auto;
      max-width: 850px;
      font-size: 14px;
      color: #e0e7ff;
    }
    .info-box strong { color: #FFF498; }
    .banner-card {
      background: #141418;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .banner-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }
    .banner-title {
      font-size: 20px;
      font-weight: 800;
    }
    .banner-dim {
      background: #27272a;
      color: #FFF498;
      font-weight: 700;
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 6px;
    }
    .banner-desc {
      color: #a1a1aa;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .preview-stage {
      background: #000;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-x: auto;
      margin-bottom: 20px;
      border: 1px dashed rgba(255,255,255,0.15);
    }
    .preview-stage a {
      display: inline-block;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      text-decoration: none;
    }
    .preview-stage a:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(15, 51, 255, 0.35);
    }
    .preview-stage img {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }
    .code-box {
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 16px;
      position: relative;
    }
    .code-box header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1f1f23;
      font-size: 12px;
      color: #71717a;
      text-align: left;
    }
    pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      color: #38bdf8;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .copy-btn {
      background: #0F33FF;
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s ease;
    }
    .copy-btn:hover { background: #0022cc; }
    footer {
      text-align: center;
      margin-top: 60px;
      color: #71717a;
      font-size: 14px;
    }
    footer a { color: #0F33FF; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge"><span>SOLUWEB · KIT PUBLICITARIO</span></div>
      <h1>Banners Oficiales para <span>Portales de Noticias</span></h1>
      <p class="lead">Piezas gráficas de alto rendimiento en formatos IAB estándar con enlace directo y parámetros de analítica hacia <strong>soluweb.com.ar</strong>.</p>
      
      <div class="info-box">
        <strong>URL de Destino con Tracking:</strong><br>
        <code>${targetUrl}</code><br><br>
        Cada banner está alojado de manera pública y puede insertarse en cualquier gestor de anuncios (Google Ad Manager, WordPress, AdSense o HTML directo). Al hacer clic, abre en pestaña nueva.
      </div>
    </header>

    <!-- 0. FORMATO EXACTO SOLICITADO: 327 x 256 px -->
    <section class="banner-card" style="border: 2px solid #0F33FF; box-shadow: 0 0 35px rgba(15, 51, 255, 0.25);">
      <div class="banner-head">
        <h2 class="banner-title" style="color: #FFF498;">★ Formato Exacto Solicitado: 327 × 256 px (Portal de Noticias)</h2>
        <span class="banner-dim" style="background: #0F33FF; color: #fff;">327 × 256 px (y @2x Retina)</span>
      </div>
      <p class="banner-desc">Medida exacta para el espacio publicitario en la web de noticias. Se incluye versión estándar (327x256 px) y versión Retina HD (654x512 px) para máxima nitidez en pantallas de alta densidad.</p>
      
      <div style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px;">
        <!-- Variante 1 -->
        <div style="text-align: center;">
          <p style="font-size: 13px; font-weight: 700; color: #FFF498; margin-bottom: 8px;">Variante 1: WhatsApp & Ventas</p>
          <div class="preview-stage" style="padding: 16px; margin-bottom: 8px;">
            <a href="${targetUrl}" target="_blank" rel="noopener" title="Probar clic a soluweb.com.ar">
              <img src="banner-noticias-327x256.png" alt="Soluweb - Agentes de IA en WhatsApp" width="327" height="256">
            </a>
          </div>
        </div>

        <!-- Variante 2 -->
        <div style="text-align: center;">
          <p style="font-size: 13px; font-weight: 700; color: #B3BFFF; margin-bottom: 8px;">Variante 2: Eficiencia & Procesos</p>
          <div class="preview-stage" style="padding: 16px; margin-bottom: 8px;">
            <a href="${targetUrl}" target="_blank" rel="noopener" title="Probar clic a soluweb.com.ar">
              <img src="banner-noticias-327x256-v2.png" alt="Soluweb - Automatización de Procesos" width="327" height="256">
            </a>
          </div>
        </div>

        <!-- Variante 3 -->
        <div style="text-align: center;">
          <p style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">Variante 3: Demo en Vivo</p>
          <div class="preview-stage" style="padding: 16px; margin-bottom: 8px;">
            <a href="${targetUrl}" target="_blank" rel="noopener" title="Probar clic a soluweb.com.ar">
              <img src="banner-noticias-327x256-v3.png" alt="Soluweb - Sumá IA a tu Negocio" width="327" height="256">
            </a>
          </div>
        </div>
      </div>

      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS (327x256)</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 327x256 para Portal de Noticias --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; width:327px; height:256px; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/banner-noticias-327x256.png" srcset="https://soluweb.com.ar/banners/banner-noticias-327x256@2x.png 2x" alt="Soluweb - Inteligencia Artificial y Automatización para PyMEs" width="327" height="256" style="display:block; width:327px; height:256px; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.4);" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 1. BILLBOARD -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">1. Billboard / Super Leaderboard (Cabecera Principal)</h2>
        <span class="banner-dim">970 × 250 px</span>
      </div>
      <p class="banner-desc">El formato rey en portales de noticias (Infobae, Clarín, La Nación, etc.). Se ubica en la parte superior del home o entre las noticias destacadas de la portada.</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="billboard-970x250.png" alt="Soluweb - Inteligencia Artificial y Automatización para PyMEs" width="970" height="250">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 970x250 (Billboard) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; max-width:100%; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/billboard-970x250.png" alt="Soluweb - Inteligencia Artificial y Automatización para PyMEs" width="970" height="250" style="width:100%; max-width:970px; height:auto; display:block; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.35);" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 2. LEADERBOARD -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">2. Leaderboard Clásico</h2>
        <span class="banner-dim">728 × 90 px</span>
      </div>
      <p class="banner-desc">Formato horizontal clásico para la cabecera del artículo o entre párrafos intermedios.</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="leaderboard-728x90.png" alt="Soluweb - Inteligencia Artificial y Automatización" width="728" height="90">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 728x90 (Leaderboard) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; max-width:100%; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/leaderboard-728x90.png" alt="Soluweb - Inteligencia Artificial y Automatización" width="728" height="90" style="width:100%; max-width:728px; height:auto; display:block; border-radius:6px;" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 3. MEDIUM RECTANGLE -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">3. Medium Rectangle (Robapáginas / MPU)</h2>
        <span class="banner-dim">300 × 250 px</span>
      </div>
      <p class="banner-desc">El formato más cliqueado en noticias. Se ubica en la barra lateral (sidebar) o dentro de la lectura de la noticia (párrafo 3 o 4).</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="rectangle-300x250.png" alt="Soluweb - Chatbots IA y CRM" width="300" height="250">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 300x250 (Medium Rectangle) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/rectangle-300x250.png" alt="Soluweb - Chatbots IA y CRM" width="300" height="250" style="display:block; border-radius:8px;" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 4. HALF PAGE -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">4. Half Page Banner (Rascacielos / Sticky Sidebar)</h2>
        <span class="banner-dim">300 × 600 px</span>
      </div>
      <p class="banner-desc">Formato vertical de alta visibilidad para la barra lateral derecha que acompaña al lector mientras navega la noticia.</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="halfpage-300x600.png" alt="Soluweb - Transformación Digital PyME" width="300" height="600">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 300x600 (Half Page) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/halfpage-300x600.png" alt="Soluweb - Transformación Digital PyME" width="300" height="600" style="display:block; border-radius:10px;" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 5. MOBILE LEADERBOARD -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">5. Mobile Leaderboard (Para Lectores en Celular)</h2>
        <span class="banner-dim">320 × 100 px</span>
      </div>
      <p class="banner-desc">Optimizado para pantallas móviles; ideal como anuncio fijo al pie de pantalla o entre párrafos de la nota en smartphones.</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="mobile-320x100.png" alt="Soluweb - Sumá IA a tu PyME" width="320" height="100">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 320x100 (Mobile) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/mobile-320x100.png" alt="Soluweb - Sumá IA a tu PyME" width="320" height="100" style="display:block; border-radius:6px;" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <!-- 6. DISPLAY HORIZONTAL -->
    <section class="banner-card">
      <div class="banner-head">
        <h2 class="banner-title">6. In-Feed & Display Native (1200 × 628 px)</h2>
        <span class="banner-dim">1200 × 628 px</span>
      </div>
      <p class="banner-desc">Formato panorámico HD de máximo detalle para redes de display, Google Ad Manager nativo o artículos patrocinados.</p>
      <div class="preview-stage">
        <a href="${targetUrl}" target="_blank" rel="noopener" title="Hacer clic para ir a soluweb.com.ar">
          <img src="display-1200x628.png" alt="Soluweb - Consultora de IA y CRM" width="1200" height="628">
        </a>
      </div>
      <div class="code-box">
        <header>
          <span>CÓDIGO HTML PARA PEGAR EN LA PÁGINA DE NOTICIAS</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='¡Copiado!'; setTimeout(()=>this.innerText='Copiar Código', 2000);">Copiar Código</button>
        </header>
        <pre>&lt;!-- Banner Soluweb 1200x628 (Display HD) --&gt;
&lt;a href="${targetUrl}" target="_blank" rel="noopener" style="display:inline-block; max-width:100%; text-decoration:none;"&gt;
  &lt;img src="https://soluweb.com.ar/banners/display-1200x628.png" alt="Soluweb - Consultora de IA y CRM" width="1200" height="628" style="width:100%; max-width:1200px; height:auto; display:block; border-radius:12px;" /&gt;
&lt;/a&gt;</pre>
      </div>
    </section>

    <footer>
      <p>Generado con el Sistema de Identidad Visual de <a href="https://soluweb.com.ar" target="_blank">Soluweb.com.ar</a></p>
    </footer>
  </div>
</body>
</html>`;

  writeFileSync(join(outPublic, 'index.html'), html);
  writeFileSync(join(outLocal, 'index.html'), html);
  console.log('✓ index.html (Showcase de banners con códigos listos para copiar)');
}

// -------------------------------------------------------------
// Componente de Banner HTML / CSS Responsivo e Interactivo
// -------------------------------------------------------------
function buildResponsiveComponent() {
  const targetUrl = 'https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner_responsive&utm_campaign=noticias_pymes';

  const component = `<!-- BANNER SOLUWEB RESPONSIVO PARA PORTALES DE NOTICIAS -->
<!-- Pegar este bloque completo donde se deba mostrar el banner -->
<div class="soluweb-news-banner" style="all: initial; font-family: 'Montserrat', system-ui, -apple-system, sans-serif; display: block; margin: 24px 0; width: 100%;">
  <a href="${targetUrl}" target="_blank" rel="noopener" style="display: block; text-decoration: none; position: relative; background: radial-gradient(120% 120% at 90% 10%, rgba(15,51,255,0.45) 0%, rgba(12,12,12,0.95) 60%, #0C0C0C 100%); border: 1.5px solid rgba(15, 51, 255, 0.5); border-radius: 14px; padding: 24px 28px; box-sizing: border-box; overflow: hidden; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45); transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;">
    
    <!-- Efecto paralelogramo de fondo -->
    <div style="position: absolute; right: -40px; top: -20px; width: 140px; height: 200%; background: rgba(15, 51, 255, 0.12); transform: rotate(-18deg); pointer-events: none;"></div>
    
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; position: relative; z-index: 2;">
      
      <!-- Lado Izquierdo: Marca y Propuesta -->
      <div style="flex: 1 1 340px; min-width: 260px;">
        <div style="display: inline-block; background: #0F33FF; color: #FFFFFF; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 12px; border-radius: 3px; transform: skew(-14deg); margin-bottom: 12px;">
          <span style="display: inline-block; transform: skew(14deg);">IA & AUTOMATIZACIÓN PYME</span>
        </div>
        
        <h3 style="color: #FFFFFF; font-size: clamp(20px, 2.4vw, 26px); font-weight: 900; line-height: 1.2; margin: 0 0 8px 0; letter-spacing: -0.5px;">
          ¿Tu empresa pierde ventas por responder <span style="background: #0F33FF; padding: 0 6px; border-radius: 3px; display: inline-block; transform: skew(-8deg);"><span style="display: inline-block; transform: skew(8deg); color: #FFFFFF;">tarde</span></span> en WhatsApp?
        </h3>
        
        <p style="color: #A1A1AA; font-size: clamp(13px, 1.3vw, 15px); margin: 0; line-height: 1.45;">
          Agentes de IA 24/7 con tu catálogo real, CRM comercial y facturación automática en 14 días.
        </p>
      </div>

      <!-- Lado Derecho: Botón CTA -->
      <div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-start; justify-content: center;">
        <div style="background: #0F33FF; color: #FFFFFF; padding: 14px 26px; border-radius: 12px; font-size: 14px; font-weight: 900; letter-spacing: 0.5px; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 20px rgba(15, 51, 255, 0.4); text-align: center;">
          <span>SOLICITAR AUDITORÍA GRATIS</span>
          <span style="color: #FFF498; font-size: 16px;">→</span>
        </div>
        <span style="color: #71717A; font-size: 11px; margin-top: 6px; padding-left: 4px; font-weight: 600;">soluweb.com.ar · Cupos Limitados</span>
      </div>

    </div>
  </a>
</div>
<!-- FIN BANNER SOLUWEB -->
`;

  writeFileSync(join(outPublic, 'banner-responsive.html'), component);
  writeFileSync(join(outLocal, 'banner-responsive.html'), component);
  console.log('✓ banner-responsive.html (Widget HTML responsivo)');
}

// -------------------------------------------------------------
// Componente HTML Exacto 327 x 256 px
// -------------------------------------------------------------
function buildExact327Component() {
  const targetUrl = 'https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner_327x256&utm_campaign=noticias_pymes';

  const component = `<!-- BANNER SOLUWEB EXACTO 327x256 PARA PORTAL DE NOTICIAS -->
<div style="all:initial; display:inline-block; width:327px; height:256px; font-family:'Montserrat', system-ui, -apple-system, sans-serif;">
  <a href="${targetUrl}" target="_blank" rel="noopener" style="display:block; width:327px; height:256px; text-decoration:none; position:relative; background:#0C0C0C radial-gradient(circle at 80% 20%, rgba(15,51,255,0.45) 0%, rgba(12,12,12,0.96) 65%); border:1.5px solid rgba(15,51,255,0.6); border-radius:12px; box-sizing:border-box; padding:16px 18px; overflow:hidden; box-shadow:0 10px 28px rgba(0,0,0,0.45); transition:transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;">
    
    <!-- Paralelogramo de fondo -->
    <div style="position:absolute; right:-25px; top:-10px; width:65px; height:280px; background:rgba(15,51,255,0.12); transform:rotate(-18deg); pointer-events:none;"></div>
    
    <!-- Header: Logo + Badge -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; position:relative; z-index:2;">
      <span style="font-size:18px; font-weight:900; color:#FFFFFF; letter-spacing:-0.5px;">solu<span style="background:#0F33FF; padding:1px 5px; border-radius:3px; display:inline-block; transform:skew(-12deg);"><span style="display:inline-block; transform:skew(12deg); color:#FFFFFF;">web.</span></span></span>
      <span style="background:#0F33FF; color:#FFFFFF; font-size:9.5px; font-weight:800; letter-spacing:1px; text-transform:uppercase; padding:3px 9px; border-radius:3px; transform:skew(-12deg);"><span style="display:inline-block; transform:skew(12deg);">IA & CRM</span></span>
    </div>

    <!-- Titular -->
    <h4 style="color:#FFFFFF; font-size:16px; font-weight:900; line-height:1.2; margin:0 0 6px 0; letter-spacing:-0.4px; position:relative; z-index:2;">
      ¿Perdés clientes por responder <span style="background:#0F33FF; padding:0 4px; border-radius:2px; display:inline-block; transform:skew(-8deg);"><span style="display:inline-block; transform:skew(8deg); color:#FFFFFF;">tarde</span></span> en WhatsApp?
    </h4>

    <!-- Bajada -->
    <p style="color:#A1A1AA; font-size:11px; margin:0 0 8px 0; line-height:1.4; position:relative; z-index:2;">
      Agentes de IA 24/7 con tu catálogo real, CRM y facturación automática en 14 días.
    </p>

    <!-- Highlight -->
    <div style="color:#FFF498; font-size:10px; font-weight:700; margin-bottom:12px; position:relative; z-index:2;">
      ✓ Respuestas en 3 seg · Cero fugas de ventas
    </div>

    <!-- Botón CTA -->
    <div style="background:#0F33FF; color:#FFFFFF; border-radius:10px; padding:10px 14px; text-align:center; font-size:12px; font-weight:900; letter-spacing:0.4px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 6px 16px rgba(15,51,255,0.4); position:relative; z-index:2;">
      <span>SOLICITAR AUDITORÍA GRATIS</span>
      <span style="color:#FFF498; font-size:14px;">→</span>
    </div>

    <!-- Footer URL -->
    <div style="text-align:center; margin-top:7px; color:#71717A; font-size:9.5px; font-weight:600; position:relative; z-index:2;">
      soluweb.com.ar · Cupos Limitados
    </div>
  </a>
</div>
<!-- FIN BANNER 327x256 -->
`;

  writeFileSync(join(outPublic, 'banner-327x256.html'), component);
  writeFileSync(join(outLocal, 'banner-327x256.html'), component);
  console.log('✓ banner-327x256.html (Widget HTML exacto 327x256)');
}

// -------------------------------------------------------------
// Documentación y Guía para el Webmaster del Portal
// -------------------------------------------------------------
function buildGuideMd() {
  const md = `# Guía de Inserción de Banners Publicitarios — Soluweb

Este paquete contiene todos los formatos oficiales de banners para pautar en **portales de noticias, diarios digitales y sitios de prensa** (como Infobae, Clarín, La Nación, La Gaceta, Ámbito, El Cronista, o blogs de negocios).

---

## 🔗 Datos de Enlace y Campaña
- **URL de Destino oficial:**  
  \`https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner_327x256&utm_campaign=noticias_pymes\`
- **Destino del clic:** Abre en nueva pestaña (\`target="_blank"\`).
- **Atributos de seguridad:** \`rel="noopener"\`.

---

## 🎯 Formato Exacto Solicitado: 327 × 256 px

### Código HTML Recomendado (Con soporte Retina 2x):
\`\`\`html
<!-- Banner Soluweb 327x256 para Portal de Noticias -->
<a href="https://soluweb.com.ar/?utm_source=portal_noticias&utm_medium=banner_327x256&utm_campaign=noticias_pymes" target="_blank" rel="noopener" style="display:inline-block; width:327px; height:256px; text-decoration:none;">
  <img src="https://soluweb.com.ar/banners/banner-noticias-327x256.png" srcset="https://soluweb.com.ar/banners/banner-noticias-327x256@2x.png 2x" alt="Soluweb - Inteligencia Artificial y Automatización para PyMEs" width="327" height="256" style="display:block; width:327px; height:256px; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.4);" />
</a>
\`\`\`

### Enlaces Directos a los Archivos:
- **Imagen 327x256 (Variante 1 - Ventas WhatsApp):** \`https://soluweb.com.ar/banners/banner-noticias-327x256.png\`
- **Imagen 327x256 @2x Retina:** \`https://soluweb.com.ar/banners/banner-noticias-327x256@2x.png\`
- **Imagen 327x256 (Variante 2 - Eficiencia & Procesos):** \`https://soluweb.com.ar/banners/banner-noticias-327x256-v2.png\`
- **Widget HTML Autocontenido:** \`https://soluweb.com.ar/banners/banner-327x256.html\`

---

## 📐 Otros Formatos Estándar Incluidos

| Archivo | Dimensiones (px) | Ubicación Habitual en Portales de Noticias |
|---|---|---|
| \`banner-noticias-327x256.png\` | **327 × 256** | **Espacio a medida para el portal de noticias** |
| \`billboard-970x250.png\` | **970 × 250** | Cabecera principal, entre notas de portada o cabecera de sección. |
| \`leaderboard-728x90.png\` | **728 × 90** | Barra superior de noticias o entre párrafos del artículo. |
| \`rectangle-300x250.png\` | **300 × 250** | Barra lateral derecha (sidebar) o dentro de la noticia (párrafos 3 a 5). |
| \`halfpage-300x600.png\` | **300 × 600** | Rascacielos / Sticky lateral que acompaña el scroll de la nota. |
| \`mobile-320x100.png\` | **320 × 100** | Anuncio móvil para lectores en celular (top, sticky o in-read). |
| \`display-1200x628.png\` | **1200 × 628** | Publicidad nativa, artículos patrocinados y Google Display. |
| \`banner-responsive.html\` | **100% Responsivo** | Código HTML puro autocontenido que se adapta a cualquier ancho. |

---

## 🌐 Muestra en Vivo
Todos los banners y sus códigos interactivos pueden visualizarse abriendo el archivo [\`banners-web/index.html\`](file:///c:/Users/HP/OneDrive/Desktop/Cristian%20Trabajo/Soluweb/banners-web/index.html) o visitando directamente:  
**\`https://soluweb.com.ar/banners/\`** (una vez desplegado).
`;

  writeFileSync(join(outLocal, 'README.md'), md);
  writeFileSync(join(outPublic, 'README.md'), md);
  console.log('✓ README.md (Guía para el portal de noticias)');
}

// -------------------------------------------------------------
// Ejecución Principal
// -------------------------------------------------------------
async function main() {
  console.log('--- Generando Banners para Portales de Noticias ---');
  await buildBanner327x256();
  await buildBillboard();
  await buildLeaderboard();
  await buildRectangle();
  await buildHalfPage();
  await buildMobileLeaderboard();
  await buildDisplayHorizontal();
  buildShowcaseHtml();
  buildResponsiveComponent();
  buildExact327Component();
  buildGuideMd();
  console.log('--- ¡Todos los banners fueron generados con éxito! ---');
}

main().catch((err) => {
  console.error('Error generando banners:', err);
  process.exit(1);
});
