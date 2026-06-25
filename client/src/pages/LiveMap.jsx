import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// A sample route for visualization (e.g., passing through a city)
const mockRoute = [
  [12.9716, 77.5946], // Bangalore center
  [12.9616, 77.6046],
  [12.9516, 77.6146],
  [12.9416, 77.6246],
];

export default function LiveMap() {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/location/all');
      setBuses(response.data);
    } catch (err) {
      console.error("Error fetching locations", err);
      setError("Failed to load bus locations.");
    }
  };

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Center map on the first route point or a default location
  const mapCenter = mockRoute[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass rounded-3xl p-2 shadow-2xl border border-white/50 animate-fade-in-up">
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-inner relative z-0">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Draw sample route */}
            <Polyline positions={mockRoute} color="#4f46e5" weight={6} opacity={0.7} />

            {buses.map((bus) => {
              if (bus.location && bus.location.lat && bus.location.lng) {
                return (
                  <Marker key={bus._id} position={[bus.location.lat, bus.location.lng]}>
                    <Popup className="rounded-xl">
                      <div className="font-bold text-lg text-indigo-600">{bus.busNumber}</div>
                      <div className="text-sm font-medium text-gray-700">Route: {bus.route}</div>
                      <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                        Updated: {new Date(bus.lastLocationUpdate).toLocaleTimeString()}
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>
      
      {/* Information Panel */}
      <div className="glass rounded-3xl p-8 shadow-xl border border-white/50 h-fit animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
          Live <span className="text-gradient">Tracking</span>
        </h2>
        
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium shadow-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-white/60 p-5 rounded-2xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 duration-300">
            <h3 className="font-bold text-lg text-indigo-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">📍</span> How it works
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              This dashboard provides real-time GPS tracking for all registered buses. The buses continuously broadcast their location to the TransitLive servers.
            </p>
          </div>
          
          <div className="bg-white/60 p-5 rounded-2xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 duration-300">
            <h3 className="font-bold text-lg text-pink-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">🔄</span> Live Sync
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The map automatically polls the server every 3 seconds. Watch the buses glide across the city routes instantly!
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Active Buses</span>
              <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-1 px-4 rounded-full text-sm font-bold shadow-md">
                {buses.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
