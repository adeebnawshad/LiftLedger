export type StrengthMetric = 'E1RM' | 'MAX_REPS'

export type StrengthTrendRow = {
  weekStart: string
  value: number
}

export type LoggedExercise = {
  exerciseId: string
  exerciseName: string
  strengthTracking: StrengthMetric
}

export type StrengthTrendsResponse = {
  ok: boolean
  exercise: { id: string; name: string; strengthTracking: StrengthMetric }
  metric: StrengthMetric
  range:
    | { type: 'weeks'; weeks: number }
    | { type: 'dates'; start: string; end: string }
  rows: StrengthTrendRow[]
  error?: string
}

export type LoggedExercisesResponse = {
  ok: boolean
  range: { type: 'dates'; start: string; end: string }
  exercises: LoggedExercise[]
  error?: string
}
