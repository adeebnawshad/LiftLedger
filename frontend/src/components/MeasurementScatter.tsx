import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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
  GIRTH_MEASUREMENT_SITES,
  fetchMeasurementScatter,
} from '../lib/measurements'
import type {
  MeasurementScatterRow,
  MeasurementSite,
} from '../types/measurements'

type GirthSite = Exclude<MeasurementSite, 'BODY_WEIGHT'>

type Props = {
  title: string
  defaultSite?: GirthSite
}

function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

type ScatterTooltipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: MeasurementScatterRow }>
}

function ScatterTooltip({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  if (!point) return null

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">
        {formatShortDate(point.measuredAt)}
      </div>
      <div className="chart-tooltip__row">
        <span
          className="chart-tooltip__swatch"
          style={{ background: CHART_COLORS.strength }}
        />
        <span>
          {point.bodyweight} lb, {point.measurement}&quot;
        </span>
      </div>
    </div>
  )
}

export function MeasurementScatter({
  title,
  defaultSite = 'CHEST',
}: Props) {
  const [site, setSite] = useState<GirthSite>(defaultSite)
  const [rows, setRows] = useState<MeasurementScatterRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slug = title.replace(/\s+/g, '-').toLowerCase()

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchMeasurementScatter({ site })
      setRows(result.rows)
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
    GIRTH_MEASUREMENT_SITES.find((s) => s.value === site)?.label ?? site

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      <p className="card__subtitle">
        Bodyweight vs. girth — date only in tooltip
      </p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor={`${slug}-site`}>Site</label>
          <select
            id={`${slug}-site`}
            className="select"
            value={site}
            onChange={(e) => setSite(e.target.value as GirthSite)}
          >
            {GIRTH_MEASUREMENT_SITES.map((s) => (
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
            <ScatterChart margin={chartMargin}>
              <CartesianGrid {...gridStyle} />
              <XAxis
                type="number"
                dataKey="bodyweight"
                name="Bodyweight"
                unit=" lb"
                {...axisStyle}
              />
              <YAxis
                type="number"
                dataKey="measurement"
                name={siteLabel}
                unit='"'
                allowDecimals
                {...axisStyle}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ScatterTooltip />}
              />
              <Scatter
                name={siteLabel}
                data={rows}
                fill={CHART_COLORS.strength}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="empty-state">
          No same-day bodyweight + {siteLabel.toLowerCase()} pairs yet. Log both
          on the same date to see points here.
        </p>
      )}
    </section>
  )
}
