export const CHART_COLORS = {
  volume: '#ff6b2c',
  strength: '#5eb8ff',
  measurement: '#3dd6c3',
  grid: '#2a332e',
  axis: '#6b756f',
  tick: '#9aa399',
}

/** Stable fills for stacked weekly-volume bars (muscle mode). */
export const MUSCLE_COLORS: Record<string, string> = {
  CHEST: '#5eb8ff',
  BACK: '#3dd6c3',
  UPPER_TRAPS: '#38bdf8',
  QUADS: '#e8c547',
  HAMSTRINGS: '#ff8a3d',
  GLUTES: '#f472b6',
  CALVES: '#a3e635',
  SHOULDERS: '#94a3b8',
  BICEPS: '#f87171',
  TRICEPS: '#fb7185',
  FOREARMS: '#a8b4a8',
  CORE: '#4ade80',
  OTHER: '#6b756f',
}

/** Stacked compound vs isolation (single-muscle mode). */
export const TYPE_COLORS = {
  COMPOUND: '#5eb8ff',
  ISOLATION: '#ff6b2c',
} as const

const FALLBACK_MUSCLE_COLOR = '#6b756f'

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
    background: '#171c19',
    border: '1px solid #2a332e',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#f2f0ea',
  },
  labelStyle: { color: '#9aa399' },
}
