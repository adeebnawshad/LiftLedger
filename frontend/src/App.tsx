import { CsvUpload } from './components/CsvUpload'
import { MeasurementChart } from './components/MeasurementChart'
import { PeriodInsightsPanel } from './components/PeriodInsightsPanel'
import { StrengthTrendChart } from './components/StrengthTrendChart'
import { WeeklyVolumeChart } from './components/WeeklyVolumeChart'

const PERIOD_A = { start: '2026-02-01', end: '2026-02-28', label: 'Period A' }
const PERIOD_B = { start: '2026-04-01', end: '2026-04-30', label: 'Period B' }

function App() {
  return (
    <div className="app">
      <header className="hero">
        <span className="hero__badge">Training analytics</span>
        <h1>LiftLedger</h1>
        <p>
          Compare volume, strength, and size across periods — with rule-based
          insights on progression, plateaus, and volume–strength mismatches.
        </p>
      </header>

      <div className="dashboard">
        <CsvUpload />

        <PeriodInsightsPanel periodA={PERIOD_A} periodB={PERIOD_B} />

        <div className="section-grid">
          <WeeklyVolumeChart
            title="Volume — Period A"
            defaultStart={PERIOD_A.start}
            defaultEnd={PERIOD_A.end}
          />
          <WeeklyVolumeChart
            title="Volume — Period B"
            defaultStart={PERIOD_B.start}
            defaultEnd={PERIOD_B.end}
          />
        </div>

        <div className="section-grid">
          <StrengthTrendChart
            title="Strength — Period A"
            defaultStart={PERIOD_A.start}
            defaultEnd={PERIOD_A.end}
            defaultExerciseName="Bench Press (Barbell)"
          />
          <StrengthTrendChart
            title="Strength — Period B"
            defaultStart={PERIOD_B.start}
            defaultEnd={PERIOD_B.end}
            defaultExerciseName="Bench Press (Barbell)"
          />
        </div>

        <div className="section-grid">
          <MeasurementChart
            title="Size — Body weight"
            defaultStart="2026-02-01"
            defaultEnd="2026-04-30"
            defaultSite="BODY_WEIGHT"
          />
          <MeasurementChart
            title="Size — Left arm"
            defaultStart="2026-02-01"
            defaultEnd="2026-04-30"
            defaultSite="LEFT_ARM"
          />
        </div>
      </div>
    </div>
  )
}

export default App
