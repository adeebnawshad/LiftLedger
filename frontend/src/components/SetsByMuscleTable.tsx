import { useEffect, useState } from 'react'
import { fetchSetsByMuscle, MUSCLE_GROUPS } from '../lib/setsByMuscle'
import type { MuscleGroup, SetsByMuscleRow } from '../types/setsByMuscle'

type Props = {
  title: string
  defaultStart: string
  defaultEnd: string
}

export function SetsByMuscleTable({
  title,
  defaultStart,
  defaultEnd,
}: Props) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('CHEST')
  const [rows, setRows] = useState<SetsByMuscleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSetsByMuscle({ muscleGroup, start, end })
      setRows(result.rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="card card--full">
      <h2 className="card__title">{title}</h2>
      <p className="card__subtitle">
        Sets for a muscle group in a date range
      </p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="sets-muscle-start">Start</label>
          <input
            id="sets-muscle-start"
            className="input"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="sets-muscle-end">End</label>
          <input
            id="sets-muscle-end"
            className="input"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="sets-muscle-group">Muscle group</label>
          <select
            id="sets-muscle-group"
            className="select"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)} // e.target.value is the value of the selected option. e.target is the select element.
          >
            {MUSCLE_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      {rows.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
                <th>Weight</th>
                <th>Reps</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${row.date}-${row.exerciseName}-${i}`}>
                  <td>{row.date}</td>
                  <td>{row.exerciseName}</td>
                  <td>
                    {row.weightAmount == null
                      ? '—'
                      : `${row.weightAmount} ${row.weightUnit ?? ''}`.trim()}
                  </td>
                  <td>{row.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="card__subtitle">{rows.length} sets in range</p>
        </>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="empty-state">No sets in range for this muscle group.</p>
      )}
    </section>
  )
}
