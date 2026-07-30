import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Zap } from 'lucide-react';

const AdminLiveDashboard = () => {
  const [data, setData] = useState<any>({ recentActivity: [], stats: {}, urgentIssues: [] });
  const [loading, setLoading] = useState(true);

  const fetchLiveFeed = async () => {
    try {
      const response = await fetch('/api/complaints/live-dashboard');
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchLiveFeed();
      const interval = setInterval(fetchLiveFeed, 500); // 0.5s polling for ultra-fast live updates
      return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#3b82f6';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#ffffff', color: '#0f172a', padding: '2rem 4rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
            <Activity color="#000000" /> 
            Mission Control
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', fontWeight: 500 }}>NOC Live Telemetry & Incident Escalation</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', color: '#059669', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #d1fae5' }}>
          <span className="animate-pulse" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
          System Online
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
        {[
          { label: 'Pending Triage', value: data.stats.pending || 0, icon: <Clock size={24} color="#64748b" /> },
          { label: 'Active Repairs', value: data.stats.active || 0, icon: <Zap size={24} color="#000000" /> },
          { label: 'Escalated Issues', value: data.stats.escalated || 0, icon: <AlertTriangle size={24} color="#d97706" /> },
          { label: 'Resolved (24h)', value: data.stats.resolved || 0, icon: <CheckCircle size={24} color="#059669" /> }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              {stat.icon}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        
        {/* Left: Live Ticker */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <Activity size={20} /> Live Activity Log
          </h2>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', height: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Establishing connection...</div>
            ) : data.recentActivity.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>No recent activity.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <AnimatePresence>
                  {data.recentActivity.map((log: any) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -20, height: 0 }} 
                      animate={{ opacity: 1, x: 0, height: 'auto' }} 
                      style={{ padding: '1.25rem', background: '#ffffff', border: '1px solid #f1f5f9', borderLeft: `4px solid ${log.action.includes('RESOLVED') || log.action.includes('CONFIRMED') ? '#10b981' : (log.action.includes('CREATED') ? '#3b82f6' : '#94a3b8')}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                        <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                        <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>SHA: {log.hash.substring(0, 8)}</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 500 }}>
                        <strong style={{ color: '#0f172a', fontWeight: 800 }}>[{log.action.replace(/_/g, ' ')}]</strong> {log.details}
                      </div>
                      {log.complaint && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>
                          <span><strong style={{color: '#0f172a'}}>Ticket:</strong> {log.complaint.title}</span>
                          <span style={{ color: getPriorityColor(log.complaint.priority), fontWeight: 700 }}>{log.complaint.priority} Priority</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right: Urgent Escalations */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
            <ShieldAlert size={20} /> Urgent Escalations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.urgentIssues.length === 0 ? (
              <div style={{ padding: '2.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                All systems nominal. <br/>No urgent issues.
              </div>
            ) : (
              <AnimatePresence>
                {data.urgentIssues.map((issue: any) => (
                  <motion.div 
                    key={issue.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', letterSpacing: '-0.02em' }}>{issue.title}</h3>
                      <span style={{ padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: 800, borderRadius: '999px', letterSpacing: '0.05em' }}>
                        {issue.priority}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.5, fontWeight: 500 }}>{issue.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: '#b91c1c', borderTop: '1px solid #fecaca', paddingTop: '0.75rem', fontWeight: 700 }}>
                      <span>{issue.department}</span>
                      <span>{issue.location?.name || issue.locationId}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminLiveDashboard;
