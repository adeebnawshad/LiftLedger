import { useMemo, useState } from 'react'
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
  fetchWeeklyVolume, // Fetch the weekly volume data from the backend.
  muscleGroupsInRows, // Get all unique muscle groups in the rows.
  pivotRowsByWeek, // Flat API rows → one object per week for Recharts.
} from '../lib/weeklyVolume'
import type { WeeklyVolumeRow } from '../types/analytics' // Type for the weekly volume data in the backend.

const CHART_COLORS = [
  '#aa3bff',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
]

type Props = { // Props are the properties that are passed to the component.
  title: string // The title of the chart.
  defaultStart: string // The default start date.
  defaultEnd: string // The default end date.
}

export function WeeklyVolumeChart({ title, defaultStart, defaultEnd }: Props) { // The WeeklyVolumeChart component.
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [rows, setRows] = useState<WeeklyVolumeRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMuscle, setSelectedMuscle] = useState('CHEST')

  const muscles = useMemo(() => muscleGroupsInRows(rows), [rows]) // Only rerun muscleGroupsInRows if the rows change.
  const chartData = useMemo(() => pivotRowsByWeek(rows), [rows]) // Only rerun pivotRowsByWeek if the rows change.

  // Fetch volume for start/end from the API and update rows + muscle dropdown.
  async function load() {
    setLoading(true)
    setError(null)
    try {            
      const result = await fetchWeeklyVolume({ start, end }) // Fetch the weekly volume data from the backend.
      setRows(result.rows) // set the rows to the result rows.
      const groups = muscleGroupsInRows(result.rows) // get the muscle groups from the result rows.
      if (groups.length && !groups.includes(selectedMuscle)) { // if the groups length is greater than 0 and the selected muscle is not in the groups, set the selected muscle to the first muscle group.
        setSelectedMuscle(groups[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
      setRows([]) // set the rows to an empty array.
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ textAlign: 'left', padding: '1.5rem' }}>
      <h2>{title}</h2>

      <div // The div is the container for the start, end, and muscle select and load button.
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
            onChange={(e) => setStart(e.target.value)} // Set the start date to the value of the input.
            style={{ display: 'block', marginTop: '0.25rem' }}
          />
        </label>
        <label>
          End
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)} // Set the end date to the value of the input.
            style={{ display: 'block', marginTop: '0.25rem' }}
          />
        </label>
        <label> 
          Muscle
          <select // The select is the dropdown for the muscle groups.
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)} // Set the selected muscle to the value of the input.
            style={{ display: 'block', marginTop: '0.25rem' }}
          >
            {(muscles.length ? muscles : [selectedMuscle]).map((m) => ( // If muscles length is greater than 0, map the muscles to the options, otherwise map the selected muscle to the options - placeholder for when no muscles are available.
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekStart" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMuscle}
                stroke={CHART_COLORS[0]}
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
