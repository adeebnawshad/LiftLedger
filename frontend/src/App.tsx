import { NavLink, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { SetsByMusclePage } from './pages/SetsByMusclePage'

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
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className="nav__link">
            Dashboard
          </NavLink>
          <NavLink to="/sets-by-muscle" className="nav__link">
            Logs breakdown by muscle
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sets-by-muscle" element={<SetsByMusclePage />} />
      </Routes>
    </div>
  )
}

export default App
