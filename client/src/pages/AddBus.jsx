import { useState } from "react"
import axios from "axios"
import QRGenerator from "../components/QRGenerator"

function AddBus(){
  const [busNumber,setBusNumber] = useState("")
  const [route,setRoute] = useState("")
  const [showQR,setShowQR] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addBus = async () => {
    if (!busNumber || !route) {
      setError("Please fill all fields")
      return
    }
    
    setLoading(true)
    setError("")
    
    try{
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
      await axios.post(`${API_URL}/bus/add`,{
        busNumber,
       route,
       qrCode: busNumber
      })
      
      setShowQR(true)
      setError("")
    }catch(error){
      console.log(error)
      setError(error.response?.data?.message || "Failed to add bus")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl mx-auto mb-4 shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">🚌</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Add New Bus
          </h1>
          <p className="text-gray-500">Register a new bus to the tracking system</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bus Number
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="e.g., ABC123"
              value={busNumber}
              onChange={(e)=>setBusNumber(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Route
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="e.g., Airport - Downtown"
              value={route}
              onChange={(e)=>setRoute(e.target.value)}
            />
          </div>

          <button 
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all shadow-lg transform hover:-translate-y-1 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
            onClick={addBus}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Bus...
              </span>
            ) : (
              'Add Bus 🚀'
            )}
          </button>
        </div>

        {showQR && (
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <h3 className="text-xl font-bold text-center mb-4 text-green-700">QR Code Generated!</h3>
            <div className="bg-gradient-to-b from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border-2 border-green-200">
              <QRGenerator busNumber={busNumber}/>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Print this QR code and attach it to Bus {busNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddBus

