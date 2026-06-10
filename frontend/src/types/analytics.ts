export type WeeklyVolumeRow = {
  weekStart: string
  muscleGroup: string
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
