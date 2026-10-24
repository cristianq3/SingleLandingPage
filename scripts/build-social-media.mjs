// Generador de piezas gráficas de Social Media y Lead Magnets para Soluweb
// Uso: node scripts/build-social-media.mjs
import opentype from 'opentype.js';
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const smDir = join(root, 'social-media');

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

// Renderiza una línea con soporte para palabras resaltadas en paralelogramo azul [palabra] o en color amarillo {palabra}
function renderRichLine(font, str, x, y, size, defaultFill = '#FFFFFF', track = -1) {
  // Tokenize by [tag] or {spark}
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

// Envuelve texto largo en líneas automáticas
function wrapParagraph(font, text, maxWidth, size, track = 0) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (textWidth(font, test, size, track) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function renderParagraph(font, text, x, y, maxWidth, size, lineHeight, fill = '#D4D4D8', track = 0) {
  const lines = Array.isArray(text) ? text : wrapParagraph(font, text, maxWidth, size, track);
  let out = '';
  lines.forEach((line, idx) => {
    out += renderRichLine(font, line, x, y + idx * lineHeight, size, fill, track);
  });
  return { svg: out, bottomY: y + lines.length * lineHeight };
}

// Pill / Badge con paralelogramo
function renderBadge(text, x, y, bg = '#0F33FF', fg = '#FFFFFF', size = 22) {
  const w = textWidth(fBold, text, size, 2);
  const padX = 24;
  const h = size + 24;
  const skew = 14;
  const poly = `${x},${y + h} ${x + skew},${y} ${x + w + padX * 2 + skew},${y} ${x + w + padX * 2},${y + h}`;
  return `<polygon points="${poly}" fill="${bg}"/>` + renderLine(fBold, text, x + padX + skew * 0.4, y + size + 5, size, fg, 2);
}

// Tarjeta de cristal (glass card) con check o cruz
function renderBulletCard({ x, y, w, h, iconType = 'check', title, subtitle }) {
  const isBad = iconType === 'cross';
  const accent = isBad ? '#EF4444' : '#0F33FF';
  const badgeBg = isBad ? 'rgba(239,68,68,0.18)' : 'rgba(15,51,255,0.25)';
  let svg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#141418" fill-opacity="0.88" stroke="${accent}" stroke-opacity="0.45" stroke-width="2"/>`;
  svg += `<polygon points="${x},${y + h} ${x + 8},${y} ${x + 14},${y} ${x + 6},${y + h}" fill="${accent}"/>`;
  // Icon circle
  const cx = x + 56;
  const cy = y + h / 2;
  svg += `<circle cx="${cx}" cy="${cy}" r="24" fill="${badgeBg}" stroke="${accent}" stroke-width="2"/>`;
  if (isBad) {
    svg += `<path d="M${cx - 8} ${cy - 8} L${cx + 8} ${cy + 8} M${cx + 8} ${cy - 8} L${cx - 8} ${cy + 8}" stroke="#F87171" stroke-width="3.5" stroke-linecap="round"/>`;
  } else {
    svg += `<path d="M${cx - 9} ${cy} L${cx - 2} ${cy + 7} L${cx + 10} ${cy - 7}" fill="none" stroke="#FFF498" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (subtitle) {
    svg += renderRichLine(fBold, title, x + 100, y + h / 2 - 6, 27, '#FFFFFF', -0.5);
    svg += renderRichLine(fReg, subtitle, x + 100, y + h / 2 + 30, 22, '#A1A1AA', 0);
  } else {
    svg += renderRichLine(fBold, title, x + 100, y + h / 2 + 10, 28, '#FFFFFF', -0.5);
  }
  return svg;
}

// Genera una diapositiva 1080x1350 (4:5) o 1080x1920 (9:16)
async function buildSlide({
  outPath,
  width = 1080,
  height = 1350,
  bgImage,
  bgOpacity = 0.38,
  bgPosition = 'center',
  slideNum,
  totalSlides,
  eyebrow,
  headlineLines = [],
  headlineSize = 66,
  subtext,
  bullets = [],
  ctaBox,
  footerTag = 'soluweb.com.ar',
  swipeText = 'DESLIZÁ →',
}) {
  // Fondo base con imagen 3D oscurecida y degradado
  const bgBuffer = await sharp(join(root, 'src', 'assets', 'img', bgImage))
    .resize(width, height, { fit: 'cover', position: bgPosition })
    .modulate({ brightness: bgOpacity, saturation: 1.15 })
    .toBuffer();

  const logoPng = await sharp(Buffer.from(logoSvg), { density: 220 }).resize({ width: 220 }).png().toBuffer();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0C0C0C" stop-opacity="0.88"/>
      <stop offset="45%" stop-color="#0C0C0C" stop-opacity="0.55"/>
      <stop offset="85%" stop-color="#0C0C0C" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#0C0C0C" stop-opacity="0.98"/>
    </linearGradient>
    <radialGradient id="blueGlow" cx="85%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#0F33FF" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#0F33FF" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#blueGlow)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <!-- Decoración paralelogramo lateral -->
  <polygon points="${width - 140},0 ${width},0 ${width - 90},${height} ${width - 230},${height}" fill="#0F33FF" fill-opacity="0.06"/>
  `;

  // Header: Paginador a la derecha
  if (slideNum && totalSlides) {
    const pillW = 128;
    const pillX = width - 72 - pillW;
    svg += `<rect x="${pillX}" y="62" width="${pillW}" height="48" rx="24" fill="#141418" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>`;
    const numStr = `0${slideNum} / 0${totalSlides}`;
    const nw = textWidth(fBold, numStr, 20, 1);
    svg += renderLine(fBold, numStr, pillX + (pillW - nw) / 2, 93, 20, '#B3BFFF', 1);
  }

  let cursorY = height === 1920 ? 250 : ctaBox && bullets.length > 0 ? 165 : 195;

  // Eyebrow badge
  if (eyebrow) {
    svg += renderBadge(eyebrow.toUpperCase(), 72, cursorY, '#0F33FF', '#FFFFFF', 20);
    cursorY += ctaBox && bullets.length > 0 ? 74 : 88;
  }

  // Headline
  const lineH = Math.round(headlineSize * 1.14);
  for (const line of headlineLines) {
    svg += renderRichLine(fBlack, line, 72, cursorY + headlineSize * 0.8, headlineSize, '#FFFFFF', -1.5);
    cursorY += lineH;
  }

  cursorY += ctaBox && bullets.length > 0 ? 22 : 34;

  // Subtext
  if (subtext) {
    const subSize = ctaBox && bullets.length > 0 ? 26 : 30;
    const subLH = ctaBox && bullets.length > 0 ? 36 : 44;
    const p = renderParagraph(fReg, subtext, 72, cursorY + 22, width - 144, subSize, subLH, '#D4D4D8', 0);
    svg += p.svg;
    cursorY = p.bottomY + (ctaBox && bullets.length > 0 ? 16 : 28);
  }

  // Bullets
  if (bullets.length > 0) {
    const hasSub = bullets.some((b) => b.subtitle);
    const cardH = hasSub ? (ctaBox ? 104 : 120) : ctaBox ? 72 : 96;
    const gap = ctaBox ? 12 : 20;
    for (const b of bullets) {
      svg += renderBulletCard({
        x: 72,
        y: cursorY,
        w: width - 144,
        h: cardH,
        iconType: b.iconType || 'check',
        title: b.title,
        subtitle: b.subtitle,
      });
      cursorY += cardH + gap;
    }
  }

  // CTA Box (Lead Magnet Box)
  if (ctaBox) {
    const boxY = Math.min(Math.max(cursorY + 12, height - 420), height - 355);
    const boxH = 225;
    svg += `<rect x="72" y="${boxY}" width="${width - 144}" height="${boxH}" rx="28" fill="#0F33FF"/>`;
    svg += `<polygon points="${width - 280},${boxY} ${width - 110},${boxY} ${width - 170},${boxY + boxH} ${width - 340},${boxY + boxH}" fill="#FFFFFF" fill-opacity="0.09"/>`;
    svg += renderLine(fBold, ctaBox.kicker.toUpperCase(), 112, boxY + 50, 20, '#FFF498', 2);
    svg += renderRichLine(fBlack, ctaBox.title, 112, boxY + 106, 40, '#FFFFFF', -1);
    svg += renderRichLine(fBold, ctaBox.subtitle, 112, boxY + 152, 23, '#E0E7FF', 0);
    if (ctaBox.button) {
      const bw = textWidth(fBlack, ctaBox.button, 20, 1) + 56;
      svg += `<rect x="112" y="${boxY + 170}" width="${bw}" height="38" rx="19" fill="#0C0C0C"/>`;
      svg += renderLine(fBlack, ctaBox.button, 140, boxY + 196, 20, '#FFF498', 1);
    }
  }

  // Footer bar
  const footY = height - 74;
  svg += `<line x1="72" y1="${footY - 36}" x2="${width - 72}" y2="${footY - 36}" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>`;
  svg += renderLine(fBold, footerTag, 72, footY, 22, '#A1A1AA', 0.5);

  if (swipeText) {
    const cleanSwipe = swipeText.replace(/[→↗★]/g, '').trim();
    const sw = textWidth(fBold, cleanSwipe, 22, 1.5);
    const sx = width - 72 - sw - 28;
    svg += renderLine(fBold, cleanSwipe, sx, footY, 22, '#FFF498', 1.5);
    const ax = width - 72 - 14;
    const ay = footY - 8;
    svg += `<path d="M${ax - 8} ${ay} L${ax + 6} ${ay} M${ax} ${ay - 6} L${ax + 6} ${ay} L${ax} ${ay + 6}" fill="none" stroke="#FFF498" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Progress bar at very bottom
  if (slideNum && totalSlides) {
    const progW = Math.round((width * slideNum) / totalSlides);
    svg += `<rect x="0" y="${height - 10}" width="${width}" height="10" fill="#1F1F24"/>`;
    svg += `<rect x="0" y="${height - 10}" width="${progW}" height="10" fill="#0F33FF"/>`;
  }

  svg += `</svg>`;

  await sharp(bgBuffer)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logoPng, top: 62, left: 72 },
    ])
    .png({ compressionLevel: 8 })
    .toFile(outPath);
}

// ============================================================================
// DEFINICIÓN DE CONTENIDOS: 3 CARRUSELES + 3 POSTS + 3 COVERS DE REELS/STORIES
// ============================================================================

const CAROUSELS = [
  {
    folder: '01-carrusel-whatsapp-ventas',
    title: 'Carrusel 01 — El silencio en WhatsApp mata tus ventas (IA 24/7)',
    keyword: 'IA',
    leadMagnet: 'Demo interactiva + Auditoría gratuita de tu embudo de WhatsApp',
    slides: [
      {
        bgImage: 'svc-ia.jpg',
        eyebrow: 'Realidad PyME · Atención Comercial',
        headlineLines: ['¿Cuántas ventas', 'perdés cuando', 'respondés [tarde]?'],
        headlineSize: 72,
        subtext: 'El 78% de los clientes le compra al primero que le contesta con claridad. Si tardás 2 horas, ya le compraron a tu competencia.',
        swipeText: 'MIRÁ POR QUÉ PASA →',
      },
      {
        bgImage: 'about.jpg',
        eyebrow: 'El Problema Real',
        headlineLines: ['Tu equipo no da', 'abasto con las', '[mismas] preguntas'],
        headlineSize: 64,
        bullets: [
          { iconType: 'cross', title: '“Hola, ¿precio?” a las 11 de la noche', subtitle: 'Nadie responde fuera de horario y al otro día el cliente se enfrió.' },
          { iconType: 'cross', title: 'Vendedores haciendo de recepcionistas', subtitle: 'Pierden 4 horas por día contestando horarios, stock y ubicación.' },
          { iconType: 'cross', title: 'Cero seguimiento a los interesados', subtitle: 'Quedan cientos de chats abiertos sin volver a contactar.' },
        ],
        swipeText: 'EL ERROR COMÚN →',
      },
      {
        bgImage: 'process-bg.jpg',
        eyebrow: 'Lo que ya no sirve',
        headlineLines: ['Los bots con menú', '“Opción 1, Opción 2”', '{espantan} clientes'],
        headlineSize: 62,
        subtext: 'Nadie quiere hablar con un contestador robótico que no entiende audios ni preguntas reales. Eso frustra al usuario y frena la venta.',
        bullets: [
          { iconType: 'check', title: 'La diferencia: Agentes de IA Conversacional', subtitle: 'Entienden contexto, audios e intenciones como tu mejor vendedor.' },
        ],
        swipeText: 'LA SOLUCIÓN SOLUWEB →',
      },
      {
        bgImage: 'hero.jpg',
        eyebrow: 'La Solución Soluweb',
        headlineLines: ['Un Agente de [IA]', 'entrenado con tu', 'propio negocio'],
        headlineSize: 66,
        bullets: [
          { iconType: 'check', title: 'Responde en 3 segundos, 24/7 los 365 días', subtitle: 'Conoce tu catálogo, precios, políticas y disponibilidad real.' },
          { iconType: 'check', title: 'Califica al cliente y agenda turnos solo', subtitle: 'Filtra curiosos y pasa a tu equipo solo las ventas listas para cerrar.' },
          { iconType: 'check', title: 'Conectado a tu CRM y calendario', subtitle: 'Registra cada consulta automáticamente sin tocar una planilla.' },
        ],
        swipeText: 'RESULTADOS REALES →',
      },
      {
        bgImage: 'svc-automatizacion.jpg',
        eyebrow: 'Impacto Directo',
        headlineLines: ['Lo que cambia en', 'tu empresa desde', 'la [semana 1]'],
        headlineSize: 66,
        bullets: [
          { iconType: 'check', title: '+40% de conversión en consultas recibidas', subtitle: 'Atención inmediata cuando el cliente tiene la tarjeta en la mano.' },
          { iconType: 'check', title: '-80% de carga operativa repetitiva', subtitle: 'Tu equipo se enfoca únicamente en negociar y cerrar.' },
          { iconType: 'check', title: 'Implementación llave en mano en 2 semanas', subtitle: 'Nosotros configuramos, entrenamos y medimos todo por vos.' },
        ],
        swipeText: 'PROBÁ UNO AHORA →',
      },
      {
        bgImage: 'og-bg.jpg',
        eyebrow: 'Lead Magnet Gratuito',
        headlineLines: ['¿Querés ver cómo', 'atendería la [IA]', 'a tus clientes?'],
        headlineSize: 66,
        subtext: 'Armamos una prueba personalizada sobre tu rubro y auditamos tu flujo de WhatsApp sin costo.',
        ctaBox: {
          kicker: 'Regalo para dueños de negocio',
          title: 'Comentá la palabra {“IA”}',
          subtitle: 'Y te enviamos por DM una demo en vivo + diagnóstico gratis.',
          button: 'O ESCRIBINOS EN SOLUWEB.COM.AR',
        },
        swipeText: 'GUARDÁ ESTE POST ★',
      },
    ],
  },
  {
    folder: '02-carrusel-caos-excel-crm',
    title: 'Carrusel 02 — Del caos de planillas a un CRM y Sistema que vende solo',
    keyword: 'CRM',
    leadMagnet: 'Plantilla de Embudo Comercial + Diagnóstico gratuito de procesos',
    slides: [
      {
        bgImage: 'svc-crm.jpg',
        eyebrow: 'Gestión Comercial y Operativa',
        headlineLines: ['Tu negocio no', 'tiene un problema', 'de ventas. Tiene [fugas].'],
        headlineSize: 66,
        subtext: 'Invertís en publicidad y entran consultas todos los días, pero a fin de mes no sabés cuántos presupuestos quedaron en la nada.',
        swipeText: 'DETECTÁ LAS FUGAS →',
      },
      {
        bgImage: 'svc-gestion.jpg',
        eyebrow: 'Síntomas de alerta',
        headlineLines: ['3 señales de que', 'Excel te está', '{costando} plata'],
        headlineSize: 66,
        bullets: [
          { iconType: 'cross', title: 'Clientes anotados en cuadernos y WhatsApp', subtitle: 'Si un vendedor falta o cambia el teléfono, perdés todo el historial.' },
          { iconType: 'cross', title: 'Presupuestos enviados sin seguimiento', subtitle: 'El 60% de las ventas se cierran entre el 2.º y 4.º contacto.' },
          { iconType: 'cross', title: 'Doble carga de datos y errores de stock', subtitle: 'Pasás horas copiando datos de la web a la planilla y a facturación.' },
        ],
        swipeText: 'CÓMO SE RESUELVE →',
      },
      {
        bgImage: 'svc-integraciones.jpg',
        eyebrow: 'Orden + Automatización',
        headlineLines: ['Un [CRM] + Sistema', 'donde nada se', 'escapa nunca'],
        headlineSize: 66,
        bullets: [
          { iconType: 'check', title: 'Embudo visual de cada oportunidad', subtitle: 'Sabés en 5 segundos quién pidió precio, quién falta pagar y quién compró.' },
          { iconType: 'check', title: 'Recordatorios y seguimientos automáticos', subtitle: 'El sistema le escribe al cliente o avisa al vendedor en el momento justo.' },
          { iconType: 'check', title: 'Stock, turnos y facturación ARCA/AFIP', subtitle: 'Todo conectado en un solo panel accesible desde el celular o PC.' },
        ],
        swipeText: 'ANTES VS. DESPUÉS →',
      },
      {
        bgImage: 'about.jpg',
        eyebrow: 'Transformación Real',
        headlineLines: ['Pasá de apagar', 'incendios a [dirigir]', 'con métricas reales'],
        headlineSize: 62,
        bullets: [
          { iconType: 'check', title: 'Previsibilidad de caja y ventas mensuales', subtitle: 'Conocé tu tasa de cierre por vendedor, canal y producto.' },
          { iconType: 'check', title: 'Adaptado 100% a la forma en que trabajás', subtitle: 'Implementamos HubSpot, Odoo, Kommo o sistemas propios a medida.' },
          { iconType: 'check', title: 'Capacitación completa a tu equipo', subtitle: 'No te dejamos un software vacío: lo dejamos andando con tu gente.' },
        ],
        swipeText: 'PEDÍ EL RECURSO →',
      },
      {
        bgImage: 'og-bg.jpg',
        eyebrow: 'Recurso Gratuito · Lead Magnet',
        headlineLines: ['Recibí nuestro', 'Mapa de [CRM] y', 'Seguimiento PyME'],
        headlineSize: 66,
        subtext: 'Te compartimos la estructura exacta de etapas y automatizaciones que usamos para duplicar cierres comerciales.',
        ctaBox: {
          kicker: 'Descarga + Diagnóstico sin cargo',
          title: 'Comentá la palabra {“CRM”}',
          subtitle: 'Te lo enviamos por mensaje privado junto a una sesión de revisión.',
          button: 'SOLUWEB.COM.AR · TUCUMÁN Y LATAM',
        },
        swipeText: 'COMPARTILO CON TU SOCIO ↗',
      },
    ],
  },
  {
    folder: '03-carrusel-5-automatizaciones',
    title: 'Carrusel 03 — 5 Automatizaciones que te ahorran 20 horas por semana',
    keyword: 'AUTO',
    leadMagnet: 'Checklist de 15 procesos automatizables para PyMEs + Diagnóstico',
    slides: [
      {
        bgImage: 'svc-automatizacion.jpg',
        eyebrow: 'Productividad & Escala',
        headlineLines: ['5 tareas que hoy', 'hacés a mano y', 'deberían ir [solas]'],
        headlineSize: 68,
        subtext: 'Si vos o tu equipo repiten el mismo clic todos los días, estás pagando sueldos para hacer trabajo de robot.',
        swipeText: 'MIRÁ LAS 5 TAREAS →',
      },
      {
        bgImage: 'svc-ia.jpg',
        eyebrow: 'Automatización #1 y #2',
        headlineLines: ['Captación de leads', 'y [agenda] sin', 'intervención humana'],
        headlineSize: 62,
        bullets: [
          { iconType: 'check', title: '1. De anuncio de Instagram directo al CRM', subtitle: 'Apenas alguien consulta, se crea la ficha y recibe un WhatsApp personalizado.' },
          { iconType: 'check', title: '2. Turnos y reuniones con recordatorio', subtitle: 'Confirmación automática 24 h y 2 h antes para eliminar el ausentismo.' },
        ],
        swipeText: 'SIGUIENTES 2 →',
      },
      {
        bgImage: 'svc-gestion.jpg',
        eyebrow: 'Automatización #3 y #4',
        headlineLines: ['Presupuestos,', 'cobranzas y [stock]', 'en tiempo real'],
        headlineSize: 64,
        bullets: [
          { iconType: 'check', title: '3. Presupuestos en PDF y link de pago al instante', subtitle: 'Generados y enviados automáticamente según lo que pidió el cliente.' },
          { iconType: 'check', title: '4. Sincronización de stock y facturación', subtitle: 'Vendés en tu tienda o local y se descuenta y factura en el acto.' },
        ],
        swipeText: 'LA #5 ES CLAVE →',
      },
      {
        bgImage: 'svc-integraciones.jpg',
        eyebrow: 'Automatización #5',
        headlineLines: ['Reportes en tu', 'WhatsApp cada', '{lunes a las 8 AM}'],
        headlineSize: 66,
        subtext: 'Sin abrir diez planillas. Recibís en tu celular un resumen claro: ventas de la semana, cobranzas pendientes y rendimiento comercial.',
        bullets: [
          { iconType: 'check', title: 'Conectamos todo con n8n, Make e IA', subtitle: 'Tus herramientas actuales pasan a hablar entre sí sin errores.' },
        ],
        swipeText: 'CALCULÁ TU AHORRO →',
      },
      {
        bgImage: 'og-bg.jpg',
        eyebrow: 'Checklist Gratuito · Lead Magnet',
        headlineLines: ['¿Querés saber qué', 'automatizar [primero]', 'en tu negocio?'],
        headlineSize: 62,
        subtext: 'Te regalamos el Checklist de 15 Automatizaciones de Alto Retorno + 1 sesión de diagnóstico sin cargo.',
        ctaBox: {
          kicker: 'Enviamos el acceso por DM',
          title: 'Comentá la palabra {“AUTO”}',
          subtitle: 'Y descubrí cuántas horas y costos podés ahorrar este mismo mes.',
          button: 'SOLUWEB.COM.AR · PILOTO AUTOMÁTICO',
        },
        swipeText: 'GUARDALO PARA IMPLEMENTAR ★',
      },
    ],
  },
];

const SINGLE_POSTS = [
  {
    file: 'post-01-transformacion-soluweb.png',
    bgImage: 'hero.jpg',
    eyebrow: 'Nueva Era · Soluweb 2026',
    headlineLines: ['Ya no alcanza', 'con tener una web.', 'Tu negocio necesita [IA].'],
    headlineSize: 64,
    subtext: 'Evolucionamos: combinamos desarrollo a medida con Inteligencia Artificial, CRM y automatización para que tu empresa funcione en piloto automático.',
    bullets: [
      { iconType: 'check', title: 'Agentes de IA para WhatsApp e Instagram 24/7' },
      { iconType: 'check', title: 'CRM, embudos de venta y sistemas de gestión ERP' },
      { iconType: 'check', title: 'Automatizaciones con n8n, Make e integraciones API' },
    ],
    ctaBox: {
      kicker: 'Diagnóstico inicial 100% bonificado',
      title: 'Comentá {“PILOTO”} o entrá a la web',
      subtitle: 'Auditamos tus procesos y te mostramos tu plan de automatización.',
      button: 'WWW.SOLUWEB.COM.AR',
    },
    swipeText: 'LINK EN BIO ↗',
  },
  {
    file: 'post-02-radiografia-sistema-gestion.png',
    bgImage: 'svc-gestion.jpg',
    eyebrow: 'Sistemas de Gestión a Medida',
    headlineLines: ['Todo tu negocio', 'en [un solo panel],', 'sin planillas sueltas'],
    headlineSize: 64,
    bullets: [
      { iconType: 'check', title: 'Control de stock, compras y proveedores', subtitle: 'Alertas de reposición y costos actualizados al instante.' },
      { iconType: 'check', title: 'Facturación electrónica ARCA/AFIP y cuentas corrientes', subtitle: 'Cobros con Mercado Pago, transferencias y recibos automáticos.' },
      { iconType: 'check', title: 'Turnos, órdenes de trabajo y reportes con IA', subtitle: 'Diseñado exactamente para las reglas de tu empresa.' },
    ],
    ctaBox: {
      kicker: 'Demo sin cargo para tu rubro',
      title: 'Comentá {“SISTEMA”} en este post',
      subtitle: 'Te mostramos cómo centralizar tu operación paso a paso.',
      button: 'SOLUWEB.COM.AR',
    },
    swipeText: 'GUARDÁ ESTE POST ★',
  },
  {
    file: 'post-03-auditoria-gratis-lead-magnet.png',
    bgImage: 'about.jpg',
    eyebrow: 'Cupos Limitados de Esta Semana',
    headlineLines: ['Auditamos los', 'procesos de tu', 'empresa [sin cargo]'],
    headlineSize: 68,
    subtext: 'En una llamada de 25 minutos analizamos dónde se te escapan ventas o tiempo y te entregamos una hoja de ruta accionable.',
    bullets: [
      { iconType: 'check', title: 'Detectamos cuellos de botella en atención y ventas' },
      { iconType: 'check', title: 'Definimos qué automatizar primero por impacto/costo' },
      { iconType: 'check', title: 'Te llevás el plan claro, trabajemos juntos o no' },
    ],
    ctaBox: {
      kicker: 'Sin compromiso · 100% práctico',
      title: 'Comentá {“DIAGNOSTICO”}',
      subtitle: 'Y te enviamos el link directo por mensaje privado para elegir horario.',
      button: 'AGENDA ABIERTA EN SOLUWEB.COM.AR',
    },
    swipeText: 'ESCRIBINOS AHORA →',
  },
];

const REELS_COVERS = [
  {
    file: 'reel-01-cover-bot-whatsapp.png',
    bgImage: 'svc-ia.jpg',
    eyebrow: 'Reel #01 · Caso Práctico',
    headlineLines: ['Cómo responder', '100 WhatsApps', 'mientras [dormís]'],
    headlineSize: 78,
    subtext: 'Así funciona un Agente de IA conectado a tu catálogo y calendario en tiempo real.',
    bullets: [
      { iconType: 'check', title: 'Entiende audios y textos naturales', subtitle: 'Califica al cliente y cierra el turno o la venta en minutos.' },
      { iconType: 'check', title: 'Cero respuestas robóticas de menú', subtitle: 'Entrenado con la voz y las reglas de tu negocio.' },
    ],
    ctaBox: {
      kicker: 'Lead Magnet en comentarios',
      title: 'Comentá {“IA”} para ver la demo',
      subtitle: 'Te mandamos el acceso directo por privado.',
      button: 'SOLUWEB.COM.AR',
    },
  },
  {
    file: 'reel-02-cover-crm-embudo.png',
    bgImage: 'svc-crm.jpg',
    eyebrow: 'Reel #02 · Ventas B2B & PyMEs',
    headlineLines: ['Por qué entran', 'consultas pero', '{no cerrás} ventas'],
    headlineSize: 78,
    subtext: 'El secreto no es gastar más en anuncios: es automatizar el seguimiento en un CRM.',
    bullets: [
      { iconType: 'check', title: 'El 80% de los vendedores abandona al 1.er intento' },
      { iconType: 'check', title: 'Un CRM automatizado triplica tu tasa de respuesta' },
    ],
    ctaBox: {
      kicker: 'Plantilla gratuita por DM',
      title: 'Comentá {“CRM”} y te la enviamos',
      subtitle: 'Incluye el mapa de etapas comerciales listo para aplicar.',
      button: 'SOLUWEB.COM.AR',
    },
  },
  {
    file: 'reel-03-cover-automatizacion-n8n.png',
    bgImage: 'svc-automatizacion.jpg',
    eyebrow: 'Reel #03 · Detrás de Escena',
    headlineLines: ['Ahorrá [20 horas]', 'por semana con', 'un solo flujo'],
    headlineSize: 80,
    subtext: 'Conectamos tu formulario, WhatsApp, CRM y facturación para que trabajen solos.',
    bullets: [
      { iconType: 'check', title: 'Sin copiar y pegar entre planillas' },
      { iconType: 'check', title: 'Alertas en vivo a tu teléfono ante cada venta' },
    ],
    ctaBox: {
      kicker: 'Checklist de 15 automatizaciones',
      title: 'Comentá {“AUTO”} y recibilo gratis',
      subtitle: 'Descubrí todo lo que podés delegarle a la tecnología.',
      button: 'SOLUWEB.COM.AR',
    },
  },
];

// Ejecución
mkdirSync(smDir, { recursive: true });

for (const c of CAROUSELS) {
  const dir = join(smDir, c.folder);
  mkdirSync(dir, { recursive: true });
  const total = c.slides.length;
  for (let i = 0; i < total; i++) {
    const s = c.slides[i];
    const outPath = join(dir, `slide-0${i + 1}.png`);
    await buildSlide({
      outPath,
      width: 1080,
      height: 1350,
      slideNum: i + 1,
      totalSlides: total,
      ...s,
    });
  }
  console.log(`✓ ${c.folder} (${total} slides generados)`);
}

const postsDir = join(smDir, '04-posts-individuales');
mkdirSync(postsDir, { recursive: true });
for (const p of SINGLE_POSTS) {
  await buildSlide({
    outPath: join(postsDir, p.file),
    width: 1080,
    height: 1350,
    ...p,
  });
  console.log(`✓ 04-posts-individuales/${p.file}`);
}

const reelsDir = join(smDir, '05-reels-y-stories');
mkdirSync(reelsDir, { recursive: true });
for (const r of REELS_COVERS) {
  await buildSlide({
    outPath: join(reelsDir, r.file),
    width: 1080,
    height: 1920,
    swipeText: '@SOLUWEB · LINK EN BIO',
    ...r,
  });
  console.log(`✓ 05-reels-y-stories/${r.file}`);
}

console.log('Todas las piezas de Social Media fueron generadas con éxito.');
