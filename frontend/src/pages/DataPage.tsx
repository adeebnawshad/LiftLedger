import { CsvUpload } from '../components/CsvUpload'
import { MeasurementUpload } from '../components/MeasurementUpload'

export function DataPage() {
  return (
    <div className="dashboard">
      <CsvUpload />
      <MeasurementUpload />
    </div>
  )
}
