import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Search, Link as LinkIcon, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TechnicianDashboard = () => {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const fetchComplaintDetails = async (id: string) => {
    try {
      const res1 = await fetch(`/api/complaints/${id}`);
      const res2 = await fetch(`/api/complaints/${id}/ledger`);
      
      if (res1.ok && res2.ok) {
        const data1 = await res1.json();
        const data2 = await res2.json();
        setComplaint(data1.complaint);
        setLedger(data2.logs);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId) return;
    setIsProcessing(true);
    setMessage(null);
    
    const found = await fetchComplaintDetails(complaintId);
    if (!found) {
      setMessage({ type: 'error', text: 'Complaint not found.' });
      setComplaint(null);
      setLedger([]);
    }
    setIsProcessing(false);
  };

  const handleResolve = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Ticket fixed! Awaiting student verification before it can be closed.' });
        await fetchComplaintDetails(complaintId);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to resolve.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppAlert = () => {
    setMessage({ type: 'success', text: 'Simulated: Broadcast alert dispatched.' });
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (!complaint || !complaint.deadline) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(complaint.deadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [complaint]);

  // Poll for escalation updates if not resolved
  useEffect(() => {
    if (!complaint || complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') return;
    
    const poll = setInterval(() => {
      fetchComplaintDetails(complaint.id);
    }, 5000); // Check every 5s for demo

    return () => clearInterval(poll);
  }, [complaint]);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '4rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={56} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '4rem', margin: '0 0 0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            {timeLeft && timeLeft !== 'EXPIRED' ? timeLeft.split(' ')[0] : '0h'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg SLA Time Remaining</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertTriangle size={56} color="#d97706" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '4rem', margin: '0 0 0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>1</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Critical SLA</p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '4rem' }}>
        <h2 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Investigate Ticket.
        </h2>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            className="glass-input"
            style={{ flex: 1, fontSize: '1.25rem', padding: '1.5rem 2rem' }}
            placeholder="Enter Complaint UUID..."
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            required
          />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="glass-button" 
            disabled={isProcessing}
            style={{ fontSize: '1.25rem', padding: '0 3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <Search size={24} />
            {isProcessing ? 'Searching...' : 'Search'}
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: '3rem' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#86efac' : '#fecaca'}`, borderRadius: '8px', color: message.type === 'success' ? '#166534' : '#991b1b', fontSize: '1.1rem', fontWeight: 600 }}>
                {message.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {complaint && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {/* Ticket Details & Countdown */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{complaint.title}</h3>
                    <div style={{ color: '#64748b', fontSize: '1.1rem' }}>Department: {complaint.department} | Priority: <strong style={{ color: complaint.priority === 'CRITICAL' ? '#ef4444' : '#0f172a'}}>{complaint.priority}</strong></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Time Remaining</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: timeLeft === 'EXPIRED' ? '#ef4444' : '#10b981', fontFamily: 'monospace' }}>
                      {timeLeft}
                    </div>
                  </div>
                </div>

                {complaint.escalationLevel > 0 && (
                  <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertTriangle size={20} />
                    ESCALATED TO {complaint.escalationLevel === 1 ? 'WARDEN' : 'DEAN'}
                  </div>
                )}
                
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155' }}>
                  {complaint.description}
                </div>
              </div>

              {/* Actions Panel */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {(complaint.status === 'PENDING' || complaint.status === 'ASSIGNED' || complaint.status === 'ESCALATED') && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleResolve} disabled={isProcessing} className="glass-button outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', borderColor: '#d97706', color: '#d97706' }}>
                    <CheckCircle size={20} /> Mark as Fixed (Requires Student Verif.)
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleWhatsAppAlert} className="glass-button" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquare size={20} /> Broadcast Update
                </motion.button>
              </div>

              {/* Blockchain Ledger View */}
              <div>
                <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: 800 }}>
                  <LinkIcon size={28} /> Tamper-Evident Hash Chain
                </h3>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '3rem', fontFamily: 'monospace', fontSize: '1rem', color: '#0f172a', overflowX: 'auto', border: '1px solid #e2e8f0' }}>
                  <AnimatePresence>
                    {ledger.map((log, index) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                        style={{ marginBottom: index === ledger.length - 1 ? 0 : '3rem', borderLeft: '3px solid #3b82f6', paddingLeft: '2rem', position: 'relative' }}
                      >
                        <div style={{ position: 'absolute', left: '-8px', top: '0', width: '13px', height: '13px', background: '#3b82f6', borderRadius: '50%' }}></div>
                        <div style={{ color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>[{new Date(log.createdAt).toLocaleString()}]</div>
                        <div style={{ fontWeight: 800, color: log.action === 'AUTOMATIC_ESCALATION' ? '#ef4444' : '#0f172a', fontSize: '1.25rem', marginBottom: '0.75rem' }}>ACTION: {log.action}</div>
                        <div style={{ color: '#334155', marginBottom: '1.5rem', fontSize: '1.1rem' }}>DETAILS: {log.details}</div>
                        <div style={{ color: '#94a3b8', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                          PREV_HASH: {log.previousHash || 'GENESIS'}
                        </div>
                        <div style={{ color: '#3b82f6', wordBreak: 'break-all', fontWeight: 600 }}>
                          BLOCK_HASH: {log.hash}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TechnicianDashboard;
