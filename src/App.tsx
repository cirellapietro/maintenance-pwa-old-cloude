import React, { useState, useEffect } from 'react'
import './styles/globals.css'

// Detect if PWA is installed
const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://')
}

// Detect mobile device
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Mock ad component for testing ad placement logic
const AdBanner: React.FC<{ type: 'admob' | 'adsense' }> = ({ type }) => {
  return (
    <div className={`ad-banner ${type === 'admob' ? 'bg-blue-100' : 'bg-green-100'}`}>
      <span className="text-xs font-medium">
        {type === 'admob' ? '📱 AdMob Ad (Mobile App)' : '💻 AdSense Ad (Web Browser)'}
      </span>
    </div>
  )
}

// Installation prompt component
const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isPWAInstalled()) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`Install prompt outcome: ${outcome}`)
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Installa l'App</h3>
          <p className="text-sm opacity-90">Per un'esperienza migliore e tracking GPS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1 text-sm bg-blue-500 rounded hover:bg-blue-400 transition-colors"
          >
            Dopo
          </button>
          <button
            onClick={handleInstall}
            className="px-3 py-1 text-sm bg-white text-blue-600 rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            Installa
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'demo'>('landing')
  const [isInstalled, setIsInstalled] = useState(false)
  const [adType, setAdType] = useState<'admob' | 'adsense'>('adsense')

  useEffect(() => {
    // Check if app is installed as PWA
    setIsInstalled(isPWAInstalled())
    
    // Determine ad type based on platform
    if (isPWAInstalled() && isMobileDevice()) {
      setAdType('admob')
    } else {
      setAdType('adsense')
    }
  }, [])

  if (currentView === 'demo') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🚗 Maintenance PWA
              </h1>
              <div className="flex items-center gap-4">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  isInstalled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isInstalled ? '📱 App Mode' : '🌐 Browser Mode'}
                </div>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Torna
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Ad Banner */}
          <div className="mb-6">
            <AdBanner type={adType} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="card">
              <h3 className="card-title">I Miei Veicoli</h3>
              <p className="text-3xl font-bold text-blue-600 my-4">3</p>
              <p className="text-sm text-gray-600">Veicoli registrati</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fiat Punto (AB123CD)</span>
                  <span className="text-green-600">✓ Attiva</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ford Focus (EF456GH)</span>
                  <span className="text-orange-600">⚠ Manutenzione</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Tracking GPS</h3>
              <div className="my-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">GPS Attivo</span>
                </div>
                <p className="text-lg font-semibold">1,247 km</p>
                <p className="text-sm text-gray-600">Tracciati questo mese</p>
              </div>
              <button className="btn btn-primary btn-sm w-full">
                Gestisci Tracking
              </button>
            </div>

            <div className="card">
              <h3 className="card-title">Manutenzioni</h3>
              <p className="text-3xl font-bold text-orange-600 my-4">2</p>
              <p className="text-sm text-gray-600">Interventi in scadenza</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Cambio Olio</div>
                  <div className="text-gray-500">Fiat Punto • tra 5 giorni</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Revisione</div>
                  <div className="text-gray-500">Ford Focus • tra 12 giorni</div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="card">
              <h3 className="card-title">Modalità App</h3>
              <div className="space-y-3 mt-4">
                <div className={`p-3 rounded border-2 ${
                  !isInstalled ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-medium">Modalità Completa</div>
                  <div className="text-sm text-gray-600">Gestione completa veicoli e manutenzioni</div>
                </div>
                <div className="p-3 rounded border-2 border-gray-200">
                  <div className="font-medium">Modalità Minimale</div>
                  <div className="text-sm text-gray-600">Solo tracking GPS km e tempi</div>
                  <button className="text-sm text-blue-600 mt-1">Attiva modalità →</button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Statistiche</h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Media km/giorno</span>
                  <span className="font-semibold">42 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ore di guida</span>
                  <span className="font-semibold">18h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo manutenzioni</span>
                  <span className="font-semibold">€ 245</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Impostazioni</h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notifiche push</span>
                  <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tracking automatico</span>
                  <div className="w-8 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backup cloud</span>
                  <div className="w-8 h-4 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Ad */}
          <div className="mt-8">
            <AdBanner type={adType} />
          </div>
        </main>

        <InstallPrompt />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🚗</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Maintenance PWA
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Gestione intelligente della manutenzione veicoli
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="font-semibold mb-2">Tracking GPS</h3>
                <p className="text-gray-600 text-sm">
                  Calcolo automatico km percorsi e tempi di utilizzo per ogni veicolo
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="font-semibold mb-2">Manutenzioni Smart</h3>
                <p className="text-gray-600 text-sm">
                  Notifiche automatiche per scadenze manutenzioni in base a km e tempo
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">PWA Native</h3>
                <p className="text-gray-600 text-sm">
                  Installabile come app nativa con notifiche push e funzionamento offline
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentView('demo')}
              className="btn btn-primary btn-lg px-8 py-4 text-lg"
            >
              Prova la Demo
            </button>
            
            <div className="text-sm text-gray-500">
              {isInstalled ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  App installata come PWA
                </span>
              ) : (
                <span>
                  Visitando dal browser • Installabile come app
                </span>
              )}
            </div>
          </div>

          {/* Status indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">PWA</div>
              <div className="text-xs text-gray-500">Progressive Web App</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">GPS</div>
              <div className="text-xs text-gray-500">Tracking automatico</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {adType === 'admob' ? 'AdMob' : 'AdSense'}
              </div>
              <div className="text-xs text-gray-500">Monetizzazione attiva</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">Real-time</div>
              <div className="text-xs text-gray-500">Sincronizzazione</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
