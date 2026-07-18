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

/**
 * Period averages: sum(sets) / calendarWeekCount.
 * calendarWeekCount = inclusive days between start and end, divided by 7.
 */
export type AverageWeeklySetTypeTotals = {
  avgTotal: number
  avgCompound: number
  avgIsolation: number
  /** Inclusive date-span days / 7 (may be fractional). */
  weekCount: number
}
