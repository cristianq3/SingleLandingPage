// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://soluweb.com.ar',
  integrations: [sitemap({ filter: (page) => !page.includes('/marca') })],
  vite: { plugins: [tailwindcss()] },
});
