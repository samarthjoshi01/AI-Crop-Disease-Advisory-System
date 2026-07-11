import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const oauthError = searchParams.get('error')

      if (oauthError) {
        setError('OAuth login failed. Please try again.')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (!token) {
        setError('No authentication token received.')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      try {
        await loginWithToken(token)
        navigate('/')
      } catch (err) {
        setError('Failed to authenticate. Please try again.')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate, loginWithToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="relative text-center">
        {error ? (
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-10 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Authentication Error</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-10 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30 mb-4">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Completing Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400">Authenticating with GitHub...</p>
          </div>
        )}
      </div>
    </div>
  )
}
