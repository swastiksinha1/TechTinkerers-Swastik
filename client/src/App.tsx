import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import StudentPortal from './pages/StudentPortal';
import TechnicianDashboard from './pages/TechnicianDashboard';
import CampusMap from './pages/CampusMap';
import LandingPage from './pages/LandingPage';
import PublicFeed from './pages/PublicFeed';
import LoginPage from './pages/LoginPage';
import AdminLiveDashboard from './pages/AdminLiveDashboard';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  const [role, setRole] = useState<string | null>(localStorage.getItem('userRole'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('userRole'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setRole(null);
    navigate('/');
  };

  if (isLandingPage) {
    return <LandingPage />;
  }

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <div className="app-container relative">
      <Toaster position="bottom-right" theme="light" />
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.75)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Activity color="var(--primary-color)" size={28} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CampusTriage</h1>
          </div>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
            
            {role === 'STUDENT' && (
              <NavLink to="/portal" className={({ isActive }) => isActive ? "active" : ""}>
                Student Portal
              </NavLink>
            )}

            {role === 'TECHNICIAN' && (
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                Technician Dashboard
              </NavLink>
            )}

            <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
              Campus Heatmap
            </NavLink>
            <NavLink to="/feed" className={({ isActive }) => isActive ? "active" : ""}>
              Public Feed
            </NavLink>
            <NavLink to="/live" className={({ isActive }) => isActive ? "active" : ""}>
              Live NOC
            </NavLink>

            {role ? (
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}>
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button onClick={() => navigate('/login')} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                Login
              </button>
            )}
          </div>
        </nav>

        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
              <Route path="/portal" element={role === 'STUDENT' ? <PageWrapper><StudentPortal /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={role === 'TECHNICIAN' ? <PageWrapper><TechnicianDashboard /></PageWrapper> : <Navigate to="/login" />} />
              <Route path="/map" element={<PageWrapper><CampusMap /></PageWrapper>} />
              <Route path="/feed" element={<PageWrapper><PublicFeed /></PageWrapper>} />
              <Route path="/live" element={<PageWrapper><AdminLiveDashboard /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
