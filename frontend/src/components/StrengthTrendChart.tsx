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
  tooltipStyle,
} from '../lib/chartTheme'
import {
  fetchLoggedExercises,
  fetchStrengthTrends,
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

  const chartData = useMemo(() => rows, [rows])
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

  const yUnit = metric === 'E1RM' ? ' kg' : ' reps'
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
              <YAxis unit={yUnit} allowDecimals={metric === 'E1RM'} {...axisStyle} />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [`${value}${yUnit.trim()}`, seriesLabel]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.tick }} />
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
