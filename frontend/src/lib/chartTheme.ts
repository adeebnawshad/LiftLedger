export const CHART_COLORS = {
  volume: '#a855f7',
  strength: '#3b82f6',
  measurement: '#8b5cf6',
  grid: '#2a3548',
  axis: '#64748b',
  tick: '#8b9bb4',
}

/** Stable fills for stacked weekly-volume bars (muscle mode). */
export const MUSCLE_COLORS: Record<string, string> = {
  CHEST: '#3b82f6',
  BACK: '#14b8a6',
  UPPER_TRAPS: '#0ea5e9',
  QUADS: '#eab308',
  HAMSTRINGS: '#f97316',
  GLUTES: '#ec4899',
  CALVES: '#84cc16',
  SHOULDERS: '#8b5cf6',
  BICEPS: '#ef4444',
  TRICEPS: '#f472b6',
  FOREARMS: '#a78bfa',
  CORE: '#22c55e',
  OTHER: '#64748b',
}

/** Stacked compound vs isolation (single-muscle mode). */
export const TYPE_COLORS = {
  COMPOUND: '#3b82f6',
  ISOLATION: '#f59e0b',
} as const

const FALLBACK_MUSCLE_COLOR = '#64748b' // fallback color for when a muscle group is not found in the MUSCLE_COLORS object

export function muscleColor(muscleGroup: string): string {
  return MUSCLE_COLORS[muscleGroup] ?? FALLBACK_MUSCLE_COLOR
}

/** CHEST → "Chest", UPPER_TRAPS → "Upper traps" */
export function formatMuscleLabel(muscleGroup: string): string {
  return muscleGroup
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatExerciseTypeLabel(
  exerciseType: 'COMPOUND' | 'ISOLATION',
): string {
  return exerciseType === 'COMPOUND' ? 'Compound' : 'Isolation'
}

export const chartMargin = { top: 8, right: 12, left: 0, bottom: 0 }

export const axisStyle = {
  stroke: CHART_COLORS.axis,
  tick: { fill: CHART_COLORS.tick, fontSize: 11 },
  tickLine: { stroke: CHART_COLORS.grid },
}

export const gridStyle = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: '3 3',
}

export const tooltipStyle = {
  contentStyle: {
    background: '#1a2130',
    border: '1px solid #2a3548',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#e8edf5',
  },
  labelStyle: { color: '#8b9bb4' },
}
