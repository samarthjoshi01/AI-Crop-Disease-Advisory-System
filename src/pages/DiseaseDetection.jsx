import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { diagnosisApi, aiApi } from '../api/apiClient'

export default function DiseaseDetection() {
  const [formData, setFormData] = useState({
    cropName: '',
    diseaseName: '',
    confidence: '',
    treatment: '',
    preventiveMeasures: ''
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 4000 }])
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

  // AI Analysis handler
  const handleAiAnalysis = async () => {
    if (!formData.cropName.trim() || !formData.diseaseName.trim()) {
      addToast('Enter crop name and disease name for AI analysis', 'warning')
      return
    }

    setAiLoading(true)
    setAiAnalysis(null)
    try {
      const response = await aiApi.diagnose(
        formData.cropName.trim(),
        formData.diseaseName.trim(),
        formData.treatment.trim() || formData.preventiveMeasures.trim()
      )
      setAiAnalysis(response.data)
      addToast('AI analysis complete!', 'success')
    } catch (error) {
      addToast(error.message || 'AI analysis failed. Please try again.', 'error')
    } finally {
      setAiLoading(false)
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

  // Severity badge color helper
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700'
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700'
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700'
    }
  }

  // Render formatted AI analysis text
  const renderAnalysis = (text) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Bold headers: **Text:**
      if (/^\*\*(.+?)\*\*$/.test(line) || /^\*\*(.+?):\*\*$/.test(line)) {
        elements.push(
          <h4 key={key++} className="font-bold text-gray-800 dark:text-white mt-3 mb-1 text-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            {line.replace(/\*\*/g, '')}
          </h4>
        )
      }
      // Numbered list items
      else if (/^\d+[\.\)]\s/.test(line)) {
        elements.push(
          <p key={key++} className="text-sm text-gray-700 dark:text-gray-300 ml-4 mb-1">
            {line}
          </p>
        )
      }
      // Bullet list items
      else if (/^[-•]\s/.test(line)) {
        elements.push(
          <p key={key++} className="text-sm text-gray-700 dark:text-gray-300 ml-4 mb-1">
            {line}
          </p>
        )
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-1" />)
      }
      // Regular text with inline bold
      else {
        const parts = line.split(/(\*\*.*?\*\*)/g)
        elements.push(
          <p key={key++} className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {parts.map((part, idx) =>
              /^\*\*(.+?)\*\*$/.test(part) ? (
                <strong key={idx} className="font-semibold text-gray-800 dark:text-gray-100">
                  {part.replace(/\*\*/g, '')}
                </strong>
              ) : (
                <span key={idx}>{part}</span>
              )
            )}
          </p>
        )
      }
    }

    return <div>{elements}</div>
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
              Submit crop disease information for analysis. Use the <strong>AI Analysis</strong> button to get 
              AI-powered treatment recommendations, severity assessment, and prevention tips from Google Gemini.
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
                    disabled={loading || aiLoading}
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
                    disabled={loading || aiLoading}
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
                    disabled={loading || aiLoading}
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
                    disabled={loading || aiLoading}
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
                    disabled={loading || aiLoading}
                  />
                </div>

                {/* Button Row: Submit + AI Analysis */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || aiLoading}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg 
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

                  <button
                    type="button"
                    onClick={handleAiAnalysis}
                    disabled={loading || aiLoading || !formData.cropName.trim() || !formData.diseaseName.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg 
                      hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2 shadow-md"
                  >
                    {aiLoading ? (
                      <>
                        <Loader size="sm" variant="spinner" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        AI Analysis
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Right Column — How it works + Result */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">How it Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Enter the crop name and detected disease</li>
                    <li>Add confidence score if available</li>
                    <li>Include treatment and preventive notes</li>
                    <li><strong>Click "AI Analysis"</strong> for AI-powered insights</li>
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

            {/* AI Analysis Result Card */}
            {(aiLoading || aiAnalysis) && (
              <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    AI Disease Analysis
                  </h3>
                  {aiAnalysis && (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(aiAnalysis.severity)}`}>
                        Severity: {aiAnalysis.severity}
                      </span>
                      <span className="text-xs text-purple-500 dark:text-purple-400">
                        ✨ Gemini AI
                      </span>
                    </div>
                  )}
                </div>

                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader size="lg" variant="spinner" />
                    <div className="text-center">
                      <p className="text-purple-700 dark:text-purple-300 font-medium">
                        AI is analyzing the disease...
                      </p>
                      <p className="text-purple-500 dark:text-purple-400 text-sm mt-1">
                        Generating treatment plan, prevention tips, and severity assessment
                      </p>
                    </div>
                  </div>
                ) : (
                  aiAnalysis && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{aiAnalysis.cropName}</span>
                        <span>·</span>
                        <span>{aiAnalysis.diseaseName}</span>
                        <span>·</span>
                        <span className="text-xs">{new Date(aiAnalysis.analyzedAt).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        {renderAnalysis(aiAnalysis.analysis)}
                      </div>
                    </div>
                  )
                )}
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
