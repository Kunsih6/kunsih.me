import type { Lang } from '@/i18n/ui'
import type { YearMonth } from '@/utils/date'

/*
 * Page content per locale. Everything below is PLACEHOLDER copy that mirrors the
 * structure of the design; replace it with the real content when it is ready.
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
    pitch: string
    emailCta: string
    linkedinCta: string
  }
}

const en: CV = {
  hero: {
    updated: 'Updated 2026.11',
    headline: 'Placeholder headline. Software engineer, frontend and full stack.',
    intro: 'Placeholder intro: one or two sentences about years of experience and the main technologies used.',
    primaryCta: 'Get in touch',
    secondaryCta: 'Connect on LinkedIn',
  },
  profile: {
    eyebrow: 'Profile',
    statement: 'Placeholder statement about how you approach your work,',
    statementAccent: 'with the key idea highlighted.',
    facts: [
      { label: 'Based in', value: 'City, Country' },
      { label: 'Languages', value: 'Language one, language two' },
      { label: 'Education', value: 'University name, 20XX' },
    ],
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Placeholder title summarizing years of experience and the teams worked with.',
    intro: 'Select a role to see what I did and with which stack.',
    teamLabel: 'Team',
    roles: [
      {
        id: 'company-one',
        company: 'Company One',
        title: 'Frontend Engineer',
        start: '2023-01',
        end: null,
        summary: 'Placeholder one-line description of the product or company.',
        team: 'Placeholder team size and distribution.',
        highlights: [
          'Placeholder achievement describing the problem, the action and a measurable result.',
          'Placeholder achievement about architecture or a technical decision and its impact.',
          'Placeholder achievement about performance, quality or collaboration.',
        ],
        stack: [
          'TypeScript',
          'Vue.js',
          'React',
          'Next.js',
          'Node.js',
        ],
      },
      {
        id: 'company-two',
        company: 'Company Two',
        title: 'Software Developer',
        start: '2020-06',
        end: '2022-12',
        summary: 'Placeholder one-line description of the product or company.',
        team: 'Placeholder team size and distribution.',
        highlights: [
          'Placeholder achievement describing the problem, the action and a measurable result.',
          'Placeholder achievement about a feature that was built and shipped.',
        ],
        stack: ['Nuxt', 'Tailwind CSS', 'REST APIs'],
      },
      {
        id: 'company-three',
        company: 'Company Three',
        title: 'Frontend Developer',
        start: '2017-11',
        end: '2020-05',
        team: 'Placeholder team size.',
        highlights: [
          'Placeholder achievement describing the problem, the action and a measurable result.',
          'Placeholder achievement about the development lifecycle.',
        ],
        stack: ['Vue.js', 'Vuetify', 'Firebase'],
      },
    ],
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Placeholder title about how you balance frontend and backend.',
    groups: [
      {
        title: 'Frontend',
        items: ['Technology one', 'Technology two', 'Technology three'],
      },
      {
        title: 'Backend and data',
        items: ['Technology one', 'Technology two', 'Technology three'],
      },
      {
        title: 'Architecture',
        items: ['Practice one', 'Practice two', 'Practice three'],
      },
      {
        title: 'Quality and delivery',
        items: ['Tool one', 'Tool two', 'Tool three'],
      },
    ],
  },
  contact: {
    eyebrow: 'Next step',
    title: 'Contact',
    mailLabel: 'Write to me',
    pitch: 'Placeholder paragraph about the roles you are looking for and how you prefer to work.',
    emailCta: 'Send an email',
    linkedinCta: 'Connect on LinkedIn',
  },
}

const es: CV = {
  hero: {
    updated: 'Actualizado 2026.11',
    headline: 'Titular de ejemplo. Ingeniero de software, frontend y full stack.',
    intro: 'Introducción de ejemplo: una o dos frases sobre los años de experiencia y las tecnologías principales.',
    primaryCta: 'Contactar',
    secondaryCta: 'Conectar en LinkedIn',
  },
  profile: {
    eyebrow: 'Perfil',
    statement: 'Frase de ejemplo sobre cómo abordas tu trabajo,',
    statementAccent: 'con la idea clave resaltada.',
    facts: [
      { label: 'Ubicación', value: 'Ciudad, País' },
      { label: 'Idiomas', value: 'Idioma uno, idioma dos' },
      { label: 'Formación', value: 'Nombre de la universidad, 20XX' },
    ],
  },
  experience: {
    eyebrow: 'Trayectoria',
    title: 'Título de ejemplo que resume los años de experiencia y los equipos.',
    intro: 'Selecciona un rol para ver qué hice y con qué stack.',
    teamLabel: 'Equipo',
    roles: [
      {
        id: 'company-one',
        company: 'Empresa Uno',
        title: 'Frontend Engineer',
        start: '2023-01',
        end: null,
        summary: 'Descripción de ejemplo, en una línea, del producto o la empresa.',
        team: 'Tamaño y distribución del equipo de ejemplo.',
        highlights: [
          'Logro de ejemplo que describe el problema, la acción y un resultado medible.',
          'Logro de ejemplo sobre arquitectura o una decisión técnica y su impacto.',
          'Logro de ejemplo sobre rendimiento, calidad o colaboración.',
        ],
        stack: [
          'TypeScript',
          'Vue.js',
          'React',
          'Next.js',
          'Node.js',
        ],
      },
      {
        id: 'company-two',
        company: 'Empresa Dos',
        title: 'Software Developer',
        start: '2020-06',
        end: '2022-12',
        summary: 'Descripción de ejemplo, en una línea, del producto o la empresa.',
        team: 'Tamaño y distribución del equipo de ejemplo.',
        highlights: [
          'Logro de ejemplo que describe el problema, la acción y un resultado medible.',
          'Logro de ejemplo sobre una funcionalidad construida y lanzada.',
        ],
        stack: ['Nuxt', 'Tailwind CSS', 'APIs REST'],
      },
      {
        id: 'company-three',
        company: 'Empresa Tres',
        title: 'Frontend Developer',
        start: '2017-11',
        end: '2020-05',
        team: 'Tamaño del equipo de ejemplo.',
        highlights: [
          'Logro de ejemplo que describe el problema, la acción y un resultado medible.',
          'Logro de ejemplo sobre el ciclo de desarrollo.',
        ],
        stack: ['Vue.js', 'Vuetify', 'Firebase'],
      },
    ],
  },
  stack: {
    eyebrow: 'Stack',
    title: 'Título de ejemplo sobre cómo equilibras frontend y backend.',
    groups: [
      {
        title: 'Frontend',
        items: ['Tecnología uno', 'Tecnología dos', 'Tecnología tres'],
      },
      {
        title: 'Backend y datos',
        items: ['Tecnología uno', 'Tecnología dos', 'Tecnología tres'],
      },
      {
        title: 'Arquitectura',
        items: ['Práctica uno', 'Práctica dos', 'Práctica tres'],
      },
      {
        title: 'Calidad y entrega',
        items: ['Herramienta uno', 'Herramienta dos', 'Herramienta tres'],
      },
    ],
  },
  contact: {
    eyebrow: 'Siguiente paso',
    title: 'Contacto',
    mailLabel: 'Escríbeme',
    pitch: 'Párrafo de ejemplo sobre los roles que buscas y cómo prefieres trabajar.',
    emailCta: 'Escribir un correo',
    linkedinCta: 'Conectar en LinkedIn',
  },
}

export const cv: Record<Lang, CV> = { en, es }
