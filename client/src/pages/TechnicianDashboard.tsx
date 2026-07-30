import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck, Search, Link as LinkIcon, MessageSquare } from 'lucide-react';

const TechnicianDashboard = () => {
  const [complaintId, setComplaintId] = useState('');
  const [ledger, setLedger] = useState<any[]>([]);
  const [complaintStatus, setComplaintStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchLedger = async (id: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}/ledger`);
      if (response.ok) {
        const data = await response.json();
        setLedger(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId) return;
    setIsProcessing(true);
    
    // Quick mock fetch to get status
    try {
       // We'll just fetch ledger to see if it exists, and infer status from the last log
       const response = await fetch(`/api/complaints/${complaintId}/ledger`);
       if (response.ok) {
         const data = await response.json();
         setLedger(data.logs);
         if (data.logs.length > 0) {
           const lastAction = data.logs[data.logs.length - 1].action;
           if (lastAction === 'CREATED_VIA_AI') setComplaintStatus('PENDING');
           else if (lastAction === 'STATUS_CHANGED') setComplaintStatus('AWAITING_VERIFICATION');
           else if (lastAction === 'STUDENT_CONFIRMED') setComplaintStatus('RESOLVED');
         }
       } else {
         setMessage({ type: 'error', text: 'Complaint not found.' });
       }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5 }),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Ticket fixed! Awaiting student verification.' });
        setComplaintStatus('AWAITING_VERIFICATION');
        await fetchLedger(complaintId);
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

  const handleStudentConfirm = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/confirm`, { method: 'POST' });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Student Verified! Gamification Karma Points Awarded.' });
        setComplaintStatus('RESOLVED');
        await fetchLedger(complaintId);
      } else {
        setMessage({ type: 'error', text: 'Failed to confirm.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppAlert = () => {
    setMessage({ type: 'success', text: 'Simulated: Multi-channel WhatsApp & SMS alert dispatched to student and warden via Twilio API.' });
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldCheck size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>142</h3>
          <p style={{ color: 'var(--text-secondary)' }}>My Karma Points</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>1</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Pending Critical SLA</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search color="var(--primary-color)" size={24} />
          Investigate Ticket
        </h2>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="glass-input"
            style={{ flex: 1 }}
            placeholder="Complaint UUID (Copy from terminal or DB)"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            required
          />
          <button type="submit" className="glass-button" disabled={isProcessing}>
            Search
          </button>
        </form>

        {message && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`, borderRadius: '8px', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {message.text}
          </div>
        )}

        {ledger.length > 0 && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Actions Panel */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {complaintStatus === 'PENDING' && (
                <button onClick={handleResolve} disabled={isProcessing} className="glass-button" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.2)' }}>
                  <CheckCircle size={18} /> Mark as Fixed
                </button>
              )}
              {complaintStatus === 'AWAITING_VERIFICATION' && (
                <button onClick={handleStudentConfirm} disabled={isProcessing} className="glass-button" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)' }}>
                  <ShieldCheck size={18} /> (Student Mock) Confirm Resolution
                </button>
              )}
              <button onClick={handleWhatsAppAlert} className="glass-button" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} /> Broadcast Update
              </button>
            </div>

            {/* Blockchain Ledger View */}
            <div>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <LinkIcon size={20} /> Tamper-Evident Hash Chain
              </h3>
              <div style={{ background: '#000', borderRadius: '12px', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f0', overflowX: 'auto', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                {ledger.map((log, index) => (
                  <div key={log.id} style={{ marginBottom: '1.5rem', borderLeft: '2px solid #0f0', paddingLeft: '1rem' }}>
                    <div style={{ color: '#fff', marginBottom: '0.25rem' }}>[{new Date(log.createdAt).toLocaleString()}]</div>
                    <div style={{ fontWeight: 'bold', color: '#ff0' }}>ACTION: {log.action}</div>
                    <div>DETAILS: {log.details}</div>
                    <div style={{ color: '#888', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                      PREV_HASH: {log.previousHash || 'GENESIS'}
                    </div>
                    <div style={{ color: '#0ff', wordBreak: 'break-all' }}>
                      BLOCK_HASH: {log.hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
