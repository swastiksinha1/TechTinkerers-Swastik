import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const TechnicianDashboard = () => {
  const [complaintId, setComplaintId] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId) return;

    setIsResolving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/complaints/${complaintId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5 }), // Simulating a perfect rating for the hackathon demo
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Resolved! Karma Points awarded to you and the student.' });
        setComplaintId('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to resolve complaint.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldCheck size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>142</h3>
          <p style={{ color: 'var(--text-secondary)' }}>My Karma Points</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>3</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Pending Critical SLA</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle color="var(--success)" size={24} />
          Resolve a Ticket (Demo)
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Paste the UUID of a complaint created by the AI triage system to resolve it and trigger the gamification karma point awards.
        </p>

        <form onSubmit={handleResolve} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="glass-input"
            style={{ flex: 1 }}
            placeholder="Complaint UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            disabled={isResolving}
            required
          />
          <button 
            type="submit" 
            className="glass-button" 
            disabled={isResolving || !complaintId}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isResolving ? 'Resolving...' : 'Resolve Ticket'}
          </button>
        </form>

        {message && (
          <div className="animate-slide-up" style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: '8px',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)'
          }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
