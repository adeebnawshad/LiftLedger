import type { PeriodInsightsResponse } from '../types/insights'

export async function fetchPeriodInsights(params: {
  startA: string
  endA: string
  startB: string
  endB: string
  exerciseId?: string
}) {
  const url = new URL('/api/analytics/period-insights', window.location.origin)
  url.searchParams.set('startA', params.startA)
  url.searchParams.set('endA', params.endA)
  url.searchParams.set('startB', params.startB)
  url.searchParams.set('endB', params.endB)
  if (params.exerciseId) {
    url.searchParams.set('exerciseId', params.exerciseId)
  }

  const res = await fetch(url)
  const data = (await res.json()) as PeriodInsightsResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}
