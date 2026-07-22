export type MeasurementSite =
  | 'BODY_WEIGHT'
  | 'NECK'
  | 'CHEST'
  | 'WAIST'
  | 'HIPS'
  | 'LEFT_ARM'
  | 'RIGHT_ARM'
  | 'LEFT_FOREARM'
  | 'RIGHT_FOREARM'
  | 'LEFT_THIGH'
  | 'RIGHT_THIGH'
  | 'LEFT_CALF'
  | 'RIGHT_CALF'

/** Trend / line charts — GET /api/analytics/measurements */
export type MeasurementRow = {
  measuredAt: string
  value: number
}

export type MeasurementTrendsResponse = {
  ok: boolean
  site: MeasurementSite
  unit: string // 'lbs' | 'inches'
  rows: MeasurementRow[]
  error?: string
}

/** Scatter — GET /api/analytics/measurements-scatter */
export type MeasurementScatterRow = {
  measuredAt: string // tooltip only
  bodyweight: number
  measurement: number
}

export type MeasurementScatterResponse = {
  ok: boolean
  site: MeasurementSite
  units: { bodyweight: 'lbs'; measurement: 'inches' }
  rows: MeasurementScatterRow[]
  error?: string
}

/** Scatter — GET /api/analytics/measurements-waist-scatter */
export type WaistMeasurementScatterRow = {
  measuredAt: string // tooltip only
  waist: number
  measurement: number
}

export type WaistMeasurementScatterResponse = {
  ok: boolean
  site: MeasurementSite
  units: { waist: 'inches'; measurement: 'inches' }
  rows: WaistMeasurementScatterRow[]
  error?: string
}

/** Create — POST /api/measurements */
export type CreateMeasurementRequest = {
  measuredAt: string // YYYY-MM-DD
  site: MeasurementSite
  value: number
  notes?: string
}

/** Created row returned by POST /api/measurements */
export type MeasurementEntry = {
  id: string
  userId: string
  measuredAt: string
  site: MeasurementSite
  value: string | number
  notes: string | null
}