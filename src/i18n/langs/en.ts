/**
 * English interface strings, grouped by area. This file defines the message
 * shape: every other language file must provide exactly the same keys.
 */
const en = {
  seo: {
    title: 'Estuardo Aguirre — Software Engineer, Full Stack Developer',
    description: 'Digital CV of Estuardo Aguirre, software engineer and full stack developer. More than 9 years building web and mobile applications with Vue.js, React and TypeScript.',
    jobTitle: 'Software Engineer',
  },
  a11y: {
    skip: 'Skip to content',
    newTab: '(opens in a new tab)',
    home: 'Home',
  },
  nav: {
    label: 'Sections',
    experience: 'Experience',
    stack: 'Stack',
    contact: 'Contact',
  },
  status: {
    available: 'Available',
    mode: '— Remote or hybrid',
  },
  lang: {
    label: 'Language',
    switchTo: 'Ver en español',
  },
  theme: {
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    light: 'Light',
    dark: 'Dark',
    // Label on the scanner line that sweeps the screen when the theme changes.
    scan: {
      light: 'Scan // light',
      dark: 'Scan // dark',
    },
  },
  date: {
    present: 'Present',
  },
  footer: {
    backToTop: 'Back to top',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or was moved.',
    cta: 'Go to the home page',
  },
}

export type Messages = typeof en

export default en
