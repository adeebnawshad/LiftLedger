import type {
  SetsByMuscleResponse,
  MuscleGroup,
} from '../types/setsByMuscle'

export async function fetchSetsByMuscle(params: {
  muscleGroup: MuscleGroup
  start: string
  end: string
}) {
  const url = new URL(
    '/api/analytics/sets-by-muscle-group',
    window.location.origin,
  )
  url.searchParams.set('muscleGroup', params.muscleGroup)
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)

  const res = await fetch(url)
  const data = (await res.json()) as SetsByMuscleResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: 'CHEST', label: 'Chest' },
  { value: 'BACK', label: 'Back' },
  { value: 'UPPER_TRAPS', label: 'Upper traps' },
  { value: 'SHOULDERS', label: 'Shoulders' },
  { value: 'BICEPS', label: 'Biceps' },
  { value: 'TRICEPS', label: 'Triceps' },
  { value: 'FOREARMS', label: 'Forearms' },
  { value: 'CORE', label: 'Core' },
  { value: 'QUADS', label: 'Quads' },
  { value: 'HAMSTRINGS', label: 'Hamstrings' },
  { value: 'GLUTES', label: 'Glutes' },
  { value: 'CALVES', label: 'Calves' },
  { value: 'OTHER', label: 'Other' },
]
