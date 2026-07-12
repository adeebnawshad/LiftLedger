export type InsightSeverity = 'positive' | 'neutral' | 'warning'

export type Insight = {
  type: string
  severity: InsightSeverity
  title: string
  message: string
}

export type VolumeComparisonRow = {
  muscleGroup: string
  setsA: number
  setsB: number
  pctChange: number
}

export type StrengthComparisonRow = {
  exerciseId: string
  exerciseName: string
  primaryMuscleGroup: string
  metric: 'E1RM' | 'MAX_REPS'
  peakA: number
  peakB: number
  pctChange: number
  weeksA: number
  weeksB: number
}

export type PeriodInsightsResponse = {
  ok: boolean
  periodA: { start: string; end: string }
  periodB: { start: string; end: string }
  volumeComparison: VolumeComparisonRow[]
  strengthComparison: StrengthComparisonRow[]
  insights: Insight[]
  error?: string
}
