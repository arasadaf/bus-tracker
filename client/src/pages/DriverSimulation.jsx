import { useState, useEffect } from 'react';
import axios from 'axios';

// The same sample route
const mockRoute = [
  [12.9716, 77.5946],
  [12.9616, 77.6046],
  [12.9516, 77.6146],
  [12.9416, 77.6246],
];

export default function DriverSimulation() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/location/all');
        setBuses(response.data);
      } catch (err) {
        console.error("Error fetching buses", err);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    let interval;
    if (simulating && selectedBus) {
      interval = setInterval(async () => {
        const coord = mockRoute[currentStep];
        try {
          await axios.put(`http://localhost:5000/location/${selectedBus}`, {
            lat: coord[0],
            lng: coord[1]
          });
          setCurrentStep((prev) => (prev + 1) % mockRoute.length); // Loop the route
        } catch (err) {
          console.error("Failed to update location", err);
        }
      }, 3000); // Move every 3 seconds
    }
    return () => clearInterval(interval);
  }, [simulating, selectedBus, currentStep]);

  const handleStart = () => {
    if (!selectedBus) return;
    setSimulating(true);
  };

  const handleStop = () => {
    setSimulating(false);
  };

  return (
    <div className="max-w-md mx-auto glass rounded-3xl shadow-2xl border border-white/50 p-8 animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center tracking-tight">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center mr-4 shadow-sm border border-white">
          <span className="text-2xl">🚎</span>
        </div>
        Driver <span className="text-gradient ml-2">Console</span>
      </h2>
      
      <div className="mb-8 p-5 bg-white/50 rounded-2xl border border-white/60 shadow-sm">
        <label className="block text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">Select Your Bus</label>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          disabled={simulating}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-gray-800 transition-all shadow-sm font-medium"
        >
          <option value="">-- Choose a bus --</option>
          {buses.map(bus => (
            <option key={bus._id} value={bus._id}>{bus.busNumber} ({bus.route})</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        {!simulating ? (
          <button
            onClick={handleStart}
            disabled={!selectedBus}
            className={`flex-1 py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${!selectedBus ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-[1.02] hover:shadow-indigo-500/30'}`}
          >
            Start Route Simulation
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 py-4 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-red-500/30"
          >
            Stop Simulation
          </button>
        )}
      </div>

      {simulating && (
        <div className="mt-8 p-4 bg-indigo-50/80 backdrop-blur-md rounded-xl border border-indigo-100 flex items-center space-x-3 shadow-inner">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
          <span className="text-indigo-800 font-semibold tracking-wide">Transmitting live location...</span>
        </div>
      )}
    </div>
  );
}
