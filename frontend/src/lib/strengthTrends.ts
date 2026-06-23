import type {
  LoggedExercisesResponse,
  StrengthTrendsResponse,
} from '../types/strength'

export async function fetchLoggedExercises(params: {
  start: string
  end: string
}) {
  const url = new URL('/api/analytics/logged-exercises', window.location.origin) 
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)

  const res = await fetch(url)
  const data = (await res.json()) as LoggedExercisesResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}

export async function fetchStrengthTrends(params: {
  exerciseId: string
  start: string
  end: string
}) {
  const url = new URL('/api/analytics/strength-trends', window.location.origin)
  url.searchParams.set('exerciseId', params.exerciseId)
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)

  const res = await fetch(url)
  const data = (await res.json()) as StrengthTrendsResponse
  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}
