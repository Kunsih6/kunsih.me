/**
 * Site identity shared by every locale. Values that still need real data are
 * marked with TODO.
 */
export const site = {
  brand: 'KUNSIH',
  author: 'Estuardo Aguirre',
  // TODO: replace with the public contact address.
  email: 'hello@example.com',
  location: {
    city: 'Quetzaltenango',
    country: 'Guatemala',
    countryCode: 'GT',
    coordinates: '14.83° N 91.52° W',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/kunsih6',
    github: 'https://github.com/Kunsih6',
  },
  // Default Open Graph / Twitter image, served from `public/`.
  ogImage: {
    src: '/og/default.png',
    width: 1200,
    height: 630,
  },
  themeColor: {
    dark: '#0b0c0e',
    light: '#ebe9e4',
  },
  // First year shown in the footer range.
  since: 2017,
} as const
