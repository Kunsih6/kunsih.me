import type { Lang } from '@/i18n/ui'
import { useTranslations } from '@/i18n/utils'

/** A calendar month in `YYYY-MM` format. */
export type YearMonth = `${number}-${number}`

function parse(value: YearMonth): { year: number, month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

function currentYearMonth(): YearMonth {
  const now = new Date()
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`
}

/** "Jan 2023" / "ene 2023". */
export function formatMonth(value: YearMonth, lang: Lang): string {
  const { year, month } = parse(value)
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
}

/** "3 years 10 months" / "3 años 10 meses". `end` defaults to the build month. */
export function formatDuration(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const t = useTranslations(lang)
  const plural = new Intl.PluralRules(lang)
  const from = parse(start)
  const to = parse(end ?? currentYearMonth())
  const total = Math.max(1, (to.year - from.year) * 12 + (to.month - from.month))
  const years = Math.floor(total / 12)
  const months = total % 12

  const parts: string[] = []
  if (years > 0) {
    parts.push(`${years} ${t(plural.select(years) === 'one'
      ? 'date.year.one'
      : 'date.year.other')}`)
  }
  if (months > 0) {
    parts.push(`${months} ${t(plural.select(months) === 'one'
      ? 'date.month.one'
      : 'date.month.other')}`)
  }
  return parts.join(' ')
}

/** "Jan 2023 — Present" with the end month or the localized "present" label. */
export function formatRange(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const t = useTranslations(lang)
  return `${formatMonth(start, lang)} — ${end
    ? formatMonth(end, lang)
    : t('date.present')}`
}
