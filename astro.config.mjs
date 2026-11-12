// @ts-check
import sitemap from '@astrojs/sitemap'
import { defineConfig, fontProviders } from 'astro/config'

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

  // Self-hosted at build time by the Astro Fonts API (no request to Google from the visitor).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Unbounded',
      cssVariable: '--font-display',
      weights: [500, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Black', 'Helvetica Neue', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-sans',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Share Tech Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: [
        'ui-monospace',
        'SF Mono',
        'Menlo',
        'monospace',
      ],
    },
  ],
})
