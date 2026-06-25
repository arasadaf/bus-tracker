import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "react-router-dom"

function Scanner(){
  const [searchParams, setSearchParams] = useSearchParams()
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState("")
  const [scannerActive, setScannerActive] = useState(true)

  useEffect(()=>{
    if (!scannerActive) return

    const scanner = new Html5QrcodeScanner(
      "reader",
      {fps:10,qrbox: {width: 300, height: 300}, formatsToSupport: ["QR_CODE"]}
    )

    scanner.render(
      async(result)=>{
        console.log("QR RESULT:",result)
        
        try {
          const response = await axios.post("http://localhost:5000/scan",{
            qrCode:result
          })
          
          setScanResult({
            type: response.data.type,
            bus: response.data.bus,
            route: response.data.route,
            time: response.data.time,
            message: response.data.message
          })
          setScannerActive(false)
          scanner.clear()
          
        } catch (err) {
          setError(err.response?.data?.message || "Scan failed")
          console.error("Scan error:", err)
        }
      },
      (errorMessage)=>{
        // The scanner throws an error on every frame it doesn't see a QR code.
        // We only want to log or show errors that are actual system errors, not frame scan failures.
        if (!errorMessage?.includes("NotFoundException")) {
          console.warn("Scanner warning/error:", errorMessage)
          // Only set visual error for critical issues to avoid UI flickering
          if (errorMessage?.includes("NotAllowedError") || errorMessage?.includes("NotFoundError")) {
             setError("Camera access denied or camera not found.")
          }
        }
      }
    )

    return () => {
      scanner.clear()
    }
  }, [scannerActive])

  const resetScanner = () => {
    setScanResult(null)
    setError("")
    setScannerActive(true)
  }

  return(
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 shadow-xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">📱</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Scan Bus QR Code
          </h1>
          <p className="text-xl text-gray-600">Point camera at bus QR code to track entry/exit</p>
        </div>

        {error && !scanResult && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg text-red-800 font-medium">{error}</p>
            <button 
              onClick={resetScanner}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {scannerActive && !scanResult && (
          <div id="reader" className="mb-8"></div>
        )}

        {scanResult && (
          <div className="text-center p-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl border-4 border-green-200 shadow-2xl">
            <div className="text-6xl mb-6">
              {scanResult.type === 'entry' ? '🚍' : '🚪'}
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              {scanResult.type === 'entry' ? 'Entry Recorded!' : 'Exit Recorded!'}
            </h2>
            <div className="space-y-2 mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <span className="font-semibold text-gray-700">Bus:</span> {scanResult.bus}
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <span className="font-semibold text-gray-700">Route:</span> {scanResult.route}
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <span className="font-semibold text-gray-700">Time:</span> {scanResult.time}
              </div>
            </div>
            <button 
              onClick={resetScanner}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:-translate-y-1"
            >
              Scan Another Bus
            </button>
          </div>
        )}

        {!scannerActive && !scanResult && (
          <div className="text-center p-12">
            <div className="text-6xl mb-6">🔄</div>
            <p className="text-xl text-gray-500 mb-8">Processing scan...</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Make sure QR code is well-lit and fully visible</p>
      </div>
    </div>
  )
}

export default Scanner

