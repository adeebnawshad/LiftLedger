export type WeeklyVolumeRow = {
  weekStart: string
  muscleGroup: string
  exerciseType: 'COMPOUND' | 'ISOLATION'
  setCount: number
}

export type WeeklyVolumeResponse = {
  ok: boolean
  range:
    | { type: 'weeks'; weeks: number }
    | { type: 'dates'; start: string; end: string }
  rows: WeeklyVolumeRow[]
  error?: string
}

/** Per-week set totals across muscles (optionally filtered), split by exercise type. */
export type WeekSetTypeTotals = {
  weekStart: string
  total: number
  compound: number
  isolation: number
}

/** Means of the weekly totals over the weeks present in the data. */
export type AverageWeeklySetTypeTotals = {
  avgTotal: number
  avgCompound: number
  avgIsolation: number
  weekCount: number
}
