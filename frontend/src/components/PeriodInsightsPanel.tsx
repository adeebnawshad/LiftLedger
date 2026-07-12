import { useEffect, useState } from 'react'
import { fetchPeriodInsights } from '../lib/insights'
import type { Insight } from '../types/insights'

const SEVERITY_CLASS: Record<Insight['severity'], string> = {
  positive: 'insight-card--positive',
  neutral: 'insight-card--neutral',
  warning: 'insight-card--warning',
}

type Props = {
  periodA: { start: string; end: string; label: string }
  periodB: { start: string; end: string; label: string }
  exerciseId?: string
}

export function PeriodInsightsPanel({ periodA, periodB, exerciseId }: Props) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPeriodInsights({
        startA: periodA.start,
        endA: periodA.end,
        startB: periodB.start,
        endB: periodB.end,
        exerciseId,
      })
      setInsights(result.insights)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights')
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [periodA.start, periodA.end, periodB.start, periodB.end, exerciseId])

  return (
    <section className="card card--full">
      <div className="card__header">
        <h2 className="card__title">Insights</h2>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>
      <p className="card__subtitle">
        {periodA.label} ({periodA.start} → {periodA.end}) vs {periodB.label} (
        {periodB.start} → {periodB.end})
      </p>

      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && insights.length === 0 && (
        <p className="empty-state">
          No insights yet. Import workouts and refresh.
        </p>
      )}

      <ul className="insight-list">
        {insights.map((insight) => (
          <li
            key={`${insight.type}-${insight.title}`}
            className={`insight-card ${SEVERITY_CLASS[insight.severity]}`}
          >
            <strong>{insight.title}</strong>
            <span>{insight.message}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
