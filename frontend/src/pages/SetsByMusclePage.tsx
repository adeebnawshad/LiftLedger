import { SetsByMuscleTable } from '../components/SetsByMuscleTable'

const PERIOD_A = { start: '2026-01-17', end: '2026-04-04' }
const PERIOD_B = { start: '2026-01-17', end: '2026-04-04' }

export function SetsByMusclePage() {
  return (
    <div className="dashboard">
      <div className="section-grid">
        <SetsByMuscleTable
          title="Sets by Muscle — Period A"
          defaultStart={PERIOD_A.start}
          defaultEnd={PERIOD_A.end}
        />
        <SetsByMuscleTable
          title="Sets by Muscle — Period B"
          defaultStart={PERIOD_B.start}
          defaultEnd={PERIOD_B.end}
        />
      </div>
    </div>
  )
}
