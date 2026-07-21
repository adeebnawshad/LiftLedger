export type MeasurementSite =
  | 'BODY_WEIGHT'
  | 'LEFT_ARM'
  | 'RIGHT_ARM'
  | 'CHEST'
  | 'WAIST'

export type MeasurementRow = {
  measuredAt: string
  value: number
}

export type MeasurementTrendsResponse = {
  ok: boolean
  site: MeasurementSite
  unit: string
  rows: MeasurementRow[]
  error?: string
}
