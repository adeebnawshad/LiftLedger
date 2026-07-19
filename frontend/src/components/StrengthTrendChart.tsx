import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CHART_COLORS,
  axisStyle,
  chartMargin,
  gridStyle,
} from '../lib/chartTheme'
import {
  fetchLoggedExercises,
  fetchStrengthTrends,
  formatPctFromFirst,
  withPctChangeFromFirst,
  type StrengthTrendChartRow,
} from '../lib/strengthTrends'
import type {
  LoggedExercise,
  StrengthMetric,
  StrengthTrendRow,
} from '../types/strength'

type Props = {
  title: string
  defaultStart: string
  defaultEnd: string
  defaultExerciseName?: string
}

type TooltipPayloadItem = {
  name?: string | number
  value?: number | string | ReadonlyArray<number | string>
  color?: string
  payload?: StrengthTrendChartRow
}

type StrengthTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<TooltipPayloadItem>
  label?: string | number
  yUnit: string
  seriesLabel: string
}

function StrengthTooltip({
  active,
  payload,
  label,
  yUnit,
  seriesLabel,
}: StrengthTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const row = item.payload
  const raw = item.value
  const value = typeof raw === 'number' ? raw : Number(raw) || 0
  const pct = row?.pctFromFirst ?? 0
  const unit = yUnit.trim()

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{String(label ?? '')}</div>
      <div className="chart-tooltip__row">
        <span
          className="chart-tooltip__swatch"
          style={{ background: CHART_COLORS.strength }}
        />
        <span>
          {seriesLabel}: {value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div className="chart-tooltip__summary">
        {formatPctFromFirst(pct)} from first week
      </div>
    </div>
  )
}

export function StrengthTrendChart({
  title,
  defaultStart,
  defaultEnd,
  defaultExerciseName,
}: Props) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [exercises, setExercises] = useState<LoggedExercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [rows, setRows] = useState<StrengthTrendRow[]>([])
  const [exerciseLabel, setExerciseLabel] = useState('')
  const [metric, setMetric] = useState<StrengthMetric>('E1RM')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chartData = useMemo(() => withPctChangeFromFirst(rows), [rows])
  const slug = title.replace(/\s+/g, '-').toLowerCase()

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const logged = await fetchLoggedExercises({ start, end })
      setExercises(logged.exercises)

      if (!logged.exercises.length) {
        setRows([])
        setSelectedExerciseId('')
        setExerciseLabel('')
        return
      }

      let exerciseId = selectedExerciseId
      if (!logged.exercises.some((e) => e.exerciseId === exerciseId)) {
        const preferred = defaultExerciseName
          ? logged.exercises.find((e) => e.exerciseName === defaultExerciseName)
          : undefined
        exerciseId = (preferred ?? logged.exercises[0]).exerciseId
        setSelectedExerciseId(exerciseId)
      }

      const trends = await fetchStrengthTrends({ exerciseId, start, end })
      setRows(trends.rows)
      setExerciseLabel(trends.exercise.name)
      setMetric(trends.metric)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onExerciseChange(exerciseId: string) {
    setSelectedExerciseId(exerciseId)
    if (!exerciseId) return

    setLoading(true)
    setError(null)
    try {
      const trends = await fetchStrengthTrends({ exerciseId, start, end })
      setRows(trends.rows)
      setExerciseLabel(trends.exercise.name)
      setMetric(trends.metric)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const yUnit = metric === 'E1RM' ? ' lbs' : ' reps'
  const seriesLabel = metric === 'E1RM' ? 'Max e1RM' : 'Max reps'

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      <p className="card__subtitle">Weekly peak strength per exercise</p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor={`${slug}-start`}>Start</label>
          <input
            id={`${slug}-start`}
            className="input"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${slug}-end`}>End</label>
          <input
            id={`${slug}-end`}
            className="input"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div className="field field--wide">
          <label htmlFor={`${slug}-exercise`}>Exercise</label>
          <select
            id={`${slug}-exercise`}
            className="select"
            value={selectedExerciseId}
            onChange={(e) => onExerciseChange(e.target.value)}
            disabled={loading || !exercises.length}
          >
            {!exercises.length && (
              <option value="">
                {loading ? 'Loading…' : 'No exercises in range'}
              </option>
            )}
            {exercises.map((e) => (
              <option key={e.exerciseId} value={e.exerciseId}>
                {e.exerciseName}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      {chartData.length > 0 && (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={chartMargin}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="weekStart" {...axisStyle} />
              <YAxis
                unit={yUnit}
                allowDecimals={metric === 'E1RM'}
                {...axisStyle}
              />
              <Tooltip
                content={(props) => (
                  <StrengthTooltip
                    active={props.active}
                    payload={props.payload}
                    label={props.label}
                    yUnit={yUnit}
                    seriesLabel={seriesLabel}
                  />
                )}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.tick }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name={exerciseLabel || seriesLabel}
                stroke={CHART_COLORS.strength}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.strength }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="empty-state">Pick a date range and click Load.</p>
      )}
    </section>
  )
}
