import { StrengthTrendChart } from './components/StrengthTrendChart'
import { WeeklyVolumeChart } from './components/WeeklyVolumeChart'

function App() {
  return (
    <main>
      <h1>LiftLedger</h1>
      <p style={{ padding: '0 1.5rem' }}>
        Compare volume (sets per muscle) and strength (weekly max e1RM per
        exercise) across periods.
      </p>

      <WeeklyVolumeChart
        title="Volume — Period A"
        defaultStart="2026-02-01"
        defaultEnd="2026-02-28"
      />
      <WeeklyVolumeChart
        title="Volume — Period B"
        defaultStart="2026-04-01"
        defaultEnd="2026-04-30"
      />

      <StrengthTrendChart
        title="Strength — Period A"
        defaultStart="2026-02-01"
        defaultEnd="2026-02-28"
        defaultExerciseName="Bench Press (Barbell)"
      />
      <StrengthTrendChart
        title="Strength — Period B"
        defaultStart="2026-04-01"
        defaultEnd="2026-04-30"
        defaultExerciseName="Bench Press (Barbell)"
      />
    </main>
  )
}

export default App
