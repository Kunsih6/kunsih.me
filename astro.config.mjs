// @ts-check
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// Keep in sync with `src/i18n/ui.ts`.
const defaultLocale = 'en'
const locales = ['en', 'es']

// https://astro.build/config
export default defineConfig({
  site: 'https://kunsih.me',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale,
    locales,
    routing: {
      // English lives at `/`, Spanish at `/es/`.
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: {
          en: 'en',
          es: 'es',
        },
      },
      // The 404 page must not be indexed.
      filter: page => !page.includes('/404'),
    }),
  ],
})
