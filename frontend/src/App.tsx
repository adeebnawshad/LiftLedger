import { WeeklyVolumeChart } from './components/WeeklyVolumeChart'

function App() {
  return (
    <main>
      <h1>LiftLedger</h1>
      <p style={{ padding: '0 1.5rem' }}>
        Weekly hard sets by muscle — compare periods side by side.
      </p>

      <WeeklyVolumeChart
        title="Period A"
        defaultStart="2026-02-01"
        defaultEnd="2026-02-28"
      />
      <WeeklyVolumeChart
        title="Period B"
        defaultStart="2026-04-01"
        defaultEnd="2026-04-30"
      />
    </main>
  )
}

export default App
