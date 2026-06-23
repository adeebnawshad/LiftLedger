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
  fetchLoggedExercises,
  fetchStrengthTrends,
} from '../lib/strengthTrends' // api callers
import type {
  LoggedExercise,
  StrengthMetric,
  StrengthTrendRow,
} from '../types/strength'

const CHART_COLOR = '#3b82f6'

type Props = { // define defaults coming from parent
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
  const [exercises, setExercises] = useState<LoggedExercise[]>([]) // list of exercises
  const [selectedExerciseId, setSelectedExerciseId] = useState('') // current selected exercise
  const [rows, setRows] = useState<StrengthTrendRow[]>([]) // plotted points
  const [exerciseLabel, setExerciseLabel] = useState('') // current selected exercise label
  const [metric, setMetric] = useState<StrengthMetric>('E1RM') // current selected metric
  const [loading, setLoading] = useState(false) // loading state
  const [error, setError] = useState<string | null>(null) // error state

  const chartData = useMemo(() => rows, [rows])

  // Fetch exercise list + e1RM series for the selected date range.
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
      if (!logged.exercises.some((e) => e.exerciseId === exerciseId)) { // check the selected exercise is in the list
        const preferred = defaultExerciseName // if the default exercise name is set, find the exercise with the same name
          ? logged.exercises.find((e) => e.exerciseName === defaultExerciseName) 
          : undefined
        exerciseId = (preferred ?? logged.exercises[0]).exerciseId // set the exercise id to the preferred exercise id or the first exercise id
        setSelectedExerciseId(exerciseId)
      }

      const trends = await fetchStrengthTrends({
        exerciseId,
        start,
        end,
      })
      setRows(trends.rows) // set plotted points
      setExerciseLabel(trends.exercise.name) // set current selected exercise name
      setMetric(trends.metric) // set current selected metric
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setRows([]) // clear plotted points
    } finally {
      setLoading(false) // set loading state to false
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
  const seriesLabel =
    metric === 'E1RM' ? 'Max e1RM' : 'Max reps'

  return (
    <section style={{ textAlign: 'left', padding: '1.5rem' }}>
      <h2>{title}</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'end',
          marginBottom: '1rem',
        }}
      >
        <label>
          Start
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ display: 'block', marginTop: '0.25rem' }}
          />
        </label>
        <label>
          End
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={{ display: 'block', marginTop: '0.25rem' }}
          />
        </label>
        <label>
          Exercise
          <select
            value={selectedExerciseId}
            onChange={(e) => onExerciseChange(e.target.value)}
            style={{
              display: 'block',
              marginTop: '0.25rem',
              minWidth: 220,
              maxWidth: 280,
            }}
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
            ))}olka
          </select>
        </label>
        <button type="button" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekStart" />
              <YAxis unit={yUnit} allowDecimals={metric === 'E1RM'} />
              <Tooltip
                formatter={(value) => [`${value}${yUnit.trim()}`, seriesLabel]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={exerciseLabel || seriesLabel}
                stroke={CHART_COLOR}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p>Pick a date range and click Load.</p>
      )}
    </section>
  )
}
