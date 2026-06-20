import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function DiseaseDetection() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Disease Detection</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Welcome to the Disease Detection module. Upload an image of your affected crop and our AI model will analyze it 
              to identify potential diseases. You'll receive detailed information about the disease, confidence score, treatment 
              recommendations, and preventive measures.
            </p>

            {/* Placeholder Content */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-100 dark:bg-gray-600 rounded-lg h-64 flex items-center justify-center transition-colors duration-200">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">Upload Image Area</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">How it Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Upload a clear image of the affected crop</li>
                    <li>AI analyzes the image for disease indicators</li>
                    <li>Receive detailed diagnosis with confidence score</li>
                    <li>View treatment recommendations</li>
                    <li>Check preventive measures for the future</li>
                  </ol>
                </div>

                <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
                  Upload Image (Coming Soon)
                </button>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-600 dark:border-green-400 p-4 rounded transition-colors duration-200">
              <p className="text-green-800 dark:text-green-100">
                <span className="font-bold">Note:</span> This is a placeholder for Week 2 deliverable. 
                Full AI model integration coming in later weeks.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
