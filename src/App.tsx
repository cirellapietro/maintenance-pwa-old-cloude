import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context providers che creeremo
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TrackingProvider } from './contexts/TrackingContext'

// Components che creeremo
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages che creeremo
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import VehicleDetail from './pages/VehicleDetail'
import Tracking from './pages/Tracking'
import Maintenance from './pages/Maintenance'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import MinimalTracking from './pages/MinimalTracking'

// PWA install prompt handling
const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Installa App</h3>
          <p className="text-sm opacity-90">Installa l'app per un'esperienza migliore</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-3 py-1 text-sm bg-blue-500 rounded"
          >
            Dopo
          </button>
          <button
            onClick={handleInstall}
            className="px-3 py-1 text-sm bg-white text-blue-600 rounded font-semibold"
          >
            Installa
          </button>
        </div>
      </div>
    </div>
  )
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Public Route (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// App Mode Detection
const useAppMode = () => {
  const [isMinimalMode, setIsMinimalMode] = useState(false)
  
  useEffect(() => {
    // Check if user has enabled minimal mode
    const minimalMode = localStorage.getItem('app-minimal-mode') === 'true'
    setIsMinimalMode(minimalMode)
  }, [])
  
  return { isMinimalMode, setIsMinimalMode }
}

function AppContent() {
  const { user, loading } = useAuth()
  const { isMinimalMode } = useAppMode()

  if (loading) {
    return <LoadingSpinner />
  }

  // If user is logged in and in minimal mode, show only tracking
  if (user && isMinimalMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MinimalTracking />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </Router>
  )
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <TrackingProvider>
          <AppContent />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              className: 'bg-white shadow-lg'
            }}
          />
        </TrackingProvider>
      </AuthProvider>
    </div>
  )
}

export default App
