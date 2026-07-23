import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CHART_COLORS,
  axisStyle,
  chartMargin,
  formatExerciseTypeLabel,
  formatMuscleLabel,
  gridStyle,
  muscleColor,
} from '../lib/chartTheme'
import {
  aggregateMuscleByWeek,
  averageWeeklySetTypeTotals,
  fetchWeeklyVolume,
  muscleGroupsInRows,
  pivotTypeForMuscle,
  totalsByWeek,
} from '../lib/weeklyVolume'
import type { WeekSetTypeTotals, WeeklyVolumeRow } from '../types/analytics'

type Props = {
  title: string
  defaultStart: string
  defaultEnd: string
}

type TooltipPayloadItem = {
  name?: string | number
  value?: number | string | ReadonlyArray<number | string>
  color?: string
  fill?: string
  dataKey?: string | number | ((obj: any) => any)
}

type VolumeTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<TooltipPayloadItem>
  label?: string | number
  weekTotalsByDate: Map<string, WeekSetTypeTotals>
}

/** Hover a week → non-zero segments + week totals (sets / compound / isolation). */
function VolumeTooltip({
  active,
  payload,
  label,
  weekTotalsByDate,
}: VolumeTooltipProps) {
  if (!active || !payload?.length) return null

  const items = payload.filter((item) => {
    const raw = item.value
    const value = typeof raw === 'number' ? raw : Number(raw) || 0
    return value > 0
  })

  const weekKey = String(label ?? '')
  const weekTotal = weekTotalsByDate.get(weekKey)

  if (items.length === 0 && !weekTotal) return null

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{weekKey}</div>
      {items.map((item, i) => {
        const raw = item.value
        const value = typeof raw === 'number' ? raw : Number(raw) || 0
        const name = String(item.name ?? item.dataKey ?? '')
        const color = String(item.color ?? item.fill ?? CHART_COLORS.volume)
        return (
          <div key={`${name}-${i}`} className="chart-tooltip__row">
            <span
              className="chart-tooltip__swatch"
              style={{ background: color }}
            />
            <span>
              {name}: {value} {value === 1 ? 'set' : 'sets'}
            </span>
          </div>
        )
      })}
      {weekTotal && weekTotal.total > 0 && (
        <div className="chart-tooltip__summary">
          {weekTotal.total} sets · {weekTotal.compound} compound ·{' '}
          {weekTotal.isolation} isolation
        </div>
      )}
    </div>
  )
}

export function WeeklyVolumeChart({ title, defaultStart, defaultEnd }: Props) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [rows, setRows] = useState<WeeklyVolumeRow[]>([])
  const [visibleMuscles, setVisibleMuscles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allMuscles = useMemo(() => muscleGroupsInRows(rows), [rows])
  const visible = [...visibleMuscles].sort()
  const isSingleMuscleMode = visible.length === 1
  const selectedMuscle = isSingleMuscleMode ? visible[0] : null

  const chartData = useMemo(() => {
    if (isSingleMuscleMode && selectedMuscle) {
      return pivotTypeForMuscle(rows, selectedMuscle)
    }
    return aggregateMuscleByWeek(rows)
  }, [rows, isSingleMuscleMode, selectedMuscle])

  const weekTotals = useMemo(() => totalsByWeek(rows, visible), [rows, visible])
  const averages = useMemo(
    () => averageWeeklySetTypeTotals(weekTotals, start, end),
    [weekTotals, start, end],
  )
  const weekTotalsByDate = useMemo(
    () => new Map(weekTotals.map((w) => [w.weekStart, w])),
    [weekTotals],
  )

  function toggleMuscle(muscle: string) {
    setVisibleMuscles((prev) => {
      const showingAll =
        allMuscles.length > 0 &&
        prev.size === allMuscles.length &&
        allMuscles.every((m) => prev.has(m))

      // All visible → click isolates that muscle
      if (showingAll) {
        return new Set([muscle])
      }

      // Already isolated on this muscle → show all again
      if (prev.size === 1 && prev.has(muscle)) {
        return new Set(allMuscles)
      }

      // Isolated on another muscle (or any partial set) → switch isolate
      return new Set([muscle])
    })
  }

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchWeeklyVolume({ start, end })
      setRows(result.rows)
      setVisibleMuscles(new Set(muscleGroupsInRows(result.rows)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const subtitle =
    isSingleMuscleMode && selectedMuscle
      ? `${formatMuscleLabel(selectedMuscle)} · compound vs isolation · click again to show all`
      : 'Sets per week · Mon–Sun · click a muscle to isolate'

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      <p className="card__subtitle">{subtitle}</p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor={`${title}-start`}>Start</label>
          <input
            id={`${title}-start`}
            className="input"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${title}-end`}>End</label>
          <input
            id={`${title}-end`}
            className="input"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <button type="button" className="btn" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      {allMuscles.length > 0 && (
        <div className="muscle-legend" role="list" aria-label="Muscle groups">
          {allMuscles.map((muscle) => {
            const active = visibleMuscles.has(muscle)
            return (
              <button
                key={muscle}
                type="button"
                role="listitem"
                className={
                  active
                    ? 'muscle-legend__chip muscle-legend__chip--active'
                    : 'muscle-legend__chip'
                }
                aria-pressed={active}
                onClick={() => toggleMuscle(muscle)}
              >
                <span
                  className="muscle-legend__swatch"
                  style={{ background: muscleColor(muscle) }}
                />
                {formatMuscleLabel(muscle)}
              </button>
            )
          })}
        </div>
      )}

      {chartData.length > 0 && (
        <>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={chartMargin}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="weekStart" {...axisStyle} />
              <YAxis allowDecimals={false} {...axisStyle} />
              <Tooltip
                shared
                cursor={{ fill: 'rgba(255, 255, 255, 0.06)' }}
                content={(props) => (
                  <VolumeTooltip
                    active={props.active}
                    payload={props.payload}
                    label={props.label}
                    weekTotalsByDate={weekTotalsByDate}
                  />
                )}
              />
              {isSingleMuscleMode && (
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.tick }}
                />
              )}
              {isSingleMuscleMode && selectedMuscle ? (
                <>
                  <Bar
                    dataKey="COMPOUND"
                    stackId="volume"
                    fill={muscleColor(selectedMuscle)}
                    stroke="#0e1110"
                    strokeWidth={2}
                    name={formatExerciseTypeLabel('COMPOUND')}
                  />
                  <Bar
                    dataKey="ISOLATION"
                    stackId="volume"
                    fill={muscleColor(selectedMuscle)}
                    stroke="#0e1110"
                    strokeWidth={2}
                    name={formatExerciseTypeLabel('ISOLATION')}
                  />
                </>
              ) : (
                visible.map((muscle) => (
                  <Bar
                    key={muscle}
                    dataKey={muscle}
                    stackId="volume"
                    fill={muscleColor(muscle)}
                    name={formatMuscleLabel(muscle)}
                  />
                ))
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="volume-averages">
          <span className="volume-averages__label">Avg / week</span>
          <span>
            {averages.avgTotal} sets · {averages.avgCompound} compound ·{' '}
            {averages.avgIsolation} isolation
          </span>
          <span className="volume-averages__meta">
            ({averages.weekCount}{' '}
            {averages.weekCount === 1 ? 'week' : 'weeks'})
          </span>
        </p>
        </>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="empty-state">Pick a date range and click Load.</p>
      )}
    </section>
  )
}
