import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { aiApi } from '../api/apiClient'

export default function DiseaseDetection() {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageData, setImageData] = useState(null) // { base64, mimeType }
  const [cropName, setCropName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [toasts, setToasts] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 5000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Compress image using Canvas to reduce base64 size for faster AI processing
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to compressed JPEG base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        const base64String = dataUrl.split(',')[1]
        resolve({ base64: base64String, mimeType: 'image/jpeg' })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      addToast('Please upload a JPEG, PNG, WebP, or GIF image.', 'warning')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be smaller than 5MB.', 'warning')
      return
    }

    // Create preview (full quality)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Compress and convert to base64 for AI (smaller = faster Gemini response)
    const compressed = await compressImage(file)
    setImageData(compressed)

    // Clear previous result
    setResult(null)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const clearImage = () => {
    setImagePreview(null)
    setImageData(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDetect = async () => {
    if (!imageData) {
      addToast('Please upload a crop image first.', 'warning')
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const response = await aiApi.detectFromImage(
        imageData.base64,
        imageData.mimeType,
        cropName.trim()
      )
      setResult(response.data)
      addToast(
        response.data.detection.isHealthy
          ? 'Your crop looks healthy! 🌱'
          : `Disease detected: ${response.data.detection.diseaseName}`,
        response.data.detection.isHealthy ? 'success' : 'info'
      )
    } catch (error) {
      addToast(error.message || 'Disease detection failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Severity badge styling
  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700'
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700'
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-12 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full mb-4 shadow-lg shadow-green-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              AI-Powered Vision Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
              Crop Disease Detection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload a photo of your crop and our AI will instantly identify any diseases,
              provide treatment recommendations, and save the diagnosis to your history.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Upload Section */}
            <div className="space-y-6">
              {/* Image Upload Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden
                  ${dragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.02]'
                    : imagePreview
                      ? 'border-green-400 dark:border-green-600 bg-white dark:bg-gray-700'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-green-400 dark:hover:border-green-500'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded crop"
                      className="w-full h-80 object-cover"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">Image uploaded — ready to analyze</p>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="crop-image-upload"
                    className="flex flex-col items-center justify-center h-80 cursor-pointer p-8"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      Upload Crop Image
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      JPEG, PNG, WebP, GIF — Max 5MB
                    </p>
                  </label>
                )}
                <input
                  ref={fileInputRef}
                  id="crop-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* Optional Crop Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Crop Name <span className="text-gray-400 font-normal">(optional — helps AI accuracy)</span>
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g., Tomato, Rice, Wheat, Potato..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
                    placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                  disabled={loading}
                />
              </div>

              {/* Detect Button */}
              <button
                onClick={handleDetect}
                disabled={loading || !imageData}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                  text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40
                  transform hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                  flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader size="sm" variant="spinner" />
                    <span>AI is analyzing your crop...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Detect Disease
                  </>
                )}
              </button>

              {/* How it Works */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How It Works
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Take a clear photo of the affected crop/leaf</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Upload the image (optionally enter crop name)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Click <strong>"Detect Disease"</strong> — AI analyzes the image</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Get disease name, treatment plan, and prevention tips</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right: Results Section */}
            <div className="space-y-6">
              {/* Loading State */}
              {loading && (
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-10 border border-gray-200 dark:border-gray-600 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                    <Loader size="lg" variant="spinner" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Analyzing Your Crop...</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Our AI is examining the image to identify diseases, assess severity, and prepare treatment recommendations.
                  </p>
                  <div className="mt-4 flex justify-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !loading && (
                <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                  {/* Detection Summary Card */}
                  <div className={`rounded-2xl p-6 border ${
                    result.detection.isHealthy
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          result.detection.isHealthy
                            ? 'bg-green-200 dark:bg-green-800'
                            : 'bg-red-200 dark:bg-red-800'
                        }`}>
                          {result.detection.isHealthy ? (
                            <svg className="w-6 h-6 text-green-700 dark:text-green-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-red-700 dark:text-red-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {result.detection.diseaseName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Crop: {result.detection.cropName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityStyle(result.detection.severity)}`}>
                          {result.detection.severity}
                        </span>
                        <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-200">
                          {result.detection.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          result.detection.confidence >= 80 ? 'bg-green-500' :
                          result.detection.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.detection.confidence}%` }}
                      />
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.detection.description}
                    </p>
                  </div>

                  {/* Treatment Plan */}
                  {result.detection.treatment && (
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Treatment Plan
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {result.detection.treatment}
                      </p>
                    </div>
                  )}

                  {/* Prevention Tips */}
                  {result.detection.preventiveMeasures && (
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Prevention Tips
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {result.detection.preventiveMeasures}
                      </p>
                    </div>
                  )}

                  {/* Auto-saved notice */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Diagnosis auto-saved to your <strong>History</strong> — powered by Gemini AI</span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!result && !loading && (
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-10 border border-gray-200 dark:border-gray-600 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Upload a photo of your crop on the left and click "Detect Disease" to get an AI-powered analysis.
                  </p>

                  {/* Tips */}
                  <div className="mt-6 text-left bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2">📸 Tips for Best Results</h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Take a clear, well-lit photo of the affected area</li>
                      <li>• Focus on the diseased leaves, stems, or fruits</li>
                      <li>• Include both healthy and affected parts for comparison</li>
                      <li>• Avoid blurry or very dark images</li>
                    </ul>
                  </div>
                </div>
              )}
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
