import type { Lang } from '@/i18n/ui'
import type { YearMonth } from '@/utils/date'

/*
 * Page content per locale, from the design. Dates are `YYYY-MM`: the site formats
 * them and computes the durations per locale (src/utils/date.ts).
 */

export interface Fact {
  label: string
  value: string
}

export interface Role {
  id: string
  company: string
  title: string
  start: YearMonth
  /** `null` while the role is ongoing. */
  end: YearMonth | null
  summary?: string
  team: string
  highlights: string[]
  stack: string[]
}

export interface StackGroup {
  title: string
  items: string[]
}

export interface CV {
  hero: {
    updated: string
    headline: string
    intro: string
    primaryCta: string
    secondaryCta: string
  }
  profile: {
    eyebrow: string
    statement: string
    /** Trailing part of the statement, highlighted with the accent color. */
    statementAccent: string
    facts: Fact[]
  }
  experience: {
    eyebrow: string
    title: string
    intro: string
    teamLabel: string
    roles: Role[]
  }
  stack: {
    eyebrow: string
    title: string
    groups: StackGroup[]
  }
  contact: {
    eyebrow: string
    title: string
    mailLabel: string
    /** Address shown and linked in the contact section. */
    email: string
    pitch: string
    emailCta: string
    linkedinCta: string
  }
}

const en: CV = {
  hero: {
    updated: 'Updated 2026.11',
    headline: 'Estuardo Aguirre. Software engineer, full stack developer.',
    intro: 'More than 9 years building web and mobile applications with Vue.js, Nuxt, React, Next.js and TypeScript.',
    primaryCta: 'Get in touch',
    secondaryCta: 'Connect on LinkedIn',
  },
  profile: {
    eyebrow: 'Profile',
    statement: 'Code that just works has never been enough for me: I want to understand how it works and',
    statementAccent: 'why it matters to the business.',
    facts: [
      { label: 'Based in', value: 'Quetzaltenango, Guatemala' },
      { label: 'Languages', value: 'Native Spanish, professional English' },
      { label: 'Education', value: 'Universidad Rafael Landívar, 2018' },
    ],
  },
  experience: {
    eyebrow: 'Experience',
    title: 'More than 9 years on teams across Latin America, the United States and Europe.',
    intro: 'Select a role to see what I did and with which stack.',
    teamLabel: 'Team',
    roles: [
      {
        id: 'comparaonline',
        company: 'ComparaOnline',
        title: 'Frontend Engineer',
        start: '2023-01',
        end: null,
        summary: 'Platform to quote and compare insurance and financial products in Latin America: Chile, Colombia and Brazil.',
        team: 'Teams of 3 to 8 people from different Latin American countries.',
        highlights: [
          'Designed the architecture of a Next.js vehicle-insurance platform for three country domains, with shared views that load complete flows by configuration.',
          'Proposed per-domain release builds and put them into practice after discussing them with the team; built the offer and purchase steps of the funnel.',
          'Cut page load times by more than 60%, from a couple of seconds to under 800 ms, with code splitting and lazy loading.',
          'Brought customer-experience cases from about 100 to about 4 per week by fixing their root cause, without a large refactor.',
          'Co-developed, with about 6 other engineers, CUI (a component library documented in Storybook, which I also maintained) and a form-validation library, used across most of the company\'s React projects.',
          'About 10 months on an internal support team: about 8 tickets per week across payment, CRM, messaging and finance microservices (Yuno, HubSpot, Twilio, NetSuite).',
          'Built event-driven communication between at least three microservices with Apache Kafka and collaborated on the Yuno payment integration.',
        ],
        stack: [
          'TypeScript',
          'Vue.js 3',
          'React',
          'Next.js',
          'Node.js',
          'NestJS',
          'Apache Kafka',
          'PostgreSQL',
        ],
      },
      {
        id: 'turn-technologies',
        company: 'Turn Technologies',
        title: 'Frontend Engineer',
        start: '2021-08',
        end: '2022-10',
        summary: 'Background screening platform built for high-volume hiring.',
        team: 'About 15 people, mostly in Mexico; Product Manager in the Netherlands and Head of Engineering in the United States.',
        highlights: [
          'Built Next.js forms for job applicants to submit their personal and employment information, and a Next.js dashboard used by recruiters.',
          'Built and shipped new modules for a React Native app (iOS and Android) during its build-out phase, testing across browsers and devices.',
          'Gave and received code reviews in a team working across time zones.',
        ],
        stack: [
          'TypeScript',
          'Next.js',
          'React Native',
          'Redux',
          'Tailwind CSS',
        ],
      },
      {
        id: 'platform-purple',
        company: 'Platform Purple',
        title: 'Software Developer',
        start: '2021-03',
        end: '2021-08',
        team: '6 people based in the United States, with one member in Tunisia.',
        highlights: [
          'Co-planned and carried out a refactor of the mobile app to make it easier to scale, separating responsibilities along the way.',
          'Developed hybrid mobile applications with Quasar for code reuse across web and native platforms.',
          'Built cross-platform desktop applications with Electron for Windows, macOS and Linux.',
        ],
        stack: ['Quasar', 'Electron'],
      },
      {
        id: 'fundap',
        company: 'Fundap',
        title: 'Software Developer',
        start: '2020-10',
        end: '2021-03',
        team: '6 people.',
        highlights: [
          'Rebuilt a public landing page with Nuxt, replacing an implementation that did not follow Nuxt conventions and making it easier to maintain.',
          'Modernized a 2008-era legacy application by refactoring core logic and implementing JSON-based HTTP handling.',
          'Worked on .NET backend services and Razor views, and integrated a module with Salesforce.',
        ],
        stack: ['Nuxt', '.NET', 'Razor', 'Salesforce'],
      },
      {
        id: 'pixela',
        company: 'Pixela',
        title: 'Frontend Developer',
        start: '2017-11',
        end: '2020-10',
        summary: 'My first job, and the one where I learned the most.',
        team: '6 people.',
        highlights: [
          'Main developer bringing landing page and dashboard designs to life with Vue.js and Nuxt: responsive and accessible, with semantic HTML, ARIA and keyboard navigation checked with Lighthouse.',
          'Developed marketing landing pages with Prismic CMS that non-technical stakeholders could update.',
          'Built internal dashboards and admin tools with Vuetify, integrating REST APIs with backend developers.',
          'Contributed across the full lifecycle, from requirements and estimation to testing and deployment.',
        ],
        stack: [
          'Vue.js',
          'Nuxt',
          'Vuetify',
          'Tailwind CSS',
          'Prismic CMS',
          'Firebase',
        ],
      },
    ],
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Frontend first, backend when it\'s needed.',
    groups: [
      {
        title: 'Frontend',
        items: [
          'TypeScript',
          'Vue.js 3 · Nuxt',
          'React · Next.js',
          'Tailwind CSS',
          'Storybook',
        ],
      },
      {
        title: 'Backend and data',
        items: [
          'Node.js',
          'NestJS · Express',
          'PostgreSQL · TypeORM',
          'Apache Kafka',
          'REST APIs',
        ],
      },
      {
        title: 'Architecture',
        items: [
          'Microservices',
          'Hexagonal architecture',
          'Event-driven architecture',
          'Configuration-driven micro-frontends',
        ],
      },
      {
        title: 'Quality and delivery',
        items: [
          'Jest · Vitest',
          'Lighthouse',
          'Accessibility: semantic HTML and ARIA',
          'Jenkins (CI/CD) · Docker',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'Next step',
    title: 'Contact',
    mailLabel: 'Write to me',
    email: 'contact@kunsih.me',
    pitch: 'I\'m looking to keep growing in frontend, full stack or software engineering roles, and toward technical leadership or product management. Remote or hybrid.',
    emailCta: 'Send an email',
    linkedinCta: 'Connect on LinkedIn',
  },
}

const es: CV = {
  hero: {
    updated: 'Actualizado 2026.11',
    headline: 'Estuardo Aguirre. Ingeniero de software, desarrollador full stack.',
    intro: 'Más de 9 años construyendo aplicaciones web y móviles con Vue.js, Nuxt, React, Next.js y TypeScript.',
    primaryCta: 'Contactar',
    secondaryCta: 'Conectar en LinkedIn',
  },
  profile: {
    eyebrow: 'Perfil',
    statement: 'Nunca me ha bastado con que el código funcione: quiero entender cómo funciona y',
    statementAccent: 'por qué le importa al negocio.',
    facts: [
      { label: 'Ubicación', value: 'Quetzaltenango, Guatemala' },
      { label: 'Idiomas', value: 'Español nativo, inglés profesional' },
      { label: 'Formación', value: 'Universidad Rafael Landívar, 2018' },
    ],
  },
  experience: {
    eyebrow: 'Trayectoria',
    title: 'Más de 9 años en equipos de Latinoamérica, Estados Unidos y Europa.',
    intro: 'Selecciona un rol para ver qué hice y con qué stack.',
    teamLabel: 'Equipo',
    roles: [
      {
        id: 'comparaonline',
        company: 'ComparaOnline',
        title: 'Frontend Engineer',
        start: '2023-01',
        end: null,
        summary: 'Plataforma para cotizar y comparar seguros y productos financieros en Latinoamérica: Chile, Colombia y Brasil.',
        team: 'Equipos de 3 a 8 personas de distintos países de Latinoamérica.',
        highlights: [
          'Diseñé la arquitectura de una plataforma de seguros vehiculares en Next.js para tres dominios de país, con vistas comunes que cargan flujos completos según configuración.',
          'Propuse los builds por dominio y los puse en práctica después de discutirlos con el equipo; construí los pasos de ofertas y compra del funnel.',
          'Reduje los tiempos de carga más de un 60 %, de un par de segundos a menos de 800 ms, con code splitting y lazy loading.',
          'Bajé los casos de atención al cliente de unos 100 a unos 4 por semana al corregir su causa raíz, sin un refactor grande.',
          'Co-desarrollé, junto a unos 6 ingenieros, CUI (librería de componentes documentada en Storybook, que también mantuve) y una librería de validación de formularios, usadas en la mayoría de los proyectos React de la empresa.',
          'Unos 10 meses en un equipo de soporte interno: unos 8 tickets por semana en microservicios de pagos, CRM, mensajería y finanzas (Yuno, HubSpot, Twilio, NetSuite).',
          'Construí comunicación por eventos entre al menos tres microservicios con Apache Kafka y colaboré en la integración de pagos con Yuno.',
        ],
        stack: [
          'TypeScript',
          'Vue.js 3',
          'React',
          'Next.js',
          'Node.js',
          'NestJS',
          'Apache Kafka',
          'PostgreSQL',
        ],
      },
      {
        id: 'turn-technologies',
        company: 'Turn Technologies',
        title: 'Frontend Engineer',
        start: '2021-08',
        end: '2022-10',
        summary: 'Plataforma de verificación de antecedentes para contratación a gran escala.',
        team: 'Unas 15 personas, principalmente en México; Product Manager en Países Bajos y Head of Engineering en Estados Unidos.',
        highlights: [
          'Desarrollé formularios en Next.js para que los candidatos ingresaran su información personal y laboral, y un dashboard en Next.js usado por reclutadores.',
          'Construí nuevos módulos para una app en React Native (iOS y Android) durante su etapa de construcción, con pruebas en distintos navegadores y dispositivos.',
          'Participé en revisiones de código, dando y recibiendo feedback, en un equipo con distintas zonas horarias.',
        ],
        stack: [
          'TypeScript',
          'Next.js',
          'React Native',
          'Redux',
          'Tailwind CSS',
        ],
      },
      {
        id: 'platform-purple',
        company: 'Platform Purple',
        title: 'Software Developer',
        start: '2021-03',
        end: '2021-08',
        team: '6 personas en Estados Unidos, con un integrante en Túnez.',
        highlights: [
          'Planifiqué con el equipo y ejecuté un refactor de la app móvil para hacerla más fácil de escalar, separando responsabilidades.',
          'Desarrollé aplicaciones móviles híbridas con Quasar para reutilizar código entre web y plataformas nativas.',
          'Construí aplicaciones de escritorio multiplataforma con Electron para Windows, macOS y Linux.',
        ],
        stack: ['Quasar', 'Electron'],
      },
      {
        id: 'fundap',
        company: 'Fundap',
        title: 'Software Developer',
        start: '2020-10',
        end: '2021-03',
        team: '6 personas.',
        highlights: [
          'Reconstruí una landing pública con Nuxt, en reemplazo de una implementación que no seguía las convenciones de Nuxt, para hacerla más fácil de mantener.',
          'Modernicé una aplicación heredada de 2008: refactoricé su lógica central e implementé el manejo de HTTP con JSON.',
          'Trabajé en servicios de backend en .NET y vistas Razor, e integré un módulo con Salesforce.',
        ],
        stack: ['Nuxt', '.NET', 'Razor', 'Salesforce'],
      },
      {
        id: 'pixela',
        company: 'Pixela',
        title: 'Frontend Developer',
        start: '2017-11',
        end: '2020-10',
        summary: 'Mi primer trabajo, y donde más aprendí.',
        team: '6 personas.',
        highlights: [
          'Desarrollador principal al llevar diseños de landings y dashboards a Vue.js y Nuxt: responsivos y accesibles, con HTML semántico, ARIA y navegación por teclado revisados con Lighthouse.',
          'Desarrollé landings de marketing con Prismic CMS que personas no técnicas podían actualizar.',
          'Construí dashboards internos y herramientas de administración con Vuetify, integrando APIs REST junto a desarrolladores backend.',
          'Participé en todo el ciclo, desde requisitos y estimación hasta pruebas y despliegue.',
        ],
        stack: [
          'Vue.js',
          'Nuxt',
          'Vuetify',
          'Tailwind CSS',
          'Prismic CMS',
          'Firebase',
        ],
      },
    ],
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Frontend primero, backend cuando hace falta.',
    groups: [
      {
        title: 'Frontend',
        items: [
          'TypeScript',
          'Vue.js 3 · Nuxt',
          'React · Next.js',
          'Tailwind CSS',
          'Storybook',
        ],
      },
      {
        title: 'Backend y datos',
        items: [
          'Node.js',
          'NestJS · Express',
          'PostgreSQL · TypeORM',
          'Apache Kafka',
          'APIs REST',
        ],
      },
      {
        title: 'Arquitectura',
        items: [
          'Microservicios',
          'Arquitectura hexagonal',
          'Orientada a eventos',
          'Micro-frontends por configuración',
        ],
      },
      {
        title: 'Calidad y entrega',
        items: [
          'Jest · Vitest',
          'Lighthouse',
          'Accesibilidad: HTML semántico y ARIA',
          'Jenkins (CI/CD) · Docker',
        ],
      },
    ],
  },
  contact: {
    eyebrow: 'Siguiente paso',
    title: 'Contacto',
    mailLabel: 'Escríbeme',
    email: 'contacto@kunsih.me',
    pitch: 'Busco seguir creciendo en roles de frontend, full stack o ingeniería de software, y hacia liderazgo técnico o Product Management. Remoto o híbrido.',
    emailCta: 'Escribir un correo',
    linkedinCta: 'Conectar en LinkedIn',
  },
}

export const cv: Record<Lang, CV> = { en, es }
