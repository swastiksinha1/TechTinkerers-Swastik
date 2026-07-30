import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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

const createCustomIcon = (status: string) => {
  const color = getColor(status);
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background: ${color}33; 
        border: 2px solid ${color}; 
        border-radius: 50%; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        box-shadow: 0 0 15px ${color};
      ">
        <div style="width: 10px; height: 10px; background: ${color}; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const CampusMap = () => {
  return (
    <div className="animate-slide-up" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>VIT Bhopal Campus Radar</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Real-time 2D surveillance feed.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16}/> Clear</span>
          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={16}/> Warning</span>
          <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={16}/> Critical</span>
        </div>
      </div>

      <div className="glass-panel" style={{ height: '70vh', width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <MapContainer 
          center={[23.0755, 76.8485]} 
          zoom={16} 
          style={{ height: '100%', width: '100%', background: '#0f172a' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          
          {locations.map((loc) => {
            const status = getHealthStatus(loc.id);
            return (
              <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]}
                icon={createCustomIcon(status)}
              >
                <Popup className="dark-popup">
                  <div style={{ padding: '0.5rem', background: '#1e293b', color: 'white', borderRadius: '8px' }}>
                    <img 
                      src={loc.img} 
                      alt={loc.name} 
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} 
                    />
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'white' }}>{loc.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'bold' }}>
                      Status: <span style={{ color: getColor(status) }}>{status}</span>
                    </p>
                    {status !== 'CLEAR' && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        Active complaints detected. Technician required.
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default CampusMap;
