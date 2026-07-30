import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Real images from the internet (Unsplash placeholders representing college blocks)
// You can replace these URLs with exact VIT Bhopal image URLs!
const images = {
  boys: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=400',
  girls: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400',
  academic: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400',
  eatery: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400'
};

const locations = [
  { id: 'b1', name: 'Boys Block 1', type: 'Boys', lat: 23.0760, lng: 76.8480, img: images.boys },
  { id: 'b2', name: 'Boys Block 2', type: 'Boys', lat: 23.0762, lng: 76.8485, img: images.boys },
  { id: 'b3', name: 'Boys Block 3', type: 'Boys', lat: 23.0764, lng: 76.8475, img: images.boys },
  { id: 'b4', name: 'Boys Block 4', type: 'Boys', lat: 23.0766, lng: 76.8482, img: images.boys },
  { id: 'b5', name: 'Boys Block 5', type: 'Boys', lat: 23.0758, lng: 76.8472, img: images.boys },
  { id: 'b6', name: 'Boys Block 6', type: 'Boys', lat: 23.0768, lng: 76.8478, img: images.boys },
  { id: 'b7', name: 'Boys Block 7', type: 'Boys', lat: 23.0770, lng: 76.8484, img: images.boys },
  { id: 'b8', name: 'Boys Block 8', type: 'Boys', lat: 23.0772, lng: 76.8476, img: images.boys },
  { id: 'g1', name: 'Girls Block 1', type: 'Girls', lat: 23.0745, lng: 76.8510, img: images.girls },
  { id: 'g2', name: 'Girls Block 2', type: 'Girls', lat: 23.0748, lng: 76.8515, img: images.girls },
  { id: 'a1', name: 'Academic Block 1', type: 'Academic', lat: 23.0755, lng: 76.8497, img: images.academic },
  { id: 'a2', name: 'Academic Block 2', type: 'Academic', lat: 23.0750, lng: 76.8500, img: images.academic },
  { id: 'e1', name: 'Main Campus Eatery', type: 'Eatery', lat: 23.0752, lng: 76.8485, img: images.eatery },
];

const CampusMap = () => {
  // Simulate active complaints for the demo (Red = Critical, Yellow = Medium, Green = Clear)
  const getHealthStatus = (id: string) => {
    if (id === 'b3' || id === 'a1') return 'CRITICAL';
    if (id === 'g1' || id === 'e1') return 'MEDIUM';
    return 'CLEAR';
  };

  const getColor = (status: string) => {
    if (status === 'CRITICAL') return '#ef4444'; // Red
    if (status === 'MEDIUM') return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  return (
    <div className="animate-slide-up" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>VIT Bhopal Campus Heatmap</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Live complaint tracking across 13 blocks</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16}/> Clear</span>
          <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={16}/> Warning</span>
          <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={16}/> Critical</span>
        </div>
      </div>

      <div className="glass-panel" style={{ height: '70vh', width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
        <MapContainer 
          center={[23.0755, 76.8497]} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {locations.map((loc) => {
            const status = getHealthStatus(loc.id);
            const color = getColor(status);
            
            return (
              <React.Fragment key={loc.id}>
                {/* Glowing ring for health status */}
                <CircleMarker 
                  center={[loc.lat, loc.lng]} 
                  radius={40} 
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.1, weight: 2 }}
                />
                
                {/* Main Marker */}
                <Marker position={[loc.lat, loc.lng]}>
                  <Popup className="custom-popup">
                    <div style={{ width: '220px' }}>
                      <img 
                        src={loc.img} 
                        alt={loc.name} 
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                      />
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1f2937' }}>{loc.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', fontWeight: 'bold' }}>
                        Status: <span style={{ color }}>{status}</span>
                      </p>
                      {status !== 'CLEAR' && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                          Active complaints detected. Technician required.
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default CampusMap;
