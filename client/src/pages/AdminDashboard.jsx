import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch active buses
        const busesRes = await axios.get(`${API_URL}/location/all`);
        setBuses(busesRes.data);

        // Fetch scan logs
        const logsRes = await axios.get(`${API_URL}/logs`);
        setLogs(logsRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          System <span className="text-gradient">Dashboard</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-white text-red-600 font-bold rounded-xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Buses Panel */}
        <div className="glass rounded-3xl p-6 border border-white/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🚌</span> Active Buses
          </h2>
          <div className="space-y-4">
            {buses.length === 0 ? (
              <p className="text-gray-500 italic">No buses currently tracked.</p>
            ) : (
              buses.map(bus => (
                <div key={bus._id} className="bg-white/60 p-4 rounded-2xl flex justify-between items-center border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-bold text-lg text-gray-800">{bus.busNumber}</div>
                    <div className="text-sm text-indigo-600 font-medium">{bus.route}</div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>Last ping:</div>
                    <div className="font-medium">{new Date(bus.lastLocationUpdate).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Entry & Exit Logs Panel */}
        <div className="glass rounded-3xl p-6 border border-white/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📋</span> Scanner Logs
          </h2>
          <div className="overflow-y-auto max-h-[500px] pr-2 space-y-3">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic">No scans recorded yet.</p>
            ) : (
              logs.map(log => (
                <div key={log._id} className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800 text-base">{log.busNumber}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                      {log.route}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg">
                      <div className="text-xs uppercase tracking-wider font-bold mb-1">Entry</div>
                      <div>{new Date(log.entryTime).toLocaleTimeString()}</div>
                      <div className="text-xs opacity-75">{new Date(log.entryTime).toLocaleDateString()}</div>
                    </div>
                    <div className={`p-2 rounded-lg ${log.exitTime ? 'bg-rose-50 text-rose-700' : 'bg-gray-50 text-gray-400'}`}>
                      <div className="text-xs uppercase tracking-wider font-bold mb-1">Exit</div>
                      <div>{log.exitTime ? new Date(log.exitTime).toLocaleTimeString() : 'In Transit'}</div>
                      <div className="text-xs opacity-75">{log.exitTime ? new Date(log.exitTime).toLocaleDateString() : '--'}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
