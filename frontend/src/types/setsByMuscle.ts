export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'UPPER_TRAPS'
  | 'QUADS'
  | 'HAMSTRINGS'
  | 'GLUTES'
  | 'CALVES'
  | 'SHOULDERS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'FOREARMS'
  | 'CORE'
  | 'OTHER'

export type SetsByMuscleRow = {
  date: string
  exerciseName: string
  weightAmount: number | null
  weightUnit: string | null
  reps: number
  setNumber: number
}

export type SetsByMuscleResponse = {
  ok: boolean
  muscleGroup: MuscleGroup
  range: { start: string; end: string }
  rows: SetsByMuscleRow[]
  error?: string
}