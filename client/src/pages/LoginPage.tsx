import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, PenTool, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (role: 'STUDENT' | 'TECHNICIAN') => {
    localStorage.setItem('userRole', role);
    if (role === 'STUDENT') {
      localStorage.setItem('userId', 'stu_123'); // Mock student ID
      navigate('/portal');
    } else {
      localStorage.setItem('userId', 'tech_electrical_01'); // Mock tech ID
      navigate('/dashboard');
    }
    // Dispatch custom event to trigger navbar update immediately
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          Welcome to CampusTriage
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Select your portal to continue.</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
        
        {/* Student Login Card */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin('STUDENT')}
          className="glass-panel"
          style={{ flex: 1, minWidth: '300px', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: '#ffffff', border: '2px solid transparent', transition: 'border-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '50%' }}>
            <User size={48} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Portal</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Report issues around campus, track resolution status, and verify maintenance requests.
          </p>
          <div style={{ marginTop: 'auto', background: '#3b82f6', color: 'white', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 700 }}>
            Login as Student
          </div>
        </motion.div>

        {/* Technician Login Card */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin('TECHNICIAN')}
          className="glass-panel"
          style={{ flex: 1, minWidth: '300px', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: '#ffffff', border: '2px solid transparent', transition: 'border-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d97706'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '50%' }}>
            <PenTool size={48} color="#d97706" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Technician Hub</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Receive assigned tasks, execute dual-handshake PIN verification, and resolve issues.
          </p>
          <div style={{ marginTop: 'auto', background: '#d97706', color: 'white', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 700 }}>
            Login as Technician
          </div>
        </motion.div>

      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
        <ShieldCheck size={16} /> Authenticated by Campus ID
      </motion.div>
    </div>
  );
};

export default LoginPage;
