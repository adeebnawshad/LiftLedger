import { useEffect, useState } from 'react'
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
  MEASUREMENT_SITES,
  fetchMeasurementTrends,
} from '../lib/measurements'
import type { MeasurementRow, MeasurementSite } from '../types/measurements'

type Props = {
  title: string
  defaultStart: string
  defaultEnd: string
  defaultSite?: MeasurementSite
}

export function MeasurementChart({
  title,
  defaultStart,
  defaultEnd,
  defaultSite = 'BODY_WEIGHT',
}: Props) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [site, setSite] = useState<MeasurementSite>(defaultSite)
  const [rows, setRows] = useState<MeasurementRow[]>([])
  const [unit, setUnit] = useState('kg')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slug = title.replace(/\s+/g, '-').toLowerCase()

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchMeasurementTrends({ site, start, end })
      setRows(result.rows)
      setUnit(result.unit)
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

  const siteLabel =
    MEASUREMENT_SITES.find((s) => s.value === site)?.label ?? site

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      <p className="card__subtitle">Weekly average body measurements</p>

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
        <div className="field">
          <label htmlFor={`${slug}-site`}>Site</label>
          <select // select is a form element that allows the user to select one option from a list of options
            id={`${slug}-site`}
            className="select" 
            value={site}
            onChange={(e) => setSite(e.target.value as MeasurementSite)}
          >
            {MEASUREMENT_SITES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
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
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={chartMargin}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="weekStart" {...axisStyle} />
              <YAxis unit={` ${unit}`} allowDecimals {...axisStyle} />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [`${value} ${unit}`, siteLabel]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.tick }} />
              <Line
                type="monotone"
                dataKey="value"
                name={siteLabel}
                stroke={CHART_COLORS.measurement}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.measurement }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="empty-state">
          No measurements in range. Run{' '}
          <code>npm run db:seed:measurements</code> for sample data.
        </p>
      )}
    </section>
  )
}
