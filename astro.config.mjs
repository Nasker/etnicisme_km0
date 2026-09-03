// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the canonical production domain before deploying.
// The QR code should point at `${site}/museu/`.
export default defineConfig({
  site: 'https://museu-etnicisme.pages.dev',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
