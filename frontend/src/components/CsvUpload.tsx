import { useState, type SubmitEvent } from 'react'

type ImportStats = {
  workoutsCreated?: number
  setsImported?: number
  setsSkipped?: number
}

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ImportStats | null>(null)

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
      const body = new FormData() // new FormData() is a built-in JavaScript object that allows you to easily construct a set of key-value pairs representing form fields and their values.
      body.append('file', file) // append() is a method that adds a new key-value pair to the FormData object.

      const res = await fetch('/api/import', { method: 'POST', body })
      // You don’t set Content-Type yourself. The browser sets it to something like:
      // multipart/form-data; boundary=----WebKitFormBoundary...
      // and includes the file bytes in the body
      // the file bytes are the actual binary data of the file, not the file name or other metadata.

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setStats({
        workoutsCreated: data.stats?.workoutsCreated,
        setsImported: data.stats?.setsImported,
        setsSkipped: data.stats?.setsSkipped,
      })
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

      <form className="toolbar" onSubmit={onSubmit}>
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
      </form>

      {error && <p className="alert alert--error">{error}</p>}

      {stats && (
        <p className="alert alert--success">
          Imported {stats.workoutsCreated ?? 0} workouts,{' '}
          {stats.setsImported ?? 0} sets
          {stats.setsSkipped != null && stats.setsSkipped > 0
            ? ` (${stats.setsSkipped} skipped)`
            : ''}
          .
        </p>
      )}
    </section>
  )
}
