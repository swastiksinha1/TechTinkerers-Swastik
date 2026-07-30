import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MapPin, Tag, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFeed = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/complaints/public');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpvote = async (id: string) => {
    // Optimistic UI update
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c));
    try {
      await fetch(`/api/complaints/${id}/upvote`, { method: 'POST' });
    } catch (e) {
      console.error(e);
      // If it fails, we could revert the optimistic update here
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem 0' }}>Community Feed</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0 }}>
            See what's broken around campus. Upvote issues if you are facing the same problem to increase their priority.
          </p>
        </div>
        <Link to="/portal" style={{ textDecoration: 'none', background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 700 }}>
          + Report an Issue
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.25rem', padding: '4rem' }}>Loading feed...</div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.25rem', padding: '4rem' }}>No active issues reported. The campus is perfect!</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {complaints.map(complaint => (
              <motion.div key={complaint.id} variants={itemVariants} style={{ background: 'var(--surface-color)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                
                {complaint.photoUrl ? (
                  <div style={{ width: '100%', height: '200px', background: '#e2e8f0' }}>
                    <img src={complaint.photoUrl} alt="Complaint" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '120px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 600 }}>
                    No Image Provided
                  </div>
                )}

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0.25rem 0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Tag size={12}/> {complaint.department}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0.25rem 0.75rem', background: complaint.priority === 'CRITICAL' ? '#fee2e2' : '#fef3c7', color: complaint.priority === 'CRITICAL' ? '#991b1b' : '#92400e', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Activity size={12}/> {complaint.priority}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>{complaint.title}</h3>
                  <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{complaint.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} /> Room {complaint.locationId.replace('loc_', '')}
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpvote(complaint.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '999px', color: '#3b82f6', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                    >
                      <ArrowUp size={18} strokeWidth={3} />
                      {complaint.upvotes || 0}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default PublicFeed;
