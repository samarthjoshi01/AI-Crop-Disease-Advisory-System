import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-10 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Project Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 dark:text-green-300 mb-3">🌱 CropCare AI</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
              AI-Powered Crop Disease Detection and Farmer Advisory System. 
              Empowering farmers with intelligent crop management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 dark:text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-gray-400 dark:text-gray-500">
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2 text-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2 text-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/advisory" className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2 text-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Farmer Advisory
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2 text-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition-colors duration-200 flex items-center gap-2 text-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-bold text-lg mb-4 dark:text-white">Powered By</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'MongoDB', 'Gemini AI', 'Tailwind CSS', 'Express.js'].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1.5 bg-gray-700 dark:bg-gray-800 text-gray-300 dark:text-gray-400 rounded-lg text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 dark:border-gray-800 pt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CropCare AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
