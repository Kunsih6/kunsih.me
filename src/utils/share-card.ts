import type { Lang } from '@/i18n/ui'
import { Buffer } from 'node:buffer'
import satori from 'satori'
import sharp from 'sharp'
import wordmark from '@/assets/brand/kunsih.svg?raw'
import mono from '@/assets/og/ShareTechMono-Regular.ttf?inline'
import display from '@/assets/og/Unbounded-Medium.ttf?inline'
import { site } from '@/config/site'
import { cv } from '@/data/cv'
import { useTranslations } from '@/i18n/utils'

const SHARE_CARD = site.ogImage

// Keep in sync with the dark theme in src/styles/tokens.css.
const color = {
  bg: '#0b0c0e',
  ink: '#eceef1',
  muted: '#9aa2ad',
  lineStrong: '#6c7480',
  signal: '#ff8a3d',
}

// Same echo offsets as the hero (Hero.astro).
const WORD_WIDTH = 900
const [, , viewWidth, viewHeight] = wordmark.match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number)
const em = WORD_WIDTH / (viewWidth / 1000)
const wordHeight = Math.round(WORD_WIDTH * viewHeight / viewWidth)

function wordmarkImage(outline: boolean): string {
  const paint = outline
    ? `fill="none" stroke="${color.lineStrong}" stroke-width="${(1.5 * viewWidth / WORD_WIDTH).toFixed(2)}"`
    : `fill="${color.ink}"`
  const svg = wordmark
    .replace(/fill="currentColor"/, paint)
    .replaceAll(/\s*vector-effect="[^"]*"/g, '')
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

interface Node {
  type: string
  props: { style?: Record<string, string | number>, children?: (Node | string)[] | Node | string, [key: string]: unknown }
}

function h(type: string, style: Node['props']['style'], ...children: (Node | string)[]): Node {
  return {
    type,
    props: { style, children },
  }
}

function corner(position: Record<string, number>, sides: string[]): Node {
  return h('div', {
    position: 'absolute',
    width: 20,
    height: 20,
    ...position,
    ...Object.fromEntries(sides.map(side => [`border${side}`, `2px solid ${color.lineStrong}`])),
  })
}

function card(lang: Lang): Node {
  const { hero } = cv[lang]
  const t = useTranslations(lang)
  const pad = 0.07 * em
  const echoX = 0.04375 * em
  const echoY = 0.15 * em
  const label = { fontSize: 17, letterSpacing: 2.4, textTransform: 'uppercase' } as const

  return h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width: SHARE_CARD.width,
      height: SHARE_CARD.height,
      // Deeper at the bottom: X lays the domain over that corner.
      padding: '48px 72px 104px',
      background: color.bg,
      color: color.ink,
      fontFamily: 'Share Tech Mono',
    },
    h(
      'div',
      {
        display: 'flex',
        justifyContent: 'space-between',
        color: color.muted,
        ...label,
      },
      h('span', {}, `N° 001 // KS-CV // ${hero.updated}`),
      h('span', {}, `${site.location.coordinates} // ${site.location.city}, ${site.location.countryCode}`),
    ),
    h(
      'div',
      {
        position: 'relative',
        display: 'flex',
        alignSelf: 'flex-start',
        padding: `${pad}px ${pad + echoX}px ${pad + echoY}px ${pad}px`,
      },
      {
        type: 'img',
        props: {
          src: wordmarkImage(true),
          width: WORD_WIDTH,
          height: wordHeight,
          style: { position: 'absolute', left: pad + echoX, top: pad + echoY },
        },
      },
      // Positioned, so it paints over the echo.
      {
        type: 'img',
        props: {
          src: wordmarkImage(false),
          width: WORD_WIDTH,
          height: wordHeight,
          style: { position: 'relative' },
        },
      },
      corner({ top: -14, left: -14 }, ['Top', 'Left']),
      corner({ top: -14, right: -14 }, ['Top', 'Right']),
      corner({ bottom: -14, right: -14 }, ['Bottom', 'Right']),
      corner({ bottom: -14, left: -14 }, ['Bottom', 'Left']),
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: 18 },
      h(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: color.signal,
          ...label,
        },
        h('div', {
          width: 10,
          height: 10,
          borderRadius: 10,
          background: color.signal,
        }),
        h('span', {}, t('status.available')),
        h('span', { color: color.muted }, t('status.mode')),
      ),
      h('div', {
        maxWidth: 960,
        fontFamily: 'Unbounded',
        fontSize: 38,
        lineHeight: 1.18,
        letterSpacing: -0.38,
        textWrap: 'balance',
      }, hero.headline),
    ),
  )
}

const fontData = (dataUrl: string) => Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')

export async function renderShareCard(lang: Lang): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(card(lang), {
    ...SHARE_CARD,
    fonts: [
      {
        name: 'Share Tech Mono',
        data: fontData(mono),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Unbounded',
        data: fontData(display),
        weight: 500,
        style: 'normal',
      },
    ],
  })
  return new Uint8Array(await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer())
}
