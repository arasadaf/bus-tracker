import {BrowserRouter, Link, Routes, Route, useLocation} from "react-router-dom"
import AddBus from "./pages/AddBus"
import Scanner from "./components/Scanner"
import LiveMap from "./pages/LiveMap"
import DriverSimulation from "./pages/DriverSimulation"
import { useState, useEffect } from "react"

function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="sticky top-0 z-50 glass shadow-sm border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/20 mr-4 transform hover:scale-105 transition-transform">
              <span className="text-white text-2xl">🚌</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Transit<span className="text-gradient">Live</span>
            </h1>
          </div>
          <div className="flex space-x-3 items-center">
            <Link 
              to="/" 
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-white/50'
              }`}
            >
              Add Bus
            </Link>
            <Link 
              to="/scan" 
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                location.pathname === '/scan' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-white/50'
              }`}
            >
              Scan QR
            </Link>
            <Link 
              to="/map" 
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                location.pathname === '/map' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-white/50'
              }`}
            >
              Live Map
            </Link>
            <Link 
              to="/simulate" 
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                location.pathname === '/simulate' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-600 hover:bg-white/80 hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-white/50'
              }`}
            >
              Simulate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-6xl relative z-10 animate-fade-in-up">
        <Routes>
          <Route path="/" element={<AddBus/>}/>
          <Route path="/scan" element={<Scanner/>}/>
          <Route path="/map" element={<LiveMap/>}/>
          <Route path="/simulate" element={<DriverSimulation/>}/>
        </Routes>
      </main>
    </div>
  )
}

function App(){
  return(
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

