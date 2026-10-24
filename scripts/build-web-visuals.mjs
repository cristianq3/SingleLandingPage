// Generador de Visuales de Servicios (UI Mockups + Necesidad Real) y Capturas de WhatsApp / Redes para Soluweb
// Uso: node scripts/build-web-visuals.mjs
import opentype from 'opentype.js';
import sharp from 'sharp';
import { mkdirSync, readFileSync, copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'src', 'assets', 'img');
const backupDir = join(root, 'scripts', 'bg-base');

mkdirSync(backupDir, { recursive: true });

const baseFiles = ['hero.jpg', 'svc-ia.jpg', 'svc-automatizacion.jpg', 'svc-crm.jpg', 'svc-gestion.jpg', 'svc-integraciones.jpg', 'svc-web.jpg', 'about.jpg'];
for (const f of baseFiles) {
  const srcPath = join(imgDir, f);
  const bakPath = join(backupDir, f);
  if (existsSync(srcPath) && !existsSync(bakPath)) {
    copyFileSync(srcPath, bakPath);
  }
}

const loadFont = (file) => {
  const b = readFileSync(join(root, 'scripts', 'fonts', file));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};

const fBlack = loadFont('Montserrat-Black.ttf');
const fBold = loadFont('Montserrat-Bold.ttf');
const fReg = loadFont('Montserrat-Regular.ttf');

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

function renderCentered(font, str, cx, y, size, fill = '#FFFFFF', track = 0) {
  const w = textWidth(font, str, size, track);
  return renderLine(font, str, cx - w / 2, y, size, fill, track);
}

function pill(x, y, text, bg, fg, size = 14, padX = 16, padY = 8, rx = 14) {
  const tw = textWidth(fBold, text, size, 0.5);
  const w = tw + padX * 2;
  const h = size + padY * 2;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${bg}"/>` +
    renderLine(fBold, text, x + padX, y + padY + size * 0.82, size, fg, 0.5)
  );
}

function doubleCheck(x, y, color = '#38BDF8') {
  return `<path d="M${x} ${y} l4 4 l8 -8 M${x + 6} ${y} l4 4 l8 -8" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function checkIcon(x, y, color = '#4ADE80', s = 1) {
  return `<path d="M${x} ${y} l${4 * s} ${4 * s} l${8 * s} ${-8 * s}" fill="none" stroke="${color}" stroke-width="${2.5 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function crossIcon(x, y, color = '#F87171', s = 8) {
  return `<path d="M${x} ${y} l${s} ${s} M${x + s} ${y} l${-s} ${s}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
}

// ============================================================================
// 1. SERVICIO IA (svc-ia.jpg) — Necesidad: Clientes preguntan fuera de horario -> IA responde y agenda en 2 seg
// ============================================================================
async function buildSvcIA() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-ia.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.42, saturation: 1.25 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070913" stop-opacity="0.88"/>
        <stop offset="50%" stop-color="#0B112C" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#070913" stop-opacity="0.92"/>
      </linearGradient>
      <radialGradient id="glow" cx="75%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>

    <!-- Etiqueta superior de problema vs solución -->
    <g filter="url(#shadow)">
      <rect x="34" y="30" width="370" height="44" rx="22" fill="#18181F" stroke="#EF4444" stroke-opacity="0.5" stroke-width="1.5"/>
      <circle cx="60" cy="52" r="8" fill="#EF4444"/>
      ${renderLine(fBold, 'Domingo 23:40 hs · Sin perder la venta', 78, 58, 14, '#FCA5A5', 0.2)}
    </g>

    <!-- Ventana principal estilo WhatsApp Business Dark -->
    <g filter="url(#shadow)">
      <rect x="34" y="90" width="510" height="550" rx="26" fill="#0F141C" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1.5"/>
      <!-- Header WhatsApp -->
      <rect x="34" y="90" width="510" height="76" rx="26" fill="#18222D"/>
      <rect x="34" y="140" width="510" height="26" fill="#18222D"/>
      <circle cx="76" cy="128" r="22" fill="#0F33FF"/>
      ${renderCentered(fBlack, 'IA', 76, 135, 16, '#FFFFFF')}
      <circle cx="92" cy="144" r="6" fill="#22C55E" stroke="#18222D" stroke-width="2"/>
      ${renderLine(fBold, 'Asistente Comercial IA · Soluweb', 112, 124, 16.5, '#FFFFFF', 0.2)}
      ${renderLine(fReg, 'En línea · Responde en 2 segundos 24/7', 112, 146, 12.5, '#34D399', 0.2)}

      <!-- Burbuja Cliente 1 -->
      <rect x="54" y="186" width="380" height="72" rx="18" fill="#1F2C3A"/>
      ${renderLine(fReg, 'Hola! Vi el anuncio en Instagram. ¿Tienen', 72, 214, 14.5, '#F3F4F6')}
      ${renderLine(fReg, 'disponibilidad esta semana y qué precio?', 72, 236, 14.5, '#F3F4F6')}
      ${renderLine(fReg, '23:41', 388, 248, 11, '#9CA3AF')}

      <!-- Burbuja Agente IA 1 -->
      <rect x="114" y="274" width="410" height="116" rx="18" fill="#0F33FF"/>
      ${renderLine(fBold, '¡Hola Martín! Sí, tenemos stock inmediato.', 132, 302, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'El plan completo tiene un valor de $185.000', 132, 326, 14, '#E0E7FF')}
      ${renderLine(fReg, 'o 3 cuotas sin interés. ¿Te agendo una demo', 132, 348, 14, '#E0E7FF')}
      ${renderLine(fBold, 'para mañana martes a las 10:30 o 16:00 hs?', 132, 370, 14, '#FFF498')}
      ${renderLine(fReg, '23:41', 458, 380, 11, '#C7D2FE')}
      ${doubleCheck(492, 375, '#FFF498')}

      <!-- Burbuja Cliente 2 -->
      <rect x="54" y="406" width="310" height="58" rx="18" fill="#1F2C3A"/>
      ${renderLine(fReg, 'Genial! Anotame martes 10:30 hs', 72, 440, 14.5, '#FFFFFF')}
      ${renderLine(fReg, '23:42', 318, 452, 11, '#9CA3AF')}

      <!-- Burbuja Agente IA 2 (Confirmación) -->
      <rect x="124" y="480" width="400" height="92" rx="18" fill="#0F33FF"/>
      ${checkIcon(142, 506, '#FFF498', 1)}
      ${renderLine(fBold, '¡Listo! Turno confirmado: Martes 10:30 hs.', 162, 510, 14.5, '#FFF498')}
      ${renderLine(fReg, 'Ya te envié el acceso al calendario y avisé', 142, 534, 13.5, '#E0E7FF')}
      ${renderLine(fReg, 'al asesor comercial. ¡Nos vemos mañana!', 142, 554, 13.5, '#E0E7FF')}
      ${doubleCheck(492, 558, '#FFF498')}
    </g>

    <!-- Tarjeta flotante derecha: Acciones ejecutadas por la IA -->
    <g filter="url(#shadow)">
      <rect x="564" y="140" width="302" height="280" rx="22" fill="#131624" stroke="#0F33FF" stroke-width="2"/>
      <polygon points="564,165 572,140 578,140 570,165" fill="#FFF498"/>
      ${renderLine(fBold, 'ACCIONES AUTOMÁTICAS', 590, 178, 13, '#FFF498', 1.2)}

      <rect x="584" y="198" width="262" height="56" rx="12" fill="#1B2034"/>
      <circle cx="610" cy="226" r="13" fill="#22C55E" fill-opacity="0.2"/>
      ${checkIcon(604, 226, '#4ADE80', 1)}
      ${renderLine(fBold, 'Audio y texto procesados', 632, 222, 13.5, '#FFFFFF')}
      ${renderLine(fReg, 'Catálogo y precios al instante', 632, 240, 11.5, '#9CA3AF')}

      <rect x="584" y="266" width="262" height="56" rx="12" fill="#1B2034"/>
      <circle cx="610" cy="294" r="13" fill="#0F33FF" fill-opacity="0.3"/>
      ${checkIcon(604, 294, '#60A5FA', 1)}
      ${renderLine(fBold, 'Lead calificado en CRM', 632, 290, 13.5, '#FFFFFF')}
      ${renderLine(fReg, 'Etiqueta: Listo para comprar', 632, 308, 11.5, '#9CA3AF')}

      <rect x="584" y="334" width="262" height="60" rx="12" fill="#0F33FF" fill-opacity="0.22" stroke="#0F33FF" stroke-width="1"/>
      <circle cx="610" cy="364" r="13" fill="#FFF498" fill-opacity="0.2"/>
      ${checkIcon(604, 364, '#FFF498', 1)}
      ${renderLine(fBold, 'Google Calendar agendado', 632, 359, 13.5, '#FFF498')}
      ${renderLine(fReg, 'Martes 10:30 hs · Recordatorio ON', 632, 378, 11.5, '#E0E7FF')}
    </g>

    <!-- Badge inferior de impacto -->
    <g filter="url(#shadow)">
      <rect x="564" y="450" width="302" height="120" rx="22" fill="#0F33FF"/>
      ${renderLine(fBlack, '+64% cierres', 592, 506, 34, '#FFFFFF', -0.5)}
      ${renderLine(fBold, 'Atendiendo al instante 24/7', 592, 540, 15, '#FFF498', 0.2)}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-ia.jpg'));
  console.log('✓ svc-ia.jpg');
}

// ============================================================================
// 2. SERVICIO AUTOMATIZACIÓN (svc-automatizacion.jpg)
// ============================================================================
async function buildSvcAutomatizacion() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-automatizacion.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.38, saturation: 1.2 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#080A14" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#0C132E" stop-opacity="0.85"/>
      </linearGradient>
      <filter id="sh2" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad2)"/>

    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.5" fill="#FFFFFF" fill-opacity="0.12"/>
    </pattern>
    <rect width="${w}" height="${h}" fill="url(#dotGrid)"/>

    <!-- Banner Superior: Antes vs Después -->
    <g filter="url(#sh2)">
      <rect x="48" y="36" width="804" height="66" rx="18" fill="#131726" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>
      <rect x="64" y="50" width="346" height="38" rx="10" fill="#EF4444" fill-opacity="0.15"/>
      ${crossIcon(80, 65, '#FCA5A5', 8)}
      ${renderLine(fBold, 'ANTES: 45 min pasando datos a mano', 98, 74, 13.5, '#FCA5A5')}
      <rect x="430" y="50" width="406" height="38" rx="10" fill="#0F33FF"/>
      ${checkIcon(446, 69, '#FFF498', 1)}
      ${renderLine(fBold, 'AHORA: 3 segundos 100% automático sin errores', 466, 74, 13.5, '#FFF498')}
    </g>

    <!-- Líneas conectoras del flujo -->
    <path d="M 280 285 C 340 285, 340 192, 400 192" fill="none" stroke="#0F33FF" stroke-width="4"/>
    <path d="M 280 285 C 340 285, 340 316, 400 316" fill="none" stroke="#0F33FF" stroke-width="4"/>
    <path d="M 280 285 C 340 285, 340 440, 400 440" fill="none" stroke="#0F33FF" stroke-width="4"/>
    <circle cx="340" cy="240" r="6" fill="#FFF498"/>
    <circle cx="340" cy="316" r="6" fill="#FFF498"/>
    <circle cx="340" cy="380" r="6" fill="#FFF498"/>

    <!-- NODO 1: Disparador -->
    <g filter="url(#sh2)">
      <rect x="48" y="210" width="236" height="150" rx="22" fill="#15192B" stroke="#22C55E" stroke-width="2.5"/>
      <rect x="68" y="230" width="120" height="26" rx="8" fill="#22C55E" fill-opacity="0.2"/>
      ${renderLine(fBold, 'DISPARADOR', 82, 248, 12, '#4ADE80', 1)}
      ${renderLine(fBlack, 'Nueva Venta', 68, 286, 22, '#FFFFFF')}
      ${renderLine(fBold, 'o Pago Recibido', 68, 312, 18, '#A1A1AA')}
      ${renderLine(fReg, 'Web · WhatsApp · MercadoPago', 68, 340, 12.5, '#60A5FA')}
    </g>

    <!-- NODO 2: Facturación AFIP / ARCA -->
    <g filter="url(#sh2)">
      <rect x="380" y="140" width="472" height="104" rx="20" fill="#15192B" stroke="#0F33FF" stroke-width="2"/>
      <circle cx="420" cy="192" r="21" fill="#0F33FF"/>
      ${renderCentered(fBlack, '01', 420, 199, 16, '#FFFFFF')}
      ${renderLine(fBold, 'Factura Electrónica ARCA / AFIP', 454, 182, 15, '#FFFFFF')}
      ${renderLine(fReg, 'Calcula IVA, emite CAE y registra contabilidad.', 454, 208, 12.5, '#9CA3AF')}
      <rect x="752" y="156" width="84" height="28" rx="8" fill="#22C55E" fill-opacity="0.2"/>
      ${renderCentered(fBold, 'LISTO 1.2s', 794, 175, 11, '#4ADE80')}
    </g>

    <!-- NODO 3: Descuento de Stock y ERP -->
    <g filter="url(#sh2)">
      <rect x="380" y="264" width="472" height="104" rx="20" fill="#15192B" stroke="#0F33FF" stroke-width="2"/>
      <circle cx="420" cy="316" r="21" fill="#0F33FF"/>
      ${renderCentered(fBlack, '02', 420, 323, 16, '#FFFFFF')}
      ${renderLine(fBold, 'Actualiza Stock, Planillas y CRM', 454, 306, 15, '#FFFFFF')}
      ${renderLine(fReg, 'Sincroniza depósito, local y tienda online.', 454, 332, 12.5, '#9CA3AF')}
      <rect x="752" y="280" width="84" height="28" rx="8" fill="#22C55E" fill-opacity="0.2"/>
      ${renderCentered(fBold, 'LISTO 0.8s', 794, 299, 11, '#4ADE80')}
    </g>

    <!-- NODO 4: Envío por WhatsApp al cliente -->
    <g filter="url(#sh2)">
      <rect x="380" y="388" width="472" height="104" rx="20" fill="#15192B" stroke="#FFF498" stroke-width="2"/>
      <circle cx="420" cy="440" r="21" fill="#FFF498"/>
      ${renderCentered(fBlack, '03', 420, 447, 16, '#0C0C0C')}
      ${renderLine(fBold, 'Comprobante por WhatsApp', 454, 430, 15, '#FFF498')}
      ${renderLine(fReg, 'El cliente recibe su factura y tracking al instante.', 454, 456, 12.5, '#E0E7FF')}
      <rect x="752" y="404" width="84" height="28" rx="8" fill="#FFF498" fill-opacity="0.2"/>
      ${renderCentered(fBold, 'ENVIADO', 794, 423, 11, '#FFF498')}
    </g>

    <!-- Barra inferior de Ahorro -->
    <g filter="url(#sh2)">
      <rect x="48" y="526" width="804" height="108" rx="22" fill="#0F33FF"/>
      <polygon points="680,526 852,526 810,634 638,634" fill="#FFFFFF" fill-opacity="0.1"/>
      ${renderLine(fBlack, '-20 hs / semana', 74, 588, 33, '#FFFFFF', -0.5)}
      ${renderLine(fBold, 'de trabajo administrativo ahorradas en tu equipo', 388, 574, 15, '#FFF498')}
      ${renderLine(fReg, 'Conectamos n8n · Make · Sheets · WhatsApp · ERP', 388, 600, 13.5, '#E0E7FF')}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-automatizacion.jpg'));
  console.log('✓ svc-automatizacion.jpg');
}

// ============================================================================
// 3. SERVICIO CRM (svc-crm.jpg)
// ============================================================================
async function buildSvcCRM() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-crm.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.38, saturation: 1.2 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#080A12" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#0D1326" stop-opacity="0.94"/>
      </linearGradient>
      <filter id="sh3" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad3)"/>

    <!-- Header del Tablero CRM -->
    <g filter="url(#sh3)">
      <rect x="40" y="34" width="820" height="72" rx="18" fill="#141829" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>
      ${renderLine(fBlack, 'EMBUDO COMERCIAL SOLUWEB', 66, 66, 16, '#FFF498', 1)}
      ${renderLine(fReg, 'Ningún presupuesto queda sin seguimiento · Todo tu equipo sincronizado', 66, 88, 13.5, '#9CA3AF')}
      <rect x="650" y="48" width="190" height="44" rx="12" fill="#0F33FF"/>
      ${renderCentered(fBold, '$8.450.000 EN CURSO', 745, 75, 13, '#FFFFFF', 0.5)}
    </g>

    <!-- COLUMNA 1: Nuevas Consultas -->
    <g filter="url(#sh3)">
      <rect x="40" y="126" width="260" height="410" rx="20" fill="#111522" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.5"/>
      <circle cx="68" cy="158" r="6" fill="#60A5FA"/>
      ${renderLine(fBold, 'NUEVAS CONSULTAS (14)', 84, 163, 13, '#FFFFFF', 0.6)}

      <rect x="56" y="182" width="228" height="106" rx="14" fill="#1A2035"/>
      ${renderLine(fBold, 'Constructora Del Norte', 72, 210, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'Consulta por sistema ERP', 72, 232, 12.5, '#9CA3AF')}
      <rect x="72" y="248" width="110" height="24" rx="6" fill="#0F33FF" fill-opacity="0.3"/>
      ${renderLine(fBold, 'WhatsApp IA', 82, 264, 11, '#93C5FD')}
      ${renderLine(fBold, '$950.000', 204, 265, 13, '#FFF498')}

      <rect x="56" y="302" width="228" height="106" rx="14" fill="#1A2035"/>
      ${renderLine(fBold, 'Clínica San Martín', 72, 330, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'Bot de turnos + recordatorios', 72, 352, 12.5, '#9CA3AF')}
      <rect x="72" y="368" width="96" height="24" rx="6" fill="#A855F7" fill-opacity="0.25"/>
      ${renderLine(fBold, 'Instagram', 84, 384, 11, '#D8B4FE')}
      ${renderLine(fBold, '$480.000', 204, 385, 13, '#FFF498')}

      <rect x="56" y="422" width="228" height="94" rx="14" fill="#1A2035" fill-opacity="0.6"/>
      ${renderLine(fBold, 'Distribuidora Tucumán', 72, 450, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'Integración Mercado Pago', 72, 472, 12.5, '#9CA3AF')}
      ${renderLine(fBold, '$620.000', 204, 498, 13, '#FFF498')}
    </g>

    <!-- COLUMNA 2: Seguimiento Automático -->
    <g filter="url(#sh3)">
      <rect x="320" y="126" width="260" height="410" rx="20" fill="#111522" stroke="#0F33FF" stroke-width="2"/>
      <circle cx="348" cy="158" r="6" fill="#FFF498"/>
      ${renderLine(fBold, 'SEGUIMIENTO ACTIVO (8)', 364, 163, 13, '#FFF498', 0.6)}

      <rect x="336" y="182" width="228" height="136" rx="14" fill="#1B2444" stroke="#0F33FF" stroke-width="1.5"/>
      <rect x="352" y="196" width="196" height="24" rx="6" fill="#FFF498" fill-opacity="0.18"/>
      ${checkIcon(360, 208, '#FFF498', 0.8)}
      ${renderLine(fBold, 'IA envió recordatorio hoy', 376, 212, 11, '#FFF498')}
      ${renderLine(fBold, 'Inmobiliaria Libertador', 352, 244, 15, '#FFFFFF')}
      ${renderLine(fReg, 'Presupuesto enviado hace 48h', 352, 266, 12.5, '#D4D4D8')}
      ${renderLine(fBold, 'Resp: "Cerramos el jueves"', 352, 290, 12.5, '#4ADE80')}

      <rect x="336" y="332" width="228" height="118" rx="14" fill="#1A2035"/>
      ${renderLine(fBold, 'Estudio Contable Paz', 352, 360, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'Reunión agendada Mar 15hs', 352, 382, 12.5, '#9CA3AF')}
      <rect x="352" y="398" width="140" height="26" rx="6" fill="#0F33FF"/>
      ${renderLine(fBold, 'Alerta WhatsApp ON', 364, 415, 11, '#FFFFFF')}
    </g>

    <!-- COLUMNA 3: Ventas Cerradas -->
    <g filter="url(#sh3)">
      <rect x="600" y="126" width="260" height="410" rx="20" fill="#111522" stroke="#22C55E" stroke-opacity="0.6" stroke-width="2"/>
      <circle cx="628" cy="158" r="6" fill="#22C55E"/>
      ${renderLine(fBold, 'VENTAS CERRADAS (19)', 644, 163, 13, '#4ADE80', 0.6)}

      <rect x="616" y="182" width="228" height="114" rx="14" fill="#132A24" stroke="#22C55E" stroke-opacity="0.5" stroke-width="1.5"/>
      ${renderLine(fBold, 'Grupo Agropecuario NOA', 632, 210, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'CRM + Bot Calificador', 632, 232, 12.5, '#A7F3D0')}
      ${renderLine(fBlack, '$1.850.000', 632, 270, 20, '#4ADE80')}
      ${renderLine(fBold, 'COBRADO', 754, 268, 11.5, '#FFF498')}

      <rect x="616" y="310" width="228" height="114" rx="14" fill="#132A24" stroke="#22C55E" stroke-opacity="0.4" stroke-width="1"/>
      ${renderLine(fBold, 'Mayorista Textil Sur', 632, 338, 14.5, '#FFFFFF')}
      ${renderLine(fReg, 'Sistema de Pedidos B2B', 632, 360, 12.5, '#A7F3D0')}
      ${renderLine(fBlack, '$1.420.000', 632, 398, 20, '#4ADE80')}
      ${renderLine(fBold, 'COBRADO', 754, 396, 11.5, '#FFF498')}
    </g>

    <!-- Footer Impacto -->
    <g filter="url(#sh3)">
      <rect x="40" y="556" width="820" height="84" rx="20" fill="#0F33FF"/>
      ${renderLine(fBold, 'EL 60% DE LAS VENTAS SE CIERRAN EN EL SEGUIMIENTO', 70, 592, 14, '#FFF498', 1)}
      ${renderLine(fBlack, 'Cero presupuestos olvidados en Excel o cuadernos.', 70, 620, 22, '#FFFFFF', -0.3)}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-crm.jpg'));
  console.log('✓ svc-crm.jpg');
}

// ============================================================================
// 4. SERVICIO GESTIÓN (svc-gestion.jpg)
// ============================================================================
async function buildSvcGestion() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-gestion.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.36, saturation: 1.2 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070912" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="#0E1530" stop-opacity="0.90"/>
      </linearGradient>
      <filter id="sh4" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad4)"/>

    <!-- Marco Dashboard Principal -->
    <g filter="url(#sh4)">
      <rect x="40" y="36" width="820" height="602" rx="24" fill="#101422" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1.5"/>
      <rect x="40" y="36" width="820" height="64" rx="24" fill="#171C30"/>
      <circle cx="74" cy="68" r="7" fill="#EF4444"/>
      <circle cx="96" cy="68" r="7" fill="#F59E0B"/>
      <circle cx="118" cy="68" r="7" fill="#22C55E"/>
      ${renderLine(fBold, 'Panel de Gestión y Control Operativo · ERP a Medida', 148, 74, 15, '#FFFFFF', 0.3)}
      <rect x="684" y="52" width="152" height="32" rx="8" fill="#22C55E" fill-opacity="0.2"/>
      <circle cx="702" cy="68" r="5" fill="#4ADE80"/>
      ${renderLine(fBold, 'ARCA CONECTADO', 714, 73, 11.5, '#4ADE80')}

      <!-- 3 KPIs Superiores -->
      <rect x="68" y="122" width="244" height="118" rx="18" fill="#171D33" stroke="#0F33FF" stroke-opacity="0.5" stroke-width="1.5"/>
      ${renderLine(fBold, 'CAJA Y VENTAS HOY', 90, 152, 12, '#9CA3AF', 1)}
      ${renderLine(fBlack, '$2.480.500', 90, 194, 30, '#FFFFFF', -0.5)}
      ${renderLine(fBold, '+34% vs. semana anterior', 90, 222, 12.5, '#4ADE80')}

      <rect x="328" y="122" width="244" height="118" rx="18" fill="#171D33" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1.5"/>
      ${renderLine(fBold, 'STOCK SINCRONIZADO', 350, 152, 12, '#9CA3AF', 1)}
      ${renderLine(fBlack, '1.420 ítems', 350, 194, 30, '#FFFFFF', -0.5)}
      ${renderLine(fBold, '3 alertas de reposición hoy', 350, 222, 12.5, '#FFF498')}

      <rect x="588" y="122" width="244" height="118" rx="18" fill="#0F33FF"/>
      ${renderLine(fBold, 'FACTURACIÓN AFIP/ARCA', 610, 152, 12, '#FFF498', 1)}
      ${renderLine(fBlack, '100% Auto', 610, 194, 30, '#FFFFFF', -0.5)}
      ${renderLine(fBold, 'CAE emitido en 2 segundos', 610, 222, 12.5, '#E0E7FF')}

      <!-- Módulo Izquierdo: Control de Stock y Depósito -->
      <rect x="68" y="260" width="430" height="350" rx="18" fill="#151A2E" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1.5"/>
      ${renderLine(fBold, 'CONTROL DE STOCK Y SUCURSALES EN VIVO', 92, 294, 13, '#FFF498', 0.8)}

      <rect x="88" y="314" width="390" height="58" rx="12" fill="#1D243E"/>
      ${renderLine(fBold, 'Kit Industrial Automatización Pro', 106, 339, 14, '#FFFFFF')}
      ${renderLine(fReg, 'Depósito Central: 48 u. · Tienda Online: Activo', 106, 359, 12, '#9CA3AF')}
      <rect x="394" y="328" width="68" height="28" rx="8" fill="#22C55E" fill-opacity="0.2"/>
      ${renderCentered(fBold, 'OK', 428, 347, 12, '#4ADE80')}

      <rect x="88" y="384" width="390" height="58" rx="12" fill="#1D243E" stroke="#F59E0B" stroke-opacity="0.5" stroke-width="1"/>
      ${renderLine(fBold, 'Insumo Crítico Modelo B-400', 106, 409, 14, '#FFFFFF')}
      ${renderLine(fReg, 'Quedan 4 unidades · Orden a proveedor', 106, 429, 12, '#FCD34D')}
      <rect x="366" y="398" width="96" height="28" rx="8" fill="#F59E0B" fill-opacity="0.25"/>
      ${renderCentered(fBold, 'REPONER', 414, 417, 11.5, '#FCD34D')}

      <rect x="88" y="454" width="390" height="58" rx="12" fill="#1D243E"/>
      ${renderLine(fBold, 'Servicio Mantenimiento Mensual', 106, 479, 14, '#FFFFFF')}
      ${renderLine(fReg, '86 abonos activos · Débito automático al día', 106, 499, 12, '#9CA3AF')}
      <rect x="394" y="468" width="68" height="28" rx="8" fill="#0F33FF" fill-opacity="0.35"/>
      ${renderCentered(fBold, 'AL DÍA', 428, 487, 11.5, '#93C5FD')}

      ${checkIcon(92, 578, '#60A5FA', 1)}
      ${renderLine(fBold, 'Acceso desde celular o PC · Permisos por empleado', 112, 584, 13, '#60A5FA')}

      <!-- Módulo Derecho: Agenda de Turnos y Cuentas Corrientes -->
      <rect x="518" y="260" width="314" height="350" rx="18" fill="#151A2E" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1.5"/>
      ${renderLine(fBold, 'TURNOS Y COBRANZAS', 542, 294, 13, '#FFF498', 0.8)}

      <rect x="538" y="314" width="274" height="78" rx="12" fill="#1D243E"/>
      ${renderLine(fBold, '10:30 · Entrega Pedido #4092', 554, 340, 13.5, '#FFFFFF')}
      ${renderLine(fReg, 'Factura A-0004-00018920 emitida', 554, 360, 12, '#4ADE80')}
      ${renderLine(fReg, 'Comprobante enviado por WhatsApp', 554, 378, 11.5, '#9CA3AF')}

      <rect x="538" y="404" width="274" height="78" rx="12" fill="#1D243E"/>
      ${renderLine(fBold, '12:00 · Control de Caja Diaria', 554, 430, 13.5, '#FFFFFF')}
      ${renderLine(fReg, 'Efectivo, Transferencias y MP', 554, 450, 12, '#93C5FD')}
      ${renderLine(fReg, 'Conciliación bancaria lista', 554, 468, 11.5, '#9CA3AF')}

      <rect x="538" y="498" width="274" height="90" rx="14" fill="#0F33FF" fill-opacity="0.22" stroke="#0F33FF" stroke-width="1.5"/>
      ${renderLine(fBold, 'Hecho 100% a tu medida', 556, 530, 15, '#FFFFFF')}
      ${renderLine(fReg, 'Sin pagar licencias en dólares', 556, 552, 12.5, '#E0E7FF')}
      ${renderLine(fReg, 'por funciones que no usás.', 556, 570, 12.5, '#FFF498')}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-gestion.jpg'));
  console.log('✓ svc-gestion.jpg');
}

// ============================================================================
// 5. SERVICIO INTEGRACIONES (svc-integraciones.jpg)
// ============================================================================
async function buildSvcIntegraciones() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-integraciones.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.38, saturation: 1.25 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad5" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070913" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#0B132C" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="sh5" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad5)"/>

    <line x1="210" y1="150" x2="450" y2="330" stroke="#0F33FF" stroke-width="3.5"/>
    <line x1="690" y1="150" x2="450" y2="330" stroke="#0F33FF" stroke-width="3.5"/>
    <line x1="210" y1="510" x2="450" y2="330" stroke="#0F33FF" stroke-width="3.5"/>
    <line x1="690" y1="510" x2="450" y2="330" stroke="#0F33FF" stroke-width="3.5"/>
    <circle cx="330" cy="240" r="6" fill="#FFF498"/>
    <circle cx="570" cy="240" r="6" fill="#FFF498"/>
    <circle cx="330" cy="420" r="6" fill="#FFF498"/>
    <circle cx="570" cy="420" r="6" fill="#FFF498"/>

    <!-- NODO CENTRAL: Soluweb API Core -->
    <g filter="url(#sh5)">
      <circle cx="450" cy="330" r="98" fill="#0F33FF" stroke="#FFF498" stroke-width="3"/>
      ${renderCentered(fBlack, 'SOLUWEB', 450, 316, 22, '#FFFFFF', 1)}
      ${renderCentered(fBold, 'API HUB', 450, 344, 18, '#FFF498', 2)}
      ${renderCentered(fReg, 'Tiempo real', 450, 368, 13, '#E0E7FF')}
    </g>

    <!-- Satélite 1: Mercado Pago & Bancos -->
    <g filter="url(#sh5)">
      <rect x="54" y="76" width="310" height="124" rx="20" fill="#14192D" stroke="#38BDF8" stroke-width="2"/>
      ${pill(76, 96, 'PAGOS & COBRANZAS', '#0284C7', '#FFFFFF', 11, 12, 5, 8)}
      ${renderLine(fBlack, 'Mercado Pago & Bancos', 76, 150, 19, '#FFFFFF')}
      ${renderLine(fReg, 'Cobro acreditado · Concilia solo', 76, 176, 13.5, '#93C5FD')}
    </g>

    <!-- Satélite 2: Tienda Nube / WooCommerce -->
    <g filter="url(#sh5)">
      <rect x="536" y="76" width="310" height="124" rx="20" fill="#14192D" stroke="#A855F7" stroke-width="2"/>
      ${pill(558, 96, 'E-COMMERCE', '#7E22CE', '#FFFFFF', 11, 12, 5, 8)}
      ${renderLine(fBlack, 'Tienda Nube & Web', 558, 150, 19, '#FFFFFF')}
      ${renderLine(fReg, 'Sincroniza pedidos, precios y stock', 558, 176, 13.5, '#D8B4FE')}
    </g>

    <!-- Satélite 3: WhatsApp Business API -->
    <g filter="url(#sh5)">
      <rect x="54" y="450" width="310" height="124" rx="20" fill="#14192D" stroke="#22C55E" stroke-width="2"/>
      ${pill(76, 470, 'COMUNICACIÓN', '#15803D', '#FFFFFF', 11, 12, 5, 8)}
      ${renderLine(fBlack, 'WhatsApp Cloud API', 76, 524, 19, '#FFFFFF')}
      ${renderLine(fReg, 'Notificaciones, alertas y chatbots', 76, 550, 13.5, '#86EFAC')}
    </g>

    <!-- Satélite 4: ERP / Google Workspace / ARCA -->
    <g filter="url(#sh5)">
      <rect x="536" y="450" width="310" height="124" rx="20" fill="#14192D" stroke="#FFF498" stroke-width="2"/>
      ${pill(558, 470, 'ADMINISTRACIÓN', '#CA8A04', '#FFFFFF', 11, 12, 5, 8)}
      ${renderLine(fBlack, 'ERP, Sheets & ARCA', 558, 524, 19, '#FFFFFF')}
      ${renderLine(fReg, 'Facturación y reportes sin doble carga', 558, 550, 13.5, '#FEF08A')}
    </g>

    <rect x="180" y="602" width="540" height="44" rx="22" fill="#181E36" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1"/>
    ${renderCentered(fBold, 'Tus herramientas actuales hablando entre sí, sin copiar y pegar.', 450, 629, 14.5, '#FFFFFF')}
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-integraciones.jpg'));
  console.log('✓ svc-integraciones.jpg');
}

// ============================================================================
// 6. SERVICIO WEB Y E-COMMERCE (svc-web.jpg)
// ============================================================================
async function buildSvcWeb() {
  const w = 900;
  const h = 675;
  const bg = await sharp(join(backupDir, 'svc-web.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.38, saturation: 1.2 })
    .blur(2)
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad6" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#080A14" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#0E1738" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="sh6" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgGrad6)"/>

    <!-- Ventana de Navegador Web -->
    <g filter="url(#sh6)">
      <rect x="44" y="44" width="660" height="490" rx="22" fill="#111524" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.5"/>
      <rect x="44" y="44" width="660" height="54" rx="22" fill="#192036"/>
      <circle cx="76" cy="71" r="6" fill="#EF4444"/>
      <circle cx="96" cy="71" r="6" fill="#F59E0B"/>
      <circle cx="116" cy="71" r="6" fill="#22C55E"/>
      <rect x="148" y="56" width="380" height="30" rx="8" fill="#0D111D"/>
      <circle cx="166" cy="71" r="5" fill="#22C55E"/>
      ${renderLine(fBold, 'https://tutiendaonline.com.ar · Conectada a IA', 178, 76, 12, '#93C5FD')}

      <!-- Hero interno de la tienda/landing -->
      <rect x="70" y="122" width="366" height="26" rx="6" fill="#0F33FF" fill-opacity="0.25"/>
      ${renderLine(fBold, 'LANDING PAGE & E-COMMERCE DE ALTA CONVERSIÓN', 82, 139, 10.5, '#93C5FD', 0.8)}
      ${renderLine(fBlack, 'Diseñada para convertir', 70, 184, 28, '#FFFFFF', -0.5)}
      ${renderLine(fBlack, 'visitas en ventas reales', 70, 218, 28, '#FFF498', -0.5)}
      ${renderLine(fReg, 'Velocidad instantánea, pasarela de pago integrada,', 70, 252, 14, '#D4D4D8')}
      ${renderLine(fReg, 'catálogo sincronizado y captura automática en tu CRM.', 70, 274, 14, '#D4D4D8')}

      <rect x="70" y="302" width="210" height="48" rx="24" fill="#0F33FF"/>
      ${renderCentered(fBold, 'COMPRAR AHORA', 175, 331, 13.5, '#FFFFFF', 0.5)}

      <!-- Tarjetas de producto simuladas -->
      <rect x="70" y="376" width="190" height="130" rx="14" fill="#182038" stroke="#FFFFFF" stroke-opacity="0.08"/>
      ${renderLine(fBold, 'Checkout en 1 clic', 90, 412, 14, '#FFFFFF')}
      ${renderLine(fReg, 'Mercado Pago / Tarjetas', 90, 434, 12, '#9CA3AF')}
      ${renderLine(fBlack, '+48% Ventas', 90, 476, 18, '#4ADE80')}

      <rect x="278" y="376" width="190" height="130" rx="14" fill="#182038" stroke="#FFFFFF" stroke-opacity="0.08"/>
      ${renderLine(fBold, 'SEO & Google Ads', 298, 412, 14, '#FFFFFF')}
      ${renderLine(fReg, 'Carga en < 0.8 segundos', 298, 434, 12, '#9CA3AF')}
      ${renderLine(fBlack, '99/100 Speed', 298, 476, 18, '#60A5FA')}
    </g>

    <!-- Widget Flotante de Asistente IA integrado en la web -->
    <g filter="url(#sh6)">
      <rect x="504" y="210" width="352" height="396" rx="24" fill="#151B30" stroke="#0F33FF" stroke-width="2.5"/>
      <rect x="504" y="210" width="352" height="64" rx="24" fill="#0F33FF"/>
      <circle cx="534" cy="242" r="8" fill="#4ADE80"/>
      ${renderLine(fBold, 'Asistente Web IA Activo', 552, 240, 15.5, '#FFFFFF')}
      ${renderLine(fReg, 'Convierte visitantes indecisos 24/7', 552, 260, 12, '#FFF498')}

      <rect x="526" y="294" width="280" height="58" rx="14" fill="#1E2746"/>
      ${renderLine(fReg, '¿Hacen envíos a todo el país y', 544, 319, 13.5, '#FFFFFF')}
      ${renderLine(fReg, 'tienen factura A?', 544, 339, 13.5, '#FFFFFF')}

      <rect x="550" y="366" width="284" height="86" rx="14" fill="#0F33FF"/>
      ${renderLine(fBold, '¡Sí! Despachamos hoy mismo y', 568, 392, 13.5, '#FFFFFF')}
      ${renderLine(fBold, 'el sistema emite Factura A en', 568, 412, 13.5, '#FFFFFF')}
      ${renderLine(fBold, 'automático al pagar.', 568, 432, 13.5, '#FFF498')}

      <rect x="526" y="472" width="308" height="108" rx="16" fill="#132A24" stroke="#22C55E" stroke-width="1.5"/>
      ${checkIcon(546, 500, '#4ADE80', 1)}
      ${renderLine(fBold, 'COMPRA REALIZADA · $245.000', 566, 504, 14, '#4ADE80')}
      ${renderLine(fReg, '• Cliente guardado en CRM', 546, 528, 12.5, '#E0E7FF')}
      ${renderLine(fReg, '• Stock descontado y envío generado', 546, 550, 12.5, '#E0E7FF')}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'svc-web.jpg'));
  console.log('✓ svc-web.jpg');
}

// ============================================================================
// 7. HERO PRINCIPAL (hero.jpg)
// ============================================================================
async function buildHeroVisual() {
  const w = 1280;
  const h = 800;
  const bg = await sharp(join(backupDir, 'hero.jpg'))
    .resize(w, h, { fit: 'cover' })
    .modulate({ brightness: 0.52, saturation: 1.25 })
    .toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070912" stop-opacity="0.72"/>
        <stop offset="50%" stop-color="#090D1E" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#070912" stop-opacity="0.80"/>
      </linearGradient>
      <filter id="shHero" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.68"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#heroGrad)"/>

    <path d="M 430 220 L 640 400 L 860 210" fill="none" stroke="#0F33FF" stroke-width="3" stroke-dasharray="8 6"/>
    <path d="M 410 560 L 640 400 L 880 560" fill="none" stroke="#FFF498" stroke-width="2.5" stroke-dasharray="8 6"/>

    <!-- Tarjeta 1 (Arriba Izquierda): WhatsApp IA Respondiendo en Vivo -->
    <g filter="url(#shHero)">
      <rect x="56" y="64" width="460" height="230" rx="24" fill="#101624" fill-opacity="0.95" stroke="#22C55E" stroke-width="2"/>
      <circle cx="94" cy="104" r="14" fill="#22C55E"/>
      ${checkIcon(88, 104, '#070912', 0.9)}
      ${renderLine(fBold, 'WHATSAPP IA · RESPUESTA EN 2 SEG', 120, 110, 14, '#4ADE80', 0.8)}
      <rect x="80" y="132" width="340" height="44" rx="12" fill="#1D283A"/>
      ${renderLine(fReg, 'Cliente: "Hola! ¿Precio y stock del servicio?"', 98, 159, 14.5, '#F3F4F6')}
      <rect x="108" y="188" width="388" height="82" rx="14" fill="#0F33FF"/>
      ${renderLine(fBold, 'Agente IA: "¡Hola! Sí, tenemos cupo disponible.', 126, 216, 14.5, '#FFFFFF')}
      ${renderLine(fBold, 'Te agendé llamada mañana 10:30 hs en CRM"', 126, 242, 14, '#FFF498')}
      ${doubleCheck(464, 250, '#FFF498')}
    </g>

    <!-- Tarjeta 2 (Arriba Derecha): CRM & Ventas Cerradas -->
    <g filter="url(#shHero)">
      <rect x="740" y="64" width="484" height="215" rx="24" fill="#101624" fill-opacity="0.95" stroke="#0F33FF" stroke-width="2"/>
      ${pill(768, 88, 'CRM & EMBUDO COMERCIAL', '#0F33FF', '#FFFFFF', 12, 14, 6, 8)}
      ${renderLine(fBlack, '+42% Conversión de Ventas', 768, 152, 26, '#FFFFFF', -0.5)}
      ${renderLine(fReg, 'Seguimiento automático a presupuestos abiertos', 768, 182, 15, '#9CA3AF')}
      <rect x="768" y="202" width="420" height="52" rx="12" fill="#182238"/>
      ${checkIcon(786, 228, '#FFF498', 1)}
      ${renderLine(fBold, '18 Leads calificados hoy   ·   $3.850.000 en cierre', 808, 234, 14, '#FFF498')}
    </g>

    <!-- Centro: Badge Núcleo Soluweb -->
    <g filter="url(#shHero)">
      <rect x="470" y="336" width="340" height="118" rx="28" fill="#0F33FF" stroke="#FFF498" stroke-width="2.5"/>
      ${renderCentered(fBlack, 'TU NEGOCIO 24/7', 640, 388, 26, '#FFFFFF', 1)}
      ${renderCentered(fBold, 'IA + Automatización + CRM + ERP', 640, 422, 15.5, '#FFF498', 0.5)}
    </g>

    <!-- Tarjeta 3 (Abajo Izquierda): Automatización Facturación y Stock -->
    <g filter="url(#shHero)">
      <rect x="56" y="490" width="470" height="240" rx="24" fill="#101624" fill-opacity="0.95" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
      ${pill(84, 516, 'ERP & FACTURACIÓN AUTOMÁTICA', '#1E293B', '#FFF498', 12, 14, 6, 8)}
      <rect x="84" y="562" width="414" height="62" rx="14" fill="#172036"/>
      ${checkIcon(100, 584, '#4ADE80', 1)}
      ${renderLine(fBold, 'Pago Mercado Pago acreditado ($280.000)', 122, 588, 14.5, '#4ADE80')}
      ${renderLine(fReg, 'Factura Electrónica ARCA enviada al cliente en 3 seg', 122, 610, 13, '#D4D4D8')}
      <rect x="84" y="638" width="414" height="62" rx="14" fill="#172036"/>
      ${checkIcon(100, 660, '#60A5FA', 1)}
      ${renderLine(fBold, 'Stock descontado en Depósito y Tienda Web', 122, 664, 14.5, '#60A5FA')}
      ${renderLine(fReg, 'Reporte diario enviado al WhatsApp del dueño', 122, 686, 13, '#D4D4D8')}
    </g>

    <!-- Tarjeta 4 (Abajo Derecha): Testimonio / Mensaje de Cliente Realista -->
    <g filter="url(#shHero)">
      <rect x="700" y="490" width="524" height="240" rx="24" fill="#121A24" fill-opacity="0.96" stroke="#FFF498" stroke-width="2"/>
      <circle cx="744" cy="540" r="22" fill="#0F33FF"/>
      ${renderCentered(fBlack, 'MG', 744, 547, 16, '#FFFFFF')}
      ${renderLine(fBold, 'Martín Gómez · Dueño de Distribuidora', 780, 534, 16, '#FFFFFF')}
      ${renderLine(fReg, 'Mensaje de WhatsApp · Hace 12 min', 780, 556, 13, '#4ADE80')}

      <rect x="728" y="578" width="468" height="122" rx="18" fill="#1E2C3A"/>
      ${renderLine(fBold, '“Cristian! El agente de IA cerró 4 ventas ayer', 750, 610, 15.5, '#FFFFFF')}
      ${renderLine(fBold, 'a la noche mientras estábamos cerrados.', 750, 634, 15.5, '#FFFFFF')}
      ${renderLine(fBold, 'Nos ahorra más de 3 horas de planillas por día.”', 750, 658, 15.5, '#FFF498')}
      ${renderLine(fReg, '10:14', 1124, 684, 12, '#9CA3AF')}
      ${doubleCheck(1158, 679, '#38BDF8')}
    </g>
  </svg>`;

  await sharp(bg)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(join(imgDir, 'hero.jpg'));
  console.log('✓ hero.jpg');
}

await buildSvcIA();
await buildSvcAutomatizacion();
await buildSvcCRM();
await buildSvcGestion();
await buildSvcIntegraciones();
await buildSvcWeb();
await buildHeroVisual();
console.log('Visuales actualizados sin glifos faltantes.');
