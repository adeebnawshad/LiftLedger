import type {
  AverageWeeklySetTypeTotals,
  WeekSetTypeTotals,
  WeeklyVolumeRow,
} from '../types/analytics'

/** Flat API rows → one object per week for Recharts. */
// { weekStart: '2026-02-03', muscleGroup: 'CHEST', setCount: 8 }
// { weekStart: '2026-02-03', muscleGroup: 'BACK',  setCount: 9 }
// →
// { weekStart: '2026-02-03', CHEST: 8, BACK: 9 }
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
  return [...new Set(rows.map((r) => r.muscleGroup))].sort() // pull out the the muscle group from each row and keeps unique values and turn into a normal array and then sort them alphabetically
}


// Job: Collapse type back into a single muscle total.
// CHEST + COMPOUND + 5
// CHEST + ISOLATION + 3
// → CHEST + 8   (same week)
// API rows (week × muscle × type)
// ↓
// aggregateMuscleByWeek(rows)
// ↓
// { weekStart, CHEST: 8, BACK: 9, … }
// ↓
// filter to visibleMuscles (optional)
// ↓
// BarChart (one <Bar> per visible muscle)

// This is for the the multi-muscle stacked bar chart
export function aggregateMuscleByWeek(rows: WeeklyVolumeRow[]) {
  // Keys are strings (weekStart, CHEST, BACK, ...), Values are sometimes a number, sometimes a string. (date - string, set count - number)
  const byWeek = new Map<string, Record<string, number | string>>() // week start ->  {weekStart: string, muscleGroup: string, setCount: number}. We need week start in the key for lookup, we need it in the value for Recharts and sorting.

  for (const row of rows) {
    let week = byWeek.get(row.weekStart)
    if (!week) {
      week = { weekStart: row.weekStart } // fixed key: weekStart
      byWeek.set(row.weekStart, week)
    }
    // dynamic key access: week[row.muscleGroup] is the same as week['CHEST'] or week['BACK'] etc.
    week[row.muscleGroup] = (Number(week[row.muscleGroup]) || 0) + row.setCount // if the muscle group is not in the week, set it to 0, otherwise add the set count to the existing value
  }

  return [...byWeek.values()].sort((a, b) =>
    String(a.weekStart).localeCompare(String(b.weekStart)), // oldest week first
  )
}

// Weeks where any muscle was trained stay on the axis.
// Zero compound/isolation → null so Recharts skips the segment (no "0 sets" hover).
// pivotTypeForMuscle(rows, 'CHEST') → { weekStart, COMPOUND, ISOLATION }
export function pivotTypeForMuscle(rows: WeeklyVolumeRow[], muscleGroup: string) {
  const byWeek = new Map<
    string,
    { COMPOUND: number; ISOLATION: number }
  >()

  for (const row of rows) {
    let week = byWeek.get(row.weekStart)
    if (!week) {
      week = { COMPOUND: 0, ISOLATION: 0 }
      byWeek.set(row.weekStart, week)
    }

    if (row.muscleGroup === muscleGroup) {
      week[row.exerciseType] += row.setCount
    }
  }

  return [...byWeek.entries()]
    .map(([weekStart, t]) => ({
      weekStart,
      COMPOUND: t.COMPOUND > 0 ? t.COMPOUND : null,
      ISOLATION: t.ISOLATION > 0 ? t.ISOLATION : null,
    }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
}

/**
 * Under each week (multi-muscle mode):
 *   2026-02-03 · 23 sets · 14 compound · 9 isolation
 *
 * Sums COMPOUND / ISOLATION across muscles. If `visibleMuscles` is provided and
 * non-empty, only those muscles are included (legend filter).
 */
export function totalsByWeek(
  rows: WeeklyVolumeRow[],
  visibleMuscles?: string[],
): WeekSetTypeTotals[] {
  const visible = // if visibleMuscles is provided and is not empty, create a new Set called visible with the visible muscles, otherwise set it to null
    visibleMuscles && visibleMuscles.length > 0
      ? new Set(visibleMuscles)
      : null
  // byWeek is a map of week start to an object with compound and isolation set counts
  const byWeek = new Map<string, { compound: number; isolation: number }>() // week start -> { compound: number, isolation: number }

  for (const row of rows) {
    if (visible && !visible.has(row.muscleGroup)) continue // if visible is not null and the muscle group is not in the visible set, skip the row

    let week = byWeek.get(row.weekStart) // week is an object with compound and isolation set counts
    if (!week) {
      week = { compound: 0, isolation: 0 } // if the week is not in the map, create a new object with compound and isolation set counts
      byWeek.set(row.weekStart, week) // set row.weekStart as the key and the week object as the value
    }

    if (row.exerciseType === 'COMPOUND') { // if the exercise type is COMPOUND, add the set count to the compound set count
      week.compound += row.setCount
    } else {
      week.isolation += row.setCount // if the exercise type is ISOLATION, add the set count to the isolation set count
    }
  }

  return [...byWeek.entries()] // byWeek.entries() returns an array of [weekStart, { compound: number, isolation: number }]
    .map(([weekStart, t]) => ({
      weekStart,
      compound: t.compound,
      isolation: t.isolation,
      total: t.compound + t.isolation,
    }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart)) // sort the array by week start
}

/** Average of the weekly totals (only weeks present in `weekTotals`). */
export function averageWeeklySetTypeTotals(
  weekTotals: WeekSetTypeTotals[],
): AverageWeeklySetTypeTotals {
  const weekCount = weekTotals.length
  if (weekCount === 0) {
    return { avgTotal: 0, avgCompound: 0, avgIsolation: 0, weekCount: 0 }
  }

  const sumTotal = weekTotals.reduce((s, w) => s + w.total, 0) // s is the accumulator, w is the current element of weekTotals, 0 is the initial value
  const sumCompound = weekTotals.reduce((s, w) => s + w.compound, 0)
  const sumIsolation = weekTotals.reduce((s, w) => s + w.isolation, 0)

  const round1 = (n: number) => Math.round((n / weekCount) * 10) / 10 // defining a function called round1 that rounds a number to 1 decimal place

  return {
    avgTotal: round1(sumTotal),
    avgCompound: round1(sumCompound),
    avgIsolation: round1(sumIsolation),
    weekCount,
  }
}

// fetchWeeklyVolume is a function that fetches the weekly volume data from the backend
export async function fetchWeeklyVolume(params: { // date range as YYYY-MM-DD strings from the date picker
  start: string 
  end: string
}) {
  const url = new URL('/api/analytics/weekly-volume', window.location.origin) // window.location.origin is the base URL of the page you’re on — protocol + host + port, no path. //new URL(path, base) builds a full URL: base:  http://localhost:5173 path:  /api/analytics/weekly-volume result: http://localhost:5173/api/analytics/weekly-volume
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

