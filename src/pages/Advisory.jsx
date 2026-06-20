import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Advisory() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Farmer Advisory</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Get personalized agricultural guidance from our AI-powered advisor. Ask questions about crop care, 
              disease prevention, pest management, seasonal planning, and more. Our intelligent chatbot is trained to 
              provide expert recommendations tailored to your farming needs.
            </p>

            {/* Placeholder Chatbot Area */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="bg-gray-100 dark:bg-gray-600 rounded-lg h-96 flex flex-col transition-colors duration-200">
                  <div className="flex-grow p-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-green-100 dark:bg-green-900 text-gray-800 dark:text-green-100 rounded-lg px-4 py-2 max-w-xs transition-colors duration-200">
                          <p className="text-sm">Hello! I'm your Farmer Advisory chatbot. How can I help you today?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-500 p-4">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about farming..." 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Sample Questions:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>How to prevent tomato leaf blight?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Best time to plant wheat in monsoon?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Organic fertilizers for rice farming</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Managing water for cotton crops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 dark:border-blue-400 p-4 rounded transition-colors duration-200">
              <p className="text-blue-800 dark:text-blue-100">
                <span className="font-bold">Note:</span> This is a placeholder for Week 2 deliverable. 
                Chatbot functionality with Gemini API integration coming in later weeks.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
