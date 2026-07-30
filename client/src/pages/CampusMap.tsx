
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const images = {
  boys: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=400',
  girls: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400',
  academic: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400',
  eatery: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400'
};

const locations = [
  { id: 'b1', name: 'Boys Block 1', type: 'Boys', lat: 23.0760, lng: 76.8480, img: images.boys },
  { id: 'b2', name: 'Boys Block 2', type: 'Boys', lat: 23.0763, lng: 76.8488, img: images.boys },
  { id: 'b3', name: 'Boys Block 3', type: 'Boys', lat: 23.0766, lng: 76.8472, img: images.boys },
  { id: 'b4', name: 'Boys Block 4', type: 'Boys', lat: 23.0769, lng: 76.8485, img: images.boys },
  { id: 'b5', name: 'Boys Block 5', type: 'Boys', lat: 23.0755, lng: 76.8470, img: images.boys },
  { id: 'b6', name: 'Boys Block 6', type: 'Boys', lat: 23.0772, lng: 76.8478, img: images.boys },
  { id: 'b7', name: 'Boys Block 7', type: 'Boys', lat: 23.0775, lng: 76.8487, img: images.boys },
  { id: 'b8', name: 'Boys Block 8', type: 'Boys', lat: 23.0778, lng: 76.8475, img: images.boys },
  { id: 'g1', name: 'Girls Block 1', type: 'Girls', lat: 23.0740, lng: 76.8515, img: images.girls },
  { id: 'g2', name: 'Girls Block 2', type: 'Girls', lat: 23.0745, lng: 76.8522, img: images.girls },
  { id: 'a1', name: 'Academic Block 1', type: 'Academic', lat: 23.0752, lng: 76.8500, img: images.academic },
  { id: 'a2', name: 'Academic Block 2', type: 'Academic', lat: 23.0748, lng: 76.8505, img: images.academic },
  { id: 'e1', name: 'Main Campus Eatery', type: 'Eatery', lat: 23.0750, lng: 76.8485, img: images.eatery },
];

const getHealthStatus = (id: string) => {
  if (id === 'b3' || id === 'a1') return 'CRITICAL';
  if (id === 'g1' || id === 'e1') return 'MEDIUM';
  return 'CLEAR';
};

const getColor = (status: string) => {
  if (status === 'CRITICAL') return '#ef4444';
  if (status === 'MEDIUM') return '#f59e0b';
  return '#10b981';
};

const createCustomIcon = (status: string, name: string) => {
  const color = getColor(status);
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 150px; margin-left: -75px; margin-top: -18px;">
        <div style="
          width: 36px; 
          height: 36px; 
          background: ${color}22; 
          border: 2px solid ${color}; 
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0 4px 12px ${color}66;
          animation: pulse 2s infinite;
          margin-bottom: 6px;
        ">
          <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
        </div>
        <div style="background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; color: #0f172a; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-transform: uppercase;">
          ${name}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -18]
  });
};

const CampusMap = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '2rem', paddingBottom: '4rem' }}
    >
      <div className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-heading" style={{ margin: 0, fontSize: '2.5rem' }}>
            Campus Radar.
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '1.25rem', fontWeight: 600 }}>Real-time 2D surveillance feed.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem', background: '#f1f5f9', padding: '1.5rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}><CheckCircle size={24}/> Clear</span>
          <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}><Info size={24}/> Warning</span>
          <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}><AlertCircle size={24}/> Critical</span>
        </div>
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
        className="glass-panel" 
        style={{ height: '70vh', width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', background: '#ffffff' }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer 
            center={[23.0755, 76.8485]} 
            zoom={16} 
            style={{ height: '100%', width: '100%', background: '#f8fafc' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            
            {locations.map((loc) => {
              const status = getHealthStatus(loc.id);
              return (
                <Marker 
                  key={loc.id} 
                  position={[loc.lat, loc.lng]}
                  icon={createCustomIcon(status, loc.name)}
                >
                  <Popup minWidth={300}>
                    <div style={{ padding: '0', background: '#ffffff', color: '#0f172a' }}>
                      <img 
                        src={loc.img} 
                        alt={loc.name} 
                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px 4px 0 0' }} 
                      />
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>{loc.name}</h3>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>
                          Status: <span style={{ color: getColor(status), padding: '0.2rem 0.75rem', borderRadius: '4px', background: `${getColor(status)}22` }}>{status}</span>
                        </p>
                        {status !== 'CLEAR' && (
                          <p style={{ margin: '1rem 0 0 0', fontSize: '1rem', color: '#dc2626', lineHeight: 1.5, borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontWeight: 600 }}>
                            ⚠️ Active complaints detected. Technician required immediately.
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CampusMap;
