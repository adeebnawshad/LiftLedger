export const CHART_COLORS = {
  volume: '#a855f7',
  strength: '#3b82f6',
  measurement: '#8b5cf6',
  grid: '#2a3548',
  axis: '#64748b',
  tick: '#8b9bb4',
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
