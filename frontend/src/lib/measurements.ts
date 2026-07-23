import type {
  MeasurementSite,
  MeasurementTrendsResponse,
  MeasurementScatterResponse,
  WaistMeasurementScatterResponse,
  CreateMeasurementRequest,
  MeasurementEntry,
} from '../types/measurements'

export async function createMeasurement(params: CreateMeasurementRequest) {
  const url = new URL('/api/measurements', window.location.origin) // build the URL for the API endpoint - Vite proxies to Express server

  // fetch with POST - send JSON: {site, value, measuredAt, notes?}
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // tells Express to parse req.body (without this, req.body can be empty). This is required for POST requests.
    },
    body: JSON.stringify(params), // turns the JS object into a JSON string for the request body.
  })

  const data = (await res.json())
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data as MeasurementEntry
}

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

export async function fetchMeasurementScatter(params: {
  site: MeasurementSite
}) {
  const url = new URL(
    '/api/analytics/measurements-scatter',
    window.location.origin,
  )
  url.searchParams.set('site', params.site)

  const res = await fetch(url)
  const data = (await res.json()) as MeasurementScatterResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export async function fetchWaistMeasurementScatter(params: {
  site: MeasurementSite
}) {
  const url = new URL(
    '/api/analytics/measurements-waist-scatter',
    window.location.origin,
  )
  url.searchParams.set('site', params.site)

  const res = await fetch(url)
  const data = (await res.json()) as WaistMeasurementScatterResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export const MEASUREMENT_SITES: { value: MeasurementSite; label: string }[] = [
  { value: 'BODY_WEIGHT', label: 'Bodyweight' },
  { value: 'NECK', label: 'Neck' },
  { value: 'LEFT_ARM', label: 'Left arm' },
  { value: 'RIGHT_ARM', label: 'Right arm' },
  { value: 'CHEST', label: 'Chest' },
  { value: 'WAIST', label: 'Waist' },
  { value: 'HIPS', label: 'Hips' },
  { value: 'LEFT_FOREARM', label: 'Left forearm' },
  { value: 'RIGHT_FOREARM', label: 'Right forearm' },
  { value: 'LEFT_THIGH', label: 'Left thigh' },
  { value: 'RIGHT_THIGH', label: 'Right thigh' },
  { value: 'LEFT_CALF', label: 'Left calf' },
  { value: 'RIGHT_CALF', label: 'Right calf' },
]

/** Girth sites only — for bodyweight scatter site picker */
export const GIRTH_MEASUREMENT_SITES = MEASUREMENT_SITES.filter(
  (s) => s.value !== 'BODY_WEIGHT',
)

/** Girth sites except waist — for waist scatter site picker */
export const WAIST_COMPARE_SITES = MEASUREMENT_SITES.filter(
  (s) => s.value !== 'BODY_WEIGHT' && s.value !== 'WAIST',
)
