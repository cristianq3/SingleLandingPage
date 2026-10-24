// Datos centrales del sitio. Editá acá contactos, servicios y textos.
export const SITE = {
  name: 'Soluweb',
  url: 'https://soluweb.com.ar',
  title: 'Soluweb | IA, automatización, CRM y sistemas de gestión para tu negocio',
  description:
    'Incorporamos inteligencia artificial, automatizaciones, CRM y sistemas de gestión a medida para que tu PyME venda más y trabaje menos. Desde Tucumán para toda Argentina y LATAM.',
  email: 'soluweb@gmail.com',
  whatsapp: '543855861884',
  whatsappDisplay: '+54 9 385 586-1884',
  location: 'Tucumán, Argentina',
  social: {
    instagram: '', // completar: https://instagram.com/...
    linkedin: '', // completar: https://linkedin.com/company/...
    facebook: '',
  },
};

export const waLink = (text = 'Hola Soluweb! Quiero automatizar mi negocio.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Resultados', href: '/#resultados' },
  { label: 'Soluciones', href: '/#soluciones' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'FAQ', href: '/#faq' },
];

export type Service = {
  id: string;
  title: string;
  short: string;
  needTag: string;
  impactMetric: string;
  description: string;
  bullets: string[];
  image: string;
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: 'ia',
    title: 'IA para tu negocio',
    short: 'Chatbots, agentes y asistentes 24/7',
    needTag: 'Evitá perder ventas fuera de horario',
    impactMetric: 'Responde en 2 seg · +64% cierres',
    description:
      'Asistentes inteligentes que escuchan audios, cotizan, califican y agendan turnos 24/7 en WhatsApp, Instagram y tu web, entrenados con los datos reales de tu empresa.',
    bullets: [
      'Agentes de IA para WhatsApp e Instagram (texto y audio)',
      'Asistentes internos entrenados con tu catálogo y precios',
      'Calificación automática de leads y agenda en Google Calendar',
      'Derivación inteligente a vendedor humano cuando está listo',
    ],
    image: 'svc-ia',
    featured: true,
  },
  {
    id: 'automatizacion',
    title: 'Automatización de procesos',
    short: 'n8n · Make · Zapier · Cero carga manual',
    needTag: 'Chau a copiar y pegar entre planillas',
    impactMetric: '-20 hs/semana de tareas mecánicas',
    description:
      'Eliminamos las tareas repetitivas: cuando entra una venta o pago, el sistema emite la factura ARCA, descuenta stock y envía el comprobante por WhatsApp solo.',
    bullets: [
      'Flujos automáticos con n8n, Make y APIs oficiales',
      'Facturación electrónica ARCA/AFIP y envío de comprobantes',
      'Seguimiento automático de cobranzas y vencimientos',
      'Alertas y reportes diarios en el WhatsApp del dueño',
    ],
    image: 'svc-automatizacion',
    featured: true,
  },
  {
    id: 'crm',
    title: 'CRM y gestión de clientes',
    short: 'Embudo comercial y seguimiento activo',
    needTag: 'Que ningún presupuesto quede olvidado',
    impactMetric: '+42% conversión en seguimiento',
    description:
      'Centralizamos todas las consultas de WhatsApp, Instagram y web en un embudo visual para que tu equipo comercial sepa a quién llamar hoy y cuánto dinero hay en juego.',
    bullets: [
      'Implementación de CRM a medida, Kommo, HubSpot u Odoo',
      'Recordatorios automáticos de presupuestos sin responder',
      'Historial unificado de chats, llamadas y cotizaciones',
      'Métricas de cierre por vendedor y canal en tiempo real',
    ],
    image: 'svc-crm',
  },
  {
    id: 'gestion',
    title: 'Sistemas de gestión a medida',
    short: 'ERP · Stock · Turnos · Facturación ARCA',
    needTag: 'Todo tu negocio en un solo panel',
    impactMetric: '100% adaptado a tu operación',
    description:
      'Desarrollamos el software exacto que tu empresa necesita: control de stock multi-sucursal, caja diaria, cuentas corrientes, turnos y facturación electrónica.',
    bullets: [
      'ERP web y móvil sin pagar licencias en dólares por usuario',
      'Control de stock, depósito, pedidos y alertas de reposición',
      'Facturación electrónica integrada con ARCA / AFIP',
      'Permisos por rol para empleados, encargados y socios',
    ],
    image: 'svc-gestion',
  },
  {
    id: 'integraciones',
    title: 'Integraciones y APIs',
    short: 'Tus herramientas hablando entre sí',
    needTag: 'Uní tus sistemas sin cambiar todo',
    impactMetric: 'Sincronización en tiempo real',
    description:
      'Conectamos las plataformas que ya usás para que funcionen como un único ecosistema: tienda online, Mercado Pago, bancos, WhatsApp, CRM y tu ERP.',
    bullets: [
      'Integración con Mercado Pago, Tienda Nube y WooCommerce',
      'Conciliación automática de pagos y transferencias',
      'Conexión con WhatsApp Cloud API y Google Workspace',
      'Webhooks y APIs privadas de alta disponibilidad',
    ],
    image: 'svc-integraciones',
  },
  {
    id: 'web',
    title: 'Webs y tiendas online con IA',
    short: 'Diseñadas para convertir visitas en clientes',
    needTag: 'Tu vidriera vendiendo las 24 horas',
    impactMetric: 'Carga < 0.8s + Asistente IA activo',
    description:
      'Sitios corporativos, landing pages y e-commerce de alto impacto visual, conectados desde el día uno a tu asistente de IA, pasarela de pagos y CRM.',
    bullets: [
      'Landing pages y e-commerce optimizados para conversión',
      'Widget de asistente IA integrado para cerrar ventas en vivo',
      'Catálogo y stock sincronizado con tu sistema central',
      'SEO técnico, velocidad extrema y analítica de anuncios',
    ],
    image: 'svc-web',
  },
];

export const TOOLS = [
  'OpenAI',
  'Claude',
  'Gemini',
  'n8n',
  'Make',
  'Zapier',
  'WhatsApp Business API',
  'HubSpot',
  'Odoo',
  'Kommo',
  'Google Workspace',
  'Mercado Pago',
  'Tienda Nube',
  'Firebase',
  'Supabase',
  'Notion',
];

export const PAINS = [
  {
    beforeBadge: 'Domingo 23:30 hs',
    title: 'Respondés tarde o repetís los mismos mensajes todo el día',
    fix: 'Un Agente de IA contesta audio y texto en 2 segundos, cotiza y agenda turnos 24/7.',
  },
  {
    beforeBadge: 'Caos operativo',
    title: 'Tus datos están dispersos en 10 planillas de Excel y cuadernos',
    fix: 'Un panel central donde ventas, stock, caja y facturación ARCA se actualizan solos.',
  },
  {
    beforeBadge: 'Ventas perdidas',
    title: 'Envían presupuestos y nadie les hace seguimiento a tiempo',
    fix: 'Un CRM inteligente que avisa a tu equipo y reactiva clientes indecisos automáticamente.',
  },
  {
    beforeBadge: 'Doble trabajo',
    title: 'Tu equipo carga el mismo pedido en 3 lugares distintos',
    fix: 'Automatizaciones que conectan WhatsApp, Mercado Pago, stock y facturación sin errores.',
  },
];

export const INDUSTRIES = [
  {
    name: 'Comercios y distribuidoras',
    items: ['Pedidos y cotizaciones 24/7 por WhatsApp IA', 'Stock sincronizado entre depósito, local y web', 'Facturación ARCA y envío de comprobante automático'],
  },
  {
    name: 'Salud, clínicas y estética',
    items: ['Agenda de turnos por WhatsApp con IA', 'Recordatorios 24h antes (-80% ausentismo)', 'Historia clínica y caja diaria centralizada'],
  },
  {
    name: 'Inmobiliarias y desarrolladoras',
    items: ['Calificación automática de leads por presupuesto y zona', 'CRM de propiedades con alertas a vendedores', 'Envío instantáneo de fichas y agendado de visitas'],
  },
  {
    name: 'Educación e institutos',
    items: ['Inscripciones y cobro de matrículas automatizado', 'Asistente IA para responder dudas de alumnos 24/7', 'Control de cuotas, vencimientos y certificados'],
  },
  {
    name: 'Estudios y servicios profesionales',
    items: ['Recepción y lectura automática de comprobantes', 'Seguimiento de presupuestos y abonos mensuales', 'Reportes automáticos por WhatsApp a tus clientes'],
  },
  {
    name: 'Gastronomía y franquicias',
    items: ['Toma de pedidos y reservas sin demoras', 'Control de stock crítico de insumos y proveedores', 'Reactivación automática de clientes frecuentes'],
  },
];

export const PROCESS = [
  { step: '01', title: 'Diagnóstico', text: 'Relevamos tu operación en 20 minutos y detectamos los cuellos de botella. Sin costo.' },
  { step: '02', title: 'Arquitectura', text: 'Diseñamos el flujo exacto (IA, CRM o sistema) con plazos cerrados y retorno medible.' },
  { step: '03', title: 'Implementación', text: 'Construimos, entrenamos la IA con tus datos reales y conectamos tus canales.' },
  { step: '04', title: 'Capacitación', text: 'Dejamos a tu equipo dominando la herramienta con tutoriales y soporte directo.' },
  { step: '05', title: 'Escala continua', text: 'Medimos conversiones y horas ahorradas para seguir automatizando nuevas áreas.' },
];

export const BENEFITS = [
  { value: '2 seg', label: 'Tiempo de respuesta en WhatsApp 24/7' },
  { value: '-80%', label: 'Tareas manuales repetitivas en tu equipo*' },
  { value: '+64%', label: 'Más cierres al no enfriarse las consultas' },
  { value: '100%', label: 'A medida de la realidad de tu negocio' },
];

export const FAQS = [
  {
    q: '¿Necesito saber de tecnología para usar las soluciones?',
    a: 'No. Diseñamos interfaces súper claras y dejamos todo funcionando en el WhatsApp y celular que ya usás todos los días. Además capacitamos a tu equipo paso a paso.',
  },
  {
    q: '¿Cuánto tarda una implementación?',
    a: 'Un agente de IA para WhatsApp o flujo de automatización está operativo en 1 a 2 semanas. Un sistema de gestión ERP a medida se entrega por etapas funcionales entre 3 y 8 semanas.',
  },
  {
    q: '¿Tengo que cambiar las herramientas que ya uso?',
    a: 'No necesariamente. Conectamos y potenciamos lo que ya usás (planillas de Google, Mercado Pago, Tienda Nube, ARCA/AFIP, WhatsApp) y solo reemplazamos lo que te está frenando.',
  },
  {
    q: '¿El chatbot de IA suena como un robot frío?',
    a: 'Todo lo contrario: entrenamos a tu Agente IA con el tono de tu marca, tus precios reales, entiende audios de WhatsApp y sabe cuándo derivar la charla a un vendedor humano.',
  },
  {
    q: '¿Mis datos y los de mis clientes están seguros?',
    a: 'Sí. Utilizamos infraestructura oficial en la nube con encriptación, backups automáticos diarios y permisos por rol. Toda la base de datos e historial es 100% propiedad de tu empresa.',
  },
  {
    q: '¿Cómo empezamos y cómo se presupuesta?',
    a: 'Empezamos con una sesión de diagnóstico gratuita por WhatsApp o Meet. Te entregamos una propuesta cerrada por proyecto (sin sorpresas ni licencias ocultas en dólares).',
  },
];
