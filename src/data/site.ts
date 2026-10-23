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
  { label: 'Soluciones', href: '/#soluciones' },
  { label: 'Proceso', href: '/#proceso' },
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'FAQ', href: '/#faq' },
];

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  image: string;
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: 'ia',
    title: 'IA para tu negocio',
    short: 'Chatbots, agentes y asistentes',
    description:
      'Asistentes inteligentes que atienden, venden y responden 24/7 en WhatsApp, Instagram y tu web, entrenados con la información de tu empresa.',
    bullets: [
      'Chatbots y agentes de IA para WhatsApp e Instagram',
      'Asistentes internos entrenados con tus documentos',
      'Calificación automática de leads y turnos',
      'Análisis de datos y reportes con IA',
    ],
    image: 'svc-ia',
    featured: true,
  },
  {
    id: 'automatizacion',
    title: 'Automatización de procesos',
    short: 'n8n · Make · Zapier',
    description:
      'Eliminamos las tareas repetitivas: cargas manuales, mails, seguimientos y reportes pasan a funcionar solos, sin errores.',
    bullets: [
      'Flujos con n8n, Make y Zapier',
      'Seguimiento automático de clientes y cobranzas',
      'Reportes y alertas en tiempo real',
      'Integración entre planillas, mail y sistemas',
    ],
    image: 'svc-automatizacion',
    featured: true,
  },
  {
    id: 'crm',
    title: 'CRM y gestión de clientes',
    short: 'Ventas ordenadas y medibles',
    description:
      'Implementamos y personalizamos tu CRM para que ningún cliente se pierda: embudo de ventas, historial, tareas y métricas en un solo lugar.',
    bullets: [
      'Implementación de HubSpot, Odoo, Kommo y más',
      'Embudos de venta y pipelines a medida',
      'Migración de contactos y datos',
      'Capacitación a tu equipo comercial',
    ],
    image: 'svc-crm',
  },
  {
    id: 'gestion',
    title: 'Sistemas de gestión a medida',
    short: 'ERP · stock · turnos · facturación',
    description:
      'Desarrollamos el sistema que tu negocio necesita: control de stock, turnos, facturación electrónica, sueldos y paneles de control.',
    bullets: [
      'ERP y sistemas administrativos',
      'Gestión de stock, pedidos y proveedores',
      'Turnos y agenda online',
      'Facturación electrónica (ARCA/AFIP)',
    ],
    image: 'svc-gestion',
  },
  {
    id: 'integraciones',
    title: 'Integraciones y APIs',
    short: 'Todo conectado',
    description:
      'Conectamos tus herramientas entre sí: tienda online, CRM, Mercado Pago, Google Workspace, WhatsApp y sistemas propios.',
    bullets: [
      'APIs a medida y webhooks',
      'Mercado Pago, Tienda Nube, WooCommerce',
      'Google Workspace y Microsoft 365',
      'WhatsApp Business API',
    ],
    image: 'svc-integraciones',
  },
  {
    id: 'web',
    title: 'Webs y tiendas online',
    short: 'Nuestra base, ahora inteligente',
    description:
      'Seguimos haciendo sitios, landing pages y e-commerce, ahora conectados a tu CRM y tus automatizaciones desde el primer día.',
    bullets: [
      'Sitios web y landing pages que convierten',
      'Tiendas online integradas',
      'Diseño UX/UI',
      'SEO y analítica',
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
  { title: 'Respondés los mismos mensajes todo el día', fix: 'Un asistente de IA contesta, califica y agenda por vos.' },
  { title: 'Los datos están en mil planillas', fix: 'Un sistema central con toda la info, accesible desde cualquier lugar.' },
  { title: 'Se te escapan clientes sin seguimiento', fix: 'Un CRM que avisa, recuerda y hace el seguimiento automático.' },
  { title: 'Cargás lo mismo en varios sistemas', fix: 'Integraciones que mueven los datos solas, sin errores.' },
];

export const INDUSTRIES = [
  {
    name: 'Comercios y e-commerce',
    items: ['Atención de consultas 24/7 por WhatsApp', 'Stock sincronizado entre local y tienda online', 'Recuperación de carritos abandonados'],
  },
  {
    name: 'Salud y consultorios',
    items: ['Turnos online con recordatorios automáticos', 'Fichas de pacientes centralizadas', 'Confirmaciones y reprogramaciones por WhatsApp'],
  },
  {
    name: 'Inmobiliarias',
    items: ['Calificación de interesados con IA', 'CRM de propiedades y clientes', 'Envío automático de fichas y visitas'],
  },
  {
    name: 'Educación',
    items: ['Inscripciones y cobros automatizados', 'Asistente para alumnos con IA', 'Seguimiento de cuotas y asistencia'],
  },
  {
    name: 'Servicios profesionales',
    items: ['Presupuestos y contratos automáticos', 'Gestión de clientes y tareas', 'Facturación y cobranza recurrente'],
  },
  {
    name: 'Gastronomía',
    items: ['Pedidos y reservas por WhatsApp', 'Control de stock e insumos', 'Fidelización y campañas automáticas'],
  },
];

export const PROCESS = [
  { step: '01', title: 'Diagnóstico', text: 'Analizamos tus procesos y detectamos dónde se pierde tiempo y dinero. Sin costo.' },
  { step: '02', title: 'Propuesta', text: 'Diseñamos la solución y te mostramos el plan, los plazos y el retorno esperado.' },
  { step: '03', title: 'Implementación', text: 'Construimos, integramos y probamos con tus datos reales, por etapas.' },
  { step: '04', title: 'Capacitación', text: 'Tu equipo aprende a usarlo. Documentación clara y acompañamiento.' },
  { step: '05', title: 'Mejora continua', text: 'Medimos resultados, ajustamos y escalamos lo que funciona.' },
];

export const BENEFITS = [
  { value: '24/7', label: 'Atención automática a tus clientes' },
  { value: '-80%', label: 'de tareas manuales repetitivas*' },
  { value: '1', label: 'Lugar para todos tus datos' },
  { value: '100%', label: 'Soluciones a medida, sin plantillas' },
];

export const FAQS = [
  {
    q: '¿Necesito saber de tecnología para usar las soluciones?',
    a: 'No. Diseñamos todo para que sea simple de usar y capacitamos a tu equipo. Vos te enfocás en tu negocio.',
  },
  {
    q: '¿Cuánto tarda una implementación?',
    a: 'Una automatización o chatbot puede estar funcionando en 1 a 3 semanas. Un sistema de gestión a medida, entre 1 y 3 meses según su alcance. Trabajamos por etapas para que veas resultados rápido.',
  },
  {
    q: '¿Tengo que cambiar las herramientas que ya uso?',
    a: 'No necesariamente. Muchas veces conectamos y automatizamos lo que ya tenés (planillas, tu tienda, tu sistema de facturación). Solo proponemos cambios si suman.',
  },
  {
    q: '¿La IA reemplaza a mi equipo?',
    a: 'La IA se encarga de lo repetitivo para que tu equipo se dedique a lo que genera valor: vender, atender casos complejos y crecer.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Trabajamos con proveedores líderes, accesos con permisos, copias de seguridad y buenas prácticas de privacidad. Los datos son siempre tuyos.',
  },
  {
    q: '¿Cómo se cobra?',
    a: 'Por proyecto con precio cerrado y, si lo necesitás, un abono mensual de soporte y mejoras. El diagnóstico inicial es sin cargo.',
  },
];
