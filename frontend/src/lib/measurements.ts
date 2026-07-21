import type {
  MeasurementSite,
  MeasurementTrendsResponse,
} from '../types/measurements'

export async function fetchMeasurementTrends(params: {
  site: MeasurementSite
}) {
  const url = new URL('/api/analytics/measurements', window.location.origin)
  url.searchParams.set('site', params.site)

  const res = await fetch(url)
  const data = (await res.json()) as MeasurementTrendsResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export const MEASUREMENT_SITES: { value: MeasurementSite; label: string }[] = [
  { value: 'BODY_WEIGHT', label: 'Body weight' },
  { value: 'LEFT_ARM', label: 'Left arm' },
  { value: 'RIGHT_ARM', label: 'Right arm' },
  { value: 'CHEST', label: 'Chest' },
  { value: 'WAIST', label: 'Waist' },
]
