import type { Messages } from './en'

/** Spanish interface strings. Must have exactly the keys defined in `en.ts`. */
export default {
  seo: {
    title: 'Estuardo Aguirre — Ingeniero de software, frontend y full stack',
    description: 'CV digital de Estuardo Aguirre, ingeniero de software frontend y full stack. Más de 9 años construyendo aplicaciones web y móviles con Vue.js, React y TypeScript.',
    jobTitle: 'Ingeniero de software',
  },
  a11y: {
    skip: 'Saltar al contenido',
    newTab: '(se abre en una pestaña nueva)',
    home: 'Inicio',
  },
  nav: {
    label: 'Secciones',
    experience: 'Trayectoria',
    stack: 'Stack',
    contact: 'Contacto',
  },
  status: {
    available: 'Disponible',
    mode: '— Remoto o híbrido',
  },
  lang: {
    label: 'Idioma',
    switchTo: 'View in English',
  },
  theme: {
    switchToLight: 'Cambiar a modo claro',
    switchToDark: 'Cambiar a modo oscuro',
    light: 'Claro',
    dark: 'Oscuro',
    scan: {
      light: 'Escáner // claro',
      dark: 'Escáner // oscuro',
    },
  },
  date: {
    present: 'Actualidad',
  },
  footer: {
    backToTop: 'Volver arriba',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o se movió.',
    cta: 'Ir al inicio',
  },
} satisfies Messages
