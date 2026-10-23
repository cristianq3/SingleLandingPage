# Soluweb — IA, Automatización, CRM y Sistemas de Gestión

Sitio oficial de **[soluweb.com.ar](https://soluweb.com.ar)** desarrollado en **Astro 5 + Tailwind CSS v4** y desplegado en **Firebase Hosting**.

## Estructura del Proyecto

- `src/data/site.ts`: Datos centralizados (contacto, WhatsApp, servicios, soluciones por rubro, proceso, FAQs).
- `src/pages/index.astro`: Landing page principal.
- `src/pages/marca.astro`: Manual de marca interactivo (`/marca`) con descarga de logos e isotipos en SVG y PNG.
- `src/components/`: Componentes modulares (`Header.astro`, `Hero.astro`, `Contact.astro`, `Footer.astro`).
- `src/assets/img/`: Ilustraciones 3D de marca optimizadas automáticamente por Astro.
- `public/brand/`: Kit completo de identidad visual (logos e isotipos en todas sus variantes).
- `scripts/`: Generadores vectoriales (`build-brand.mjs` y `build-og.mjs`).

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo local
npm run dev

# Regenerar kit de marca y banner OpenGraph
npm run brand

# Compilar para producción (genera carpeta dist/)
npm run build

# Previsualizar build de producción
npm run preview
```

## Despliegue

El repositorio cuenta con integración continua en `.github/workflows/`:
- Al hacer push o merge a `main`, GitHub Actions ejecuta `npm ci && npm run build` y publica `dist/` en Firebase Hosting (`soluweb-la`).
