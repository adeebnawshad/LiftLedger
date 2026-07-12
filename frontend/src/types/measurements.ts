export type MeasurementSite =
  | 'BODY_WEIGHT'
  | 'LEFT_ARM'
  | 'RIGHT_ARM'
  | 'CHEST'
  | 'WAIST'

export type MeasurementRow = {
  weekStart: string
  value: number
}

export type MeasurementTrendsResponse = {
  ok: boolean
  site: MeasurementSite
  unit: string
  range: { start: string; end: string }
  rows: MeasurementRow[]
  error?: string
}
