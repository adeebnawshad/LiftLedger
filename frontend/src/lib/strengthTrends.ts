import type {
  LoggedExercisesResponse,
  StrengthTrendRow,
  StrengthTrendsResponse,
} from '../types/strength'

export async function fetchLoggedExercises(params: {
  start: string
  end: string
}) {
  const url = new URL('/api/analytics/logged-exercises', window.location.origin)
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)

  const res = await fetch(url)
  const data = (await res.json()) as LoggedExercisesResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export async function fetchStrengthTrends(params: {
  exerciseId: string
  start: string
  end: string
}) {
  const url = new URL('/api/analytics/strength-trends', window.location.origin)
  url.searchParams.set('exerciseId', params.exerciseId)
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)

  const res = await fetch(url)
  const data = (await res.json()) as StrengthTrendsResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export type StrengthTrendChartRow = StrengthTrendRow & {
  /** % change vs first week in the series (0 for the first week). */
  pctFromFirst: number
}

/** Oldest week is baseline (0%). Later weeks are % change from that value. */
export function withPctChangeFromFirst(
  rows: StrengthTrendRow[],
): StrengthTrendChartRow[] {
  if (!rows.length) return []

  const baseline = rows[0].value

  return rows.map((row) => {
    let pctFromFirst = 0
    if (baseline === 0) {
      pctFromFirst = row.value === 0 ? 0 : 100
    } else {
      pctFromFirst =
        Math.round(((row.value - baseline) / baseline) * 1000) / 10
    }
    return { ...row, pctFromFirst }
  })
}

/** e.g. 0 → "0%", 5.2 → "+5.2%", -3 → "-3%" */
export function formatPctFromFirst(pct: number): string {
  if (pct === 0) return '0%'
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct}%`
}
