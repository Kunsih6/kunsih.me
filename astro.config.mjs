// @ts-check
import { rename, rmdir } from 'node:fs/promises'
import sitemap from '@astrojs/sitemap'
import { defineConfig, fontProviders } from 'astro/config'

// Keep in sync with `src/i18n/ui.ts`.
const defaultLocale = 'en'
const locales = ['en', 'es']

/**
 * Cloudflare serves the nearest `404.html`, but Astro writes `es/404/index.html`: move it.
 * @returns {import('astro').AstroIntegration} The integration.
 */
function localeNotFoundPages() {
  return {
    name: 'locale-404-pages',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        for (const locale of locales.filter(l => l !== defaultLocale)) {
          await rename(new URL(`${locale}/404/index.html`, dir), new URL(`${locale}/404.html`, dir))
          await rmdir(new URL(`${locale}/404/`, dir))
        }
      },
    },
  }
}

export default defineConfig({
  site: 'https://kunsih.me',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale,
    locales,
    routing: {
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
      filter: page => !page.includes('/404'),
    }),
    localeNotFoundPages(),
  ],

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
