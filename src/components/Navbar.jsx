import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/login')
  }

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

          {/* Navigation Links (Desktop) */}
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

          {/* Right Side - Auth, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Auth section (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-700/50 dark:bg-green-900/50 rounded-full">
                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 bg-white hover:bg-green-50 text-green-700 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <ThemeToggle />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-700 transition"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-green-500/30 mt-2 pt-3 space-y-2 animate-[slideDown_0.2s_ease-out]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
              Home
            </Link>
            <Link to="/disease-detection" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
              Disease Detection
            </Link>
            <Link to="/advisory" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
              Farmer Advisory
            </Link>
            <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
              History
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
              About
            </Link>

            {/* Mobile auth section */}
            <div className="border-t border-green-500/30 pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-green-200">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-green-700/50 transition font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
