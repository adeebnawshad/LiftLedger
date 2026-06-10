import type { WeeklyVolumeRow } from '../types/analytics'

/** Flat API rows → one object per week for Recharts. */
// pivotRowsByWeek is a function that pivots the weekly volume data from the backend into a format that can be used by Recharts
export function pivotRowsByWeek(rows: WeeklyVolumeRow[]) {
  const byWeek = new Map<string, Record<string, number | string>>() // week start ->  {weekStart: string, muscleGroup: string, setCount: number}. We need week start in the key for lookup, we need it in the value for Recharts and sorting.

  for (const row of rows) {
    let week = byWeek.get(row.weekStart)
    if (!week) {
      week = { weekStart: row.weekStart }
      byWeek.set(row.weekStart, week)
    }
    week[row.muscleGroup] = row.setCount
  }

  return [...byWeek.values()].sort((a, b) =>
    String(a.weekStart).localeCompare(String(b.weekStart)), // oldest week first
  )
}

export function muscleGroupsInRows(rows: WeeklyVolumeRow[]) {
  return [...new Set(rows.map((r) => r.muscleGroup))].sort() // pull out the the muscle group from each row and keeps unique vaalues and turn into a normal array and then sort them alphabetically
}

// fetchWeeklyVolume is a function that fetches the weekly volume data from the backend
export async function fetchWeeklyVolume(params: { // date range as YYYY-MM-DD strings from the date picker
  start: string 
  end: string
}) {
  const url = new URL('/api/analytics/weekly-volume', window.location.origin)
  // searchParams.set adds query string params
  // these match what the backend expects: GET /api/analytics/weekly-volume?start=...&end=...
  url.searchParams.set('start', params.start)
  url.searchParams.set('end', params.end)
  // If the app runs at http://localhost:5173, you get:
  // http://localhost:5173/api/analytics/weekly-volume?start=2026-01-01&end=2026-01-07
  const res = await fetch(url) // GET by default
  const data = await res.json() // read the response body as JSON
  if (!res.ok) { // if the response is not OK, throw an error
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }
  return data
}
