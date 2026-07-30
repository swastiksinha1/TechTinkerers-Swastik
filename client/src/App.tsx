import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';
import StudentPortal from './pages/StudentPortal';
import TechnicianDashboard from './pages/TechnicianDashboard';
import CampusMap from './pages/CampusMap';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity color="var(--primary-color)" size={28} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CampusTriage</h1>
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Student Portal
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              Technician Dashboard
            </NavLink>
            <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
              Campus Heatmap
            </NavLink>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<StudentPortal />} />
            <Route path="/dashboard" element={<TechnicianDashboard />} />
            <Route path="/map" element={<CampusMap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
