import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle, Camera } from 'lucide-react';

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
          imageBase64: imagePreview, // Send the base64 data to Gemini Vision
          reporterId: 'stu_123', // Mock ID for now
          locationId: 'loc_abc', // Mock ID for now
        }),
      });

      const data = await response.json();
      if (response.ok && data.complaint) {
        setResult(JSON.parse(data.complaint.aiAnalysis));
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

  return (
    <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--warning)" size={24} />
          Report an Issue
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Describe the problem or upload a photo! Our Multimodal AI will automatically figure out the department, urgency, and notify the right team instantly.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            className="glass-input"
            rows={4}
            placeholder="e.g., The fan in room 101 is making a weird sparking noise and smells like smoke..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            disabled={isSubmitting}
            required
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
              <Camera size={18} />
              {imageFile ? 'Change Photo' : 'Attach Photo (Optional)'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
            </label>
          </div>

          {imagePreview && (
            <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="glass-button" 
            disabled={isSubmitting || !complaintText}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Gemini Vision is analyzing...</span>
            ) : (
              <>Submit to AI Triage <Send size={18} /></>
            )}
          </button>
        </form>

        {result && (
          <div className="animate-slide-up" style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid var(--success)',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={20} /> Smart Triage Complete
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>Title:</strong> {result.title}</div>
              <div>
                <strong>Department:</strong> 
                <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', fontSize: '0.875rem' }}>
                  {result.department}
                </span>
              </div>
              <div>
                <strong>Priority:</strong> 
                <span style={{ 
                  marginLeft: '0.5rem', 
                  padding: '0.25rem 0.75rem', 
                  background: result.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                  color: result.priority === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)',
                  borderRadius: '999px', 
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {result.priority}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                " {result.analysis} "
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
