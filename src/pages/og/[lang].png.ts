import type { APIRoute, GetStaticPaths } from 'astro'
import type { Lang } from '@/i18n/ui'
import { locales } from '@/i18n/ui'
import { renderShareCard } from '@/utils/share-card'

export const getStaticPaths = (() => locales.map(lang => ({
  params: { lang },
}))) satisfies GetStaticPaths

export const GET: APIRoute = async ({ params }) => new Response(await renderShareCard(params.lang as Lang), {
  headers: { 'Content-Type': 'image/png' },
})
