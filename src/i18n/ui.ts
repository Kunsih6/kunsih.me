/**
 * Locales and interface strings. Keep `locales` in sync with `astro.config.mjs`.
 */
export const languages = {
  en: 'English',
  es: 'Español',
} as const

export type Lang = keyof typeof languages

export const defaultLang: Lang = 'en'

export const locales = Object.keys(languages) as Lang[]

/** Values for `og:locale` (Open Graph uses `ll_CC`). */
export const ogLocales: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_LA',
}

export const ui = {
  en: {
    'seo.title': 'Estuardo Aguirre — Software Engineer, Frontend & Full Stack',
    'seo.description': 'Placeholder description: digital CV of a frontend and full stack software engineer. Experience, stack and contact.',
    'seo.jobTitle': 'Software Engineer',

    'a11y.skip': 'Skip to content',
    'a11y.newTab': '(opens in a new tab)',
    'a11y.home': 'Home',

    'nav.label': 'Sections',
    'nav.experience': 'Experience',
    'nav.stack': 'Stack',
    'nav.contact': 'Contact',

    'status.available': 'Available',
    'status.mode': '— Remote or hybrid',

    'lang.label': 'Language',
    'lang.switchTo': 'Ver en español',

    'theme.switchToLight': 'Switch to light mode',
    'theme.switchToDark': 'Switch to dark mode',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'date.present': 'Present',

    'footer.backToTop': 'Back to top',

    'notFound.title': 'Page not found',
    'notFound.description': 'The page you are looking for does not exist or was moved.',
    'notFound.cta': 'Go to the home page',
  },
  es: {
    'seo.title': 'Estuardo Aguirre — Ingeniero de software, frontend y full stack',
    'seo.description': 'Descripción de ejemplo: CV digital de un ingeniero de software frontend y full stack. Trayectoria, stack y contacto.',
    'seo.jobTitle': 'Ingeniero de software',

    'a11y.skip': 'Saltar al contenido',
    'a11y.newTab': '(se abre en una pestaña nueva)',
    'a11y.home': 'Inicio',

    'nav.label': 'Secciones',
    'nav.experience': 'Trayectoria',
    'nav.stack': 'Stack',
    'nav.contact': 'Contacto',

    'status.available': 'Disponible',
    'status.mode': '— Remoto o híbrido',

    'lang.label': 'Idioma',
    'lang.switchTo': 'View in English',

    'theme.switchToLight': 'Cambiar a modo claro',
    'theme.switchToDark': 'Cambiar a modo oscuro',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',

    'date.present': 'Actualidad',

    'footer.backToTop': 'Volver arriba',

    'notFound.title': 'Página no encontrada',
    'notFound.description': 'La página que buscas no existe o se movió.',
    'notFound.cta': 'Ir al inicio',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type UIKey = keyof (typeof ui)[typeof defaultLang]
