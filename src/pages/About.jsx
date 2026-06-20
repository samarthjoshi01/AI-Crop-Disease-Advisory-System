import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">About CropCare AI</h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              CropCare AI is an innovative AI-powered platform that leverages cutting-edge technology 
              to empower farmers with instant crop disease detection and personalized agricultural guidance.
            </p>

            {/* Sections */}
            <div className="space-y-8 mb-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To empower farmers with AI-driven solutions that help them identify crop diseases early, 
                  receive expert guidance, and make data-driven decisions to maximize crop yield and minimize losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Technology Stack</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-green-600 dark:text-green-400 mb-2">Frontend</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>React.js</li>
                      <li>Vite</li>
                      <li>Tailwind CSS</li>
                      <li>React Router</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 dark:text-green-400 mb-2">Backend & AI</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      <li>Node.js & Express.js</li>
                      <li>TensorFlow CNN</li>
                      <li>Gemini API</li>
                      <li>MongoDB</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Features</h2>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>AI-powered crop disease detection from images</li>
                  <li>Confidence scores and disease identification</li>
                  <li>Treatment recommendations and preventive measures</li>
                  <li>Farmer advisory chatbot for agricultural guidance</li>
                  <li>Diagnosis history tracking and monitoring</li>
                  <li>Responsive design for mobile and desktop</li>
                </ul>
              </section>


            </div>


          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
