import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Crop Disease Detection and Farmer Advisory System
            </h1>
            <p className="text-lg text-green-50 mb-8 leading-relaxed">
              Empowering farmers with cutting-edge AI technology to identify crop diseases instantly, 
              receive expert treatment recommendations, and access agricultural guidance anytime, anywhere.
            </p>
            <Link 
              to="/disease-detection"
              className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Placeholder Hero Image */}
          <div className="bg-green-400 rounded-lg h-80 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto text-white mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              <p className="text-white font-semibold">Hero Image Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
