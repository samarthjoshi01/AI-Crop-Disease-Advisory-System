import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { diagnosisApi } from '../api/apiClient'

export default function DiseaseDetection() {
  const [formData, setFormData] = useState({
    cropName: '',
    diseaseName: '',
    confidence: '',
    treatment: '',
    preventiveMeasures: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 3000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!formData.cropName.trim() || !formData.diseaseName.trim()) {
      addToast('Crop name and disease name are required', 'warning')
      return
    }

    setLoading(true)
    try {
      const payload = {
        cropName: formData.cropName.trim(),
        diseaseName: formData.diseaseName.trim(),
        confidence: formData.confidence ? parseFloat(formData.confidence) : 0,
        treatment: formData.treatment.trim(),
        preventiveMeasures: formData.preventiveMeasures.trim()
      }

      const response = await diagnosisApi.create(payload)
      setResult(response.data)
      addToast('Diagnosis submitted successfully!', 'success')

      // Reset form
      setFormData({
        cropName: '',
        diseaseName: '',
        confidence: '',
        treatment: '',
        preventiveMeasures: ''
      })
    } catch (error) {
      addToast(error.message || 'Failed to submit diagnosis', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Status badge color helper
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Disease Detection</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Submit crop disease information for analysis. Enter the crop name, detected disease, and any 
              treatment details. Our system will record the diagnosis and provide recommendations.
            </p>

            {/* Diagnosis Form + Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Crop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    placeholder="e.g., Tomato, Rice, Wheat"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Disease Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="diseaseName"
                    value={formData.diseaseName}
                    onChange={handleChange}
                    placeholder="e.g., Early Blight, Blast Disease"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Confidence Score (%)
                  </label>
                  <input
                    type="number"
                    name="confidence"
                    value={formData.confidence}
                    onChange={handleChange}
                    placeholder="0 - 100"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Treatment Notes
                  </label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    placeholder="Describe the treatment applied or recommended..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200 resize-none"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Preventive Measures
                  </label>
                  <textarea
                    name="preventiveMeasures"
                    value={formData.preventiveMeasures}
                    onChange={handleChange}
                    placeholder="List preventive measures for the future..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                      placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200 resize-none"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg 
                    hover:bg-green-700 transition-colors duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" variant="spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Diagnosis'
                  )}
                </button>
              </form>

              {/* Right Column — How it works + Result */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">How it Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Enter the crop name and detected disease</li>
                    <li>Add confidence score if available</li>
                    <li>Include treatment and preventive notes</li>
                    <li>Submit to record the diagnosis</li>
                    <li>View all records in the History page</li>
                  </ol>
                </div>

                {/* Latest Result */}
                {result && (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Latest Diagnosis Result
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Crop:</span>
                        <span className="text-gray-800 dark:text-white font-medium">{result.cropName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Disease:</span>
                        <span className="text-gray-800 dark:text-white font-medium">{result.diseaseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                        <span className="text-gray-800 dark:text-white font-mono">{result.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`${getStatusColor(result.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {result.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="text-gray-800 dark:text-white text-xs">
                          {new Date(result.diagnosisDate).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {result.treatment && (
                        <div className="pt-2 border-t border-green-200 dark:border-green-700">
                          <span className="text-gray-600 dark:text-gray-400 block mb-1">Treatment:</span>
                          <p className="text-gray-800 dark:text-gray-200 text-xs">{result.treatment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-600 dark:border-green-400 p-4 rounded transition-colors duration-200">
              <p className="text-green-800 dark:text-green-100">
                <span className="font-bold">Tip:</span> For AI-powered image analysis, the full model integration 
                is coming in later weeks. Currently, you can manually record your diagnosis observations.
              </p>
            </div>
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
