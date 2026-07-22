import { useState, type SubmitEvent } from 'react'
import {
  MEASUREMENT_SITES,
  createMeasurement,
} from '../lib/measurements'
import type { MeasurementSite } from '../types/measurements'

function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function unitForSite(site: MeasurementSite): string {
  return site === 'BODY_WEIGHT' ? 'lbs' : 'in'
}

export function MeasurementUpload() {
  // Default to today; user can change the date if needed
  const [measuredAt, setMeasuredAt] = useState(() => todayIsoDate())

  // Form field state: only stores sites the user typed.
  // Partial<Record<MeasurementSite, string>> ≈ { CHEST?: string, WAIST?: string, ... }
  // Example after typing: { CHEST: '41.5', WAIST: '32' }
  // Kept as strings while typing; converted to numbers on Save.
  const [values, setValues] = useState<Partial<Record<MeasurementSite, string>>>(
    {},
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Update one site's input. [site] is a computed key — if site is 'CHEST',
  // this is like { ...prev, CHEST: raw }. Spreading prev keeps other fields.
  function setValue(site: MeasurementSite, raw: string) {
    setValues((prev) => ({ ...prev, [site]: raw }))
  }

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Stop the browser's default form submit (full page reload / navigate)
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!measuredAt) {
      setError('Choose a date.')
      return
    }

    // Build the list of filled, valid measurements to POST
    const entries: { site: MeasurementSite; value: number }[] = []

    // MEASUREMENT_SITES items look like { value: 'CHEST', label: 'Chest' }.
    // Rename .value → site so it doesn't clash with the numeric `value` below.
    // `values` (plural) is the form state; `value`/`site` are per-field.
    for (const { value: site } of MEASUREMENT_SITES) {
      const raw = values[site]?.trim() // same `site` key into form state
      if (!raw) continue // blank = skip (fields are optional)

      const value = Number(raw)
      if (!Number.isFinite(value) || value <= 0) {
        setError(`Invalid value for ${site.replaceAll('_', ' ').toLowerCase()}.`)
        return
      }
      entries.push({ site, value })
    }

    if (entries.length === 0) {
      setError('Enter at least one measurement.')
      return
    }

    setLoading(true)
    try {
      // Fire all creates in parallel; wait until every POST finishes.
      // If any one fails, Promise.all rejects and we hit catch.
      await Promise.all(
        entries.map((entry) =>
          createMeasurement({
            measuredAt,
            site: entry.site,
            value: entry.value,
          }),
        ),
      )
      setSuccess(
        `Saved ${entries.length} measurement${entries.length === 1 ? '' : 's'}.`,
      )
      setValues({}) // clear inputs; keep the date
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card card--full">
      <h2 className="card__title">Log measurements</h2>
      <p className="card__subtitle">
        Pick a date, fill in any sites you measured (lbs / inches), then Save
      </p>

      <form onSubmit={onSubmit}>
        <div className="toolbar">
          <div className="field">
            <label htmlFor="measurement-date">Date</label>
            <input
              id="measurement-date"
              className="input"
              type="date"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={loading || !measuredAt}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className="measurement-form-grid">
          {MEASUREMENT_SITES.map((s) => {
            const unit = unitForSite(s.value)
            const id = `measurement-${s.value.toLowerCase()}`
            return (
              <div className="field" key={s.value}>
                <label htmlFor={id}>
                  {s.label} ({unit})
                </label>
                {/*
                  Controlled input: React state is the source of truth.
                  - value: what to show (from `values`, already set as you type — before Save)
                  - onChange: when you type, write into `values` via setValue
                  Without both, the box and state get out of sync.
                */}
                <input
                  id={id}
                  className="input"
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="0"
                  placeholder="—"
                  value={values[s.value] ?? ''} // values is the form state, s.value is the site (CHEST, WAIST, etc.) so values[s.value] is the value of the site. We see this in the box when we type.
                  onChange={(e) => setValue(s.value, e.target.value)} // when you type, write into `values` via setValue. s.value is the site (CHEST, WAIST, etc.).
                />
              </div>
            )
          })}
        </div>
      </form>

      {error && <p className="alert alert--error">{error}</p>}
      {success && <p className="alert alert--success">{success}</p>}
    </section>
  )
}
