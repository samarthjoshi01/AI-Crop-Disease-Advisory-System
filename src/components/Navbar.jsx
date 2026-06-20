import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="bg-green-600 dark:bg-green-800 text-white shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/App Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white hover:text-green-100 transition">
              CropCare AI
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-green-100 transition font-medium">
              Home
            </Link>
            <Link to="/disease-detection" className="hover:text-green-100 transition font-medium">
              Disease Detection
            </Link>
            <Link to="/advisory" className="hover:text-green-100 transition font-medium">
              Farmer Advisory
            </Link>
            <Link to="/history" className="hover:text-green-100 transition font-medium">
              History
            </Link>
            <Link to="/about" className="hover:text-green-100 transition font-medium">
              About
            </Link>
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-700 transition">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
