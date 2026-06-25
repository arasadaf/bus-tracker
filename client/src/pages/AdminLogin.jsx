import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/auth/admin/login`, { password });
      
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 glass rounded-3xl shadow-2xl border border-white/50 p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Admin <span className="text-gradient">Login</span>
        </h2>
        <p className="text-gray-500 mt-2">Secure access to the transit dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-gray-800 transition-all shadow-sm font-medium"
            placeholder="Enter admin password"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:scale-[1.02] hover:shadow-gray-900/30'
          }`}
        >
          {loading ? 'Authenticating...' : 'Access Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
