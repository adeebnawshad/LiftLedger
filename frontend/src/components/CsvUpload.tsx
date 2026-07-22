import { useState, type SubmitEvent } from 'react'

type ImportMode = 'replace' | 'append'

type ImportStats = {
  workoutsCreated?: number
  setsImported?: number
  setsSkipped?: number
  mode?: ImportMode
}

const LAST_IMPORT_KEY = 'liftledger:last-csv-import'

function readLastImport(): ImportStats | null {
  try {
    const raw = sessionStorage.getItem(LAST_IMPORT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ImportStats
  } catch {
    return null
  }
}

function writeLastImport(stats: ImportStats) {
  try {
    sessionStorage.setItem(LAST_IMPORT_KEY, JSON.stringify(stats))
  } catch {
    // ignore quota / private mode
  }
}

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<ImportMode>('replace')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ImportStats | null>(() => readLastImport())

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) {
      setError('Choose a Hevy CSV file first.')
      return
    }

    setLoading(true)
    setError(null)
    setStats(null)

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('mode', mode)

      const res = await fetch('/api/import', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.detail
            ? `${data.error ?? 'Import failed'}: ${data.detail}`
            : (data.error ?? `HTTP ${res.status}`),
        )
      }

      const next: ImportStats = {
        workoutsCreated: data.stats?.workoutsCreated,
        setsImported: data.stats?.setsImported,
        setsSkipped: data.stats?.setsSkipped,
        mode: data.mode ?? mode,
      }
      writeLastImport(next)
      setStats(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card card--full">
      <h2 className="card__title">Import Hevy CSV</h2>
      <p className="card__subtitle">
        Upload a workout export to populate your analytics
      </p>

      <form onSubmit={onSubmit}>
        <div className="toolbar">
          <div className="field">
            <label htmlFor="csv-file">CSV file</label>
            <input
              id="csv-file"
              className="input"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <button type="submit" className="btn" disabled={loading || !file}>
            {loading ? 'Importing…' : 'Upload & import'}
          </button>
        </div>

        <fieldset className="import-mode">
          <legend className="import-mode__legend">Import mode</legend>
          <label className="import-mode__option">
            <input
              type="radio"
              name="import-mode"
              value="replace"
              checked={mode === 'replace'}
              onChange={() => setMode('replace')}
            />
            <span>
              <strong>Replace</strong> all workout history (recommended when
              re-exporting from Hevy)
            </span>
          </label>
          <label className="import-mode__option">
            <input
              type="radio"
              name="import-mode"
              value="append"
              checked={mode === 'append'}
              onChange={() => setMode('append')}
            />
            <span>
              <strong>Append</strong> to existing workouts (can double-count if
              you upload the same export twice)
            </span>
          </label>
        </fieldset>
      </form>

      {loading && (
        <p className="alert">
          Large exports can take several minutes. Stay on this page until the
          result appears — leaving or refreshing cancels the browser wait even
          if the server keeps going.
        </p>
      )}

      {error && <p className="alert alert--error">{error}</p>}

      {stats && (
        <p className="alert alert--success">
          {stats.mode === 'replace' ? 'Replaced and imported' : 'Appended'}{' '}
          {stats.workoutsCreated ?? 0} workouts, {stats.setsImported ?? 0} sets
          {` (${stats.setsSkipped ?? 0} skipped)`}.
        </p>
      )}
    </section>
  )
}
