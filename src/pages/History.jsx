import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { diagnosisApi } from '../api/apiClient'

export default function History() {
  const [diagnoses, setDiagnoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 3000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Fetch all diagnoses on mount
  useEffect(() => {
    fetchDiagnoses()
  }, [])

  const fetchDiagnoses = async () => {
    setLoading(true)
    try {
      const response = await diagnosisApi.getAll()
      setDiagnoses(response.data)
    } catch (error) {
      addToast(error.message || 'Failed to load diagnosis history', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Search diagnoses
  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = searchQuery.trim()
        ? await diagnosisApi.search(searchQuery)
        : await diagnosisApi.getAll()
      setDiagnoses(response.data)
      if (searchQuery.trim() && response.data.length === 0) {
        addToast(`No results found for "${searchQuery}"`, 'info')
      }
    } catch (error) {
      addToast(error.message || 'Search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Delete a diagnosis
  const handleDelete = async (id, cropName) => {
    if (!window.confirm(`Delete diagnosis for "${cropName}"?`)) return

    try {
      await diagnosisApi.delete(id)
      setDiagnoses((prev) => prev.filter((d) => d.id !== id))
      addToast(`Diagnosis for "${cropName}" deleted successfully`, 'success')
    } catch (error) {
      addToast(error.message || 'Failed to delete diagnosis', 'error')
    }
  }

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Treated':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'Under Treatment':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'Detected':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Diagnosis History</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              View your complete diagnosis history to track crop diseases, monitor trends, and see the effectiveness 
              of treatments applied. This helps you maintain better records and plan preventive strategies for future seasons.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by crop name, disease, or status..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg 
                    hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); fetchDiagnoses(); }}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 
                      font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader size="lg" variant="spinner" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading diagnosis history...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && diagnoses.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No diagnosis records found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  {searchQuery ? 'Try a different search term' : 'Submit a crop image for disease detection to create your first record'}
                </p>
              </div>
            )}

            {/* Diagnosis Table */}
            {!loading && diagnoses.length > 0 && (
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-600 border-b-2 border-gray-300 dark:border-gray-500 transition-colors duration-200">
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Date</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Crop</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Disease</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Confidence</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white">Status</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnoses.map((diagnosis) => (
                      <tr
                        key={diagnosis.id}
                        className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                          {new Date(diagnosis.diagnosisDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-gray-800 dark:text-white font-medium">
                          {diagnosis.cropName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {diagnosis.diseaseName}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono">
                          {diagnosis.confidence.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${getStatusColor(diagnosis.status)} px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200`}>
                            {diagnosis.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(diagnosis.id, diagnosis.cropName)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
                              transition-colors duration-200 p-1"
                            title="Delete diagnosis"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 text-right">
                  Showing {diagnoses.length} record{diagnoses.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
