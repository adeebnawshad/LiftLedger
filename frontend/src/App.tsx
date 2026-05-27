import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState<string>('loading…')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setHealth(await res.text())
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Request failed')
      })
  }, [])

  return (
    <div>
      {error ? <p>API error: {error}</p> : <p>API health: {health}</p>}
    </div>
  )
}

export default App
