import { CsvUpload } from '../components/CsvUpload'
import { MeasurementChart } from '../components/MeasurementChart'
import { MeasurementScatter } from '../components/MeasurementScatter'
import { MeasurementUpload } from '../components/MeasurementUpload'
import { StrengthTrendChart } from '../components/StrengthTrendChart'
import { WaistMeasurementScatter } from '../components/WaistMeasurementScatter'
import { WeeklyVolumeChart } from '../components/WeeklyVolumeChart'

const PERIOD_A = { start: '2026-01-17', end: '2026-04-04', label: 'Period A' }
const PERIOD_B = { start: '2026-01-17', end: '2026-04-04', label: 'Period B' }

export function Dashboard() {
  return (
    <div className="dashboard">
      <CsvUpload />
      <MeasurementUpload />

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
          defaultSite="BODY_WEIGHT"
        />
        <MeasurementChart
          title="Size — Left arm"
          defaultSite="LEFT_ARM"
        />
        <MeasurementScatter
          title="Bodyweight vs. measurement"
          defaultSite="LEFT_ARM"
        />
        <WaistMeasurementScatter
          title="Waist vs. measurement"
          defaultSite="CHEST"
        />
      </div>
    </div>
  )
}
