import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import BusCard from './components/BusCard'
import BusModal from './components/BusModal'
import BusSearch from './components/BusSearch'
import ExpiryMonitor from './components/ExpiryMonitor'
import { PlusCircle, LayoutGrid, Clock } from 'lucide-react'

function App() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBus, setSelectedBus] = useState(null)
  const [currentView, setCurrentView] = useState('fleet')

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .order('seats', { ascending: true })

      if (error) throw error
      setBuses(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching buses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBus = async (updatedBus) => {
    try {
      setLoading(true)

      // Sanitize payload: remove system fields and convert empty strings to null
      const { id, created_at, ...updates } = updatedBus
      const payload = Object.keys(updates).reduce((acc, key) => {
        acc[key] = updates[key] === '' ? null : updates[key]
        return acc
      }, {})

      const { error } = await supabase
        .from('buses')
        .update(payload)
        .eq('id', updatedBus.id)

      if (error) throw error

      // Update local state
      const newBusState = { ...updatedBus, ...payload }
      setBuses(buses.map(bus => bus.id === updatedBus.id ? newBusState : bus))

      setSelectedBus(null)
      alert('Автобус успішно оновлено!')
    } catch (err) {
      console.error('Error updating bus:', err)
      alert('Помилка оновлення автобуса: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredBuses = buses.filter(bus =>
    bus.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.make_model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Мисан Транс</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Автопарк</span>
            </div>
            <BusSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setCurrentView('fleet')}
              className={`py-2 px-4 flex items-center font-medium border-b-2 transition-colors ${currentView === 'fleet'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <LayoutGrid size={18} className="mr-2" />
              Автопарк
            </button>
            <button
              onClick={() => setCurrentView('monitor')}
              className={`py-2 px-4 flex items-center font-medium border-b-2 transition-colors ${currentView === 'monitor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Clock size={18} className="mr-2" />
              Моніторинг Термінів
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert">
            <p className="font-bold">Помилка</p>
            <p>{error}</p>
            <p className="text-sm mt-1">Please check your Supabase connection and API keys.</p>
          </div>
        )}

        {loading && !buses.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {currentView === 'fleet' ? (
              <>
                <div className="mb-4 text-gray-600 text-sm">
                  Відображено {filteredBuses.length} з {buses.length} автобусів
                </div>

                {filteredBuses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBuses.map(bus => (
                      <BusCard
                        key={bus.id}
                        bus={bus}
                        onClick={setSelectedBus}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Автобусів не знайдено.</p>
                  </div>
                )}
              </>
            ) : (
              <ExpiryMonitor buses={buses} onEditBus={setSelectedBus} searchTerm={searchTerm} />
            )}
          </>
        )}
      </main>

      {selectedBus && (
        <BusModal
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onSave={handleUpdateBus}
        />
      )}
    </div>
  )
}

export default App
