import React, { useState, useEffect } from 'react';
import { Sparkles, Send, CheckCircle, Camera, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIResult {
  title: string;
  department: string;
  priority: string;
  analysis: string;
}

const StudentPortal = () => {
  const [complaintText, setComplaintText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [ratingInput, setRatingInput] = useState<{ [key: string]: number }>({});
  
  // Using a hardcoded mock user ID for the demo
  const reporterId = 'stu_123';

  const fetchMyTickets = async () => {
    try {
      const response = await fetch(`/api/complaints/student/${reporterId}`);
      if (response.ok) {
        const data = await response.json();
        setMyTickets(data.complaints);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMyTickets();
    const interval = setInterval(fetchMyTickets, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/complaints/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: complaintText,
          imageBase64: imagePreview,
          reporterId,
          locationId: 'loc_abc',
        }),
      });

      const data = await response.json();
      if (response.ok && data.complaint) {
        setResult(JSON.parse(data.complaint.aiAnalysis));
        setComplaintText('');
        setImageFile(null);
        setImagePreview(null);
        fetchMyTickets(); // Refresh tickets immediately
      } else {
        alert('Failed to submit complaint: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmResolution = async (ticketId: string) => {
    const rating = ratingInput[ticketId] || 5;
    try {
      const response = await fetch(`/api/complaints/${ticketId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (response.ok) {
        alert('Resolution verified! You have been awarded 10 Karma Points.');
        fetchMyTickets();
      } else {
        alert('Failed to verify.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '4rem' }}
    >
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="section-heading" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          Report an Issue.
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '600px' }}>
          Describe the problem or upload a photo! Our Multimodal AI will automatically figure out the department, urgency, and notify the right team instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          className="glass-input"
          rows={6}
          placeholder="e.g., The fan in room 101 is making a weird sparking noise and smells like smoke..."
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          disabled={isSubmitting}
          required
          style={{ resize: 'vertical', fontSize: '1.25rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.label 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
          >
            <Camera size={20} />
            {imageFile ? 'Change Photo' : 'Attach Photo (Optional)'}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }}
              disabled={isSubmitting}
            />
          </motion.label>
        </div>

        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 300 }}
              exit={{ opacity: 0, height: 0 }}
              style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
            >
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: isSubmitting || !complaintText ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || !complaintText ? 1 : 0.98 }}
          type="submit" 
          className="glass-button" 
          disabled={isSubmitting || !complaintText}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', padding: '1.25rem' }}
        >
          {isSubmitting ? (
            <span className="animate-pulse" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={20} /> AI is analyzing your report...</span>
          ) : (
            <><span style={{ fontSize: '1.2rem' }}>Submit to AI Triage</span> <Send size={20} /></>
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ 
              marginBottom: '4rem', 
              padding: '2.5rem', 
              background: '#f0fdf4', 
              border: '1px solid #86efac',
              borderRadius: '12px',
            }}
          >
            <h3 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>
              <CheckCircle size={28} /> Smart Triage Complete
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#1f2937' }}>
              <div style={{ fontSize: '1.25rem' }}><strong>Title:</strong> {result.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                <strong>Department:</strong> 
                <span style={{ marginLeft: '1rem', padding: '0.5rem 1.25rem', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '999px', fontSize: '1rem', fontWeight: 600 }}>
                  {result.department}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                <strong>Priority:</strong> 
                <span style={{ 
                  marginLeft: '1rem', 
                  padding: '0.5rem 1.25rem', 
                  background: result.priority === 'CRITICAL' ? '#fee2e2' : '#fef3c7', 
                  color: result.priority === 'CRITICAL' ? '#991b1b' : '#92400e',
                  border: `1px solid ${result.priority === 'CRITICAL' ? '#fecaca' : '#fde68a'}`,
                  borderRadius: '999px', 
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  {result.priority}
                </span>
              </div>
              <div style={{ color: '#374151', fontSize: '1.1rem', marginTop: '1rem', fontStyle: 'italic', padding: '1.5rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                "{result.analysis}"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '2rem' }}>
        <h2 className="section-heading" style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Active Reports</h2>
        
        {myTickets.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You have no active reports.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {myTickets.map(ticket => (
              <div key={ticket.id} style={{ padding: '2rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{ticket.title}</h3>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '999px', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    background: ticket.status === 'AWAITING_VERIFICATION' ? '#fef08a' : (ticket.status === 'RESOLVED' ? '#bbf7d0' : '#e2e8f0'),
                    color: ticket.status === 'AWAITING_VERIFICATION' ? '#854d0e' : (ticket.status === 'RESOLVED' ? '#166534' : '#475569')
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{ticket.description}</p>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace' }}>Ticket ID: {ticket.id}</div>

                {/* VERIFICATION UI */}
                {ticket.status === 'AWAITING_VERIFICATION' && (
                  <div style={{ marginTop: '2rem', padding: '2rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Technician marked this as fixed. Please verify:</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star}
                          size={32} 
                          style={{ cursor: 'pointer', fill: (ratingInput[ticket.id] || 5) >= star ? '#eab308' : 'transparent', color: (ratingInput[ticket.id] || 5) >= star ? '#eab308' : '#94a3b8' }}
                          onClick={() => setRatingInput(prev => ({ ...prev, [ticket.id]: star }))}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => handleConfirmResolution(ticket.id)}
                      className="glass-button"
                      style={{ background: '#10b981', color: 'white' }}
                    >
                      Confirm Resolution & Award Points
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default StudentPortal;
