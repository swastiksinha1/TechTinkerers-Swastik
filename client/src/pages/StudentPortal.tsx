import { useState, useEffect } from 'react';
import { Sparkles, Send, CheckCircle, Camera, Star, PenTool, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PinnedList } from "@/components/unlumen-ui/pinned-list";
import { ShoppingBag01Icon as ShoppingBag } from "hugeicons-react";
import { toast } from 'sonner';

interface AIResult {
  title: string;
  department: string;
  priority: string;
  analysis: string;
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

const StudentPortal = () => {
  const [complaintText, setComplaintText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [ratingInput, setRatingInput] = useState<{ [key: string]: number }>({});
  
  // Toggle for AI vs Manual
  const [entryMode, setEntryMode] = useState<'AI' | 'MANUAL'>('AI');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDepartment, setManualDepartment] = useState('Plumbing');
  const [manualPriority, setManualPriority] = useState('LOW');
  
  const reporterId = 'stu_123';
  const locationId = 'loc_abc';

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
    const interval = setInterval(fetchMyTickets, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText) return;

    setIsSubmitting(true);
    setResult(null);
    toast.info('AI is analyzing your report...', { id: 'ai-triage' });

    try {
      const response = await fetch('/api/complaints/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: complaintText, imageBase64: imagePreview, reporterId, locationId }),
      });

      const data = await response.json();
      if (response.ok && data.complaint) {
        setResult(JSON.parse(data.complaint.aiAnalysis));
        setComplaintText('');
        setImageFile(null);
        setImagePreview(null);
        fetchMyTickets(); 
        toast.success('Smart Triage Complete!', { id: 'ai-triage' });
      } else {
        toast.error('Failed to submit: ' + (data.error || 'Unknown error'), { id: 'ai-triage' });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting report.', { id: 'ai-triage' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !complaintText) return;

    setIsSubmitting(true);
    setResult(null);
    const toastId = toast.loading('Submitting ticket...');

    try {
      const response = await fetch('/api/complaints/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: manualTitle, 
          description: complaintText, 
          department: manualDepartment, 
          priority: manualPriority, 
          reporterId, 
          locationId 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult({
          title: manualTitle,
          department: manualDepartment,
          priority: manualPriority,
          analysis: "Manually submitted by user."
        });
        setManualTitle('');
        setComplaintText('');
        fetchMyTickets(); 
        toast.success('Ticket Submitted Successfully!', { id: toastId });
      } else {
        toast.error('Failed to submit: ' + (data.error || 'Unknown error'), { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting ticket.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmResolution = async (ticketId: string) => {
    const rating = ratingInput[ticketId] || 5;
    const toastId = toast.loading('Verifying resolution...');
    try {
      const response = await fetch(`/api/complaints/${ticketId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (response.ok) {
        toast.success('Resolution verified! You earned 10 Karma Points.', { id: toastId });
        fetchMyTickets();
      } else {
        toast.error('Failed to verify.', { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error('Error verifying resolution.', { id: toastId });
    }
  };



  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '4rem' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-heading" style={{ marginBottom: '1rem' }}>Report an Issue.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '600px' }}>
            Choose Smart Triage to let our AI do the work, or switch to Manual if you want to specify everything yourself.
          </p>
        </div>
        <Link to="/feed" style={{ textDecoration: 'none', background: '#e0f2fe', color: '#0369a1', padding: '1rem 1.5rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          View Community Feed →
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '12px' }}>
        <button onClick={() => setEntryMode('AI')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '8px', border: 'none', background: entryMode === 'AI' ? 'white' : 'transparent', color: entryMode === 'AI' ? 'var(--primary-color)' : '#64748b', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: entryMode === 'AI' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
          <Bot size={20} /> Smart AI Triage
        </button>
        <button onClick={() => setEntryMode('MANUAL')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '8px', border: 'none', background: entryMode === 'MANUAL' ? 'white' : 'transparent', color: entryMode === 'MANUAL' ? 'var(--primary-color)' : '#64748b', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: entryMode === 'MANUAL' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
          <PenTool size={20} /> Manual Entry
        </button>
      </div>

      <form onSubmit={entryMode === 'AI' ? handleAiSubmit : handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
        


        {entryMode === 'MANUAL' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Short Title (e.g. Broken Fan)" 
              value={manualTitle} 
              onChange={(e) => setManualTitle(e.target.value)} 
              required={entryMode === 'MANUAL'}
              disabled={isSubmitting}
              style={{ fontSize: '1.25rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} 
            />
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <select className="glass-input" value={manualDepartment} onChange={(e) => setManualDepartment(e.target.value)} disabled={isSubmitting} style={{ flex: 1, fontSize: '1.25rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="IT">IT & Tech</option>
                <option value="Cleaning">Cleaning & Janitorial</option>
                <option value="Carpentry">Carpentry</option>
                <option value="General">General</option>
              </select>
              <select className="glass-input" value={manualPriority} onChange={(e) => setManualPriority(e.target.value)} disabled={isSubmitting} style={{ flex: 1, fontSize: '1.25rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <option value="LOW">Low Priority (7 Days)</option>
                <option value="MEDIUM">Medium Priority (24 Hrs)</option>
                <option value="HIGH">High Priority (2 Hrs)</option>
                <option value="CRITICAL">Critical / Severe (1 Min Demo)</option>
              </select>
            </div>
          </div>
        )}

        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          className="glass-input"
          rows={6}
          placeholder={entryMode === 'AI' ? "Describe what you see or hear. E.g. 'The fan is sparking and smells like smoke...'" : "Detailed description..."}
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          disabled={isSubmitting}
          required
          style={{ resize: 'vertical', fontSize: '1.25rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {entryMode === 'AI' && (
            <motion.label whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-button outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
              <Camera size={20} />
              {imageFile ? 'Change Photo' : 'Attach Photo (Optional)'}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={isSubmitting} />
            </motion.label>
          )}
        </div>

        <AnimatePresence>
          {imagePreview && entryMode === 'AI' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 300 }} exit={{ opacity: 0, height: 0 }} style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
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
            <span className="animate-pulse" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{entryMode === 'AI' ? <><Sparkles size={20} /> AI is analyzing...</> : 'Submitting...'}</span>
          ) : (
            <><span style={{ fontSize: '1.2rem' }}>{entryMode === 'AI' ? 'Submit to AI Triage' : 'Submit Ticket Manually'}</span> <Send size={20} /></>
          )}
        </motion.button>
      </form>

      {/* Result Display & Tickets List */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ marginBottom: '4rem', padding: '2.5rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px' }}>
            <h3 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}><CheckCircle size={28} /> {entryMode === 'AI' ? 'Smart Triage Complete' : 'Ticket Submitted'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#1f2937' }}>
              <div style={{ fontSize: '1.25rem' }}><strong>Title:</strong> {result.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                <strong>Department:</strong> <span style={{ marginLeft: '1rem', padding: '0.5rem 1.25rem', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '999px', fontSize: '1rem', fontWeight: 600 }}>{result.department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                <strong>Priority:</strong> <span style={{ marginLeft: '1rem', padding: '0.5rem 1.25rem', background: result.priority === 'CRITICAL' ? '#fee2e2' : '#fef3c7', color: result.priority === 'CRITICAL' ? '#991b1b' : '#92400e', border: `1px solid ${result.priority === 'CRITICAL' ? '#fecaca' : '#fde68a'}`, borderRadius: '999px', fontSize: '1rem', fontWeight: 'bold' }}>{result.priority}</span>
              </div>
              <div style={{ color: '#374151', fontSize: '1.1rem', marginTop: '1rem', fontStyle: 'italic', padding: '1.5rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                "<TypewriterText text={result.analysis} />"
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
          <div className="w-full max-w-2xl">
            <PinnedList items={myTickets.map(ticket => ({
              id: ticket.id,
              name: ticket.title,
              icon: <ShoppingBag size={18} />,
              subtitle: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', background: ticket.status === 'AWAITING_VERIFICATION' ? '#fef08a' : (ticket.status === 'RESOLVED' ? '#bbf7d0' : '#f1f5f9'), color: ticket.status === 'AWAITING_VERIFICATION' ? '#854d0e' : (ticket.status === 'RESOLVED' ? '#166534' : '#475569') }}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>· {ticket.department}</span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.4, margin: '0.25rem 0' }}>{ticket.description}</p>
                  
                  {/* DUAL HANDSHAKE PIN DISPLAY */}
                  {(ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS') && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>VERIFICATION PIN</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>Share with technician</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.15em', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        {ticket.handshakePin || '---'}
                      </div>
                    </div>
                  )}

                  {ticket.status === 'AWAITING_VERIFICATION' && (
                    <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Technician marked this as fixed. Please verify:</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={32} style={{ cursor: 'pointer', fill: (ratingInput[ticket.id] || 5) >= star ? '#eab308' : 'transparent', color: (ratingInput[ticket.id] || 5) >= star ? '#eab308' : '#94a3b8' }} onClick={() => setRatingInput(prev => ({ ...prev, [ticket.id]: star }))} />
                        ))}
                      </div>
                      <button onClick={() => handleConfirmResolution(ticket.id)} className="glass-button" style={{ background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Confirm Resolution & Award Points</button>
                    </div>
                  )}
                </div>
              )
            }))} />
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default StudentPortal;
