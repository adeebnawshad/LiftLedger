import { NavLink, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { DataPage } from './pages/DataPage'
import { SetsByMusclePage } from './pages/SetsByMusclePage'

function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="hero__eyebrow">Training analytics</p>
        <h1 className="hero__brand">
          Lift<span className="hero__brand-accent">Ledger</span>
        </h1>
        <p className="hero__tagline">
          Track volume, strength, and size across training blocks.
        </p>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className="nav__link">
            Dashboard
          </NavLink>
          <NavLink to="/data" className="nav__link">
            Log data
          </NavLink>
          <NavLink to="/sets-by-muscle" className="nav__link">
            Sets by muscle
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/sets-by-muscle" element={<SetsByMusclePage />} />
      </Routes>
    </div>
  )
}

export default App
