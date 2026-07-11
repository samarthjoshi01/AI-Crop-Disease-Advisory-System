import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('cropcare_token'))
  const [loading, setLoading] = useState(true)

  // On mount (or token change), rehydrate user from the stored token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await authApi.getMe()
          setUser(data.data.user)
        } catch (err) {
          // Token is invalid or expired — clear it
          console.error('Token validation failed:', err.message)
          localStorage.removeItem('cropcare_token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  const login = async (email, password) => {
    const data = await authApi.login(email, password)
    const { user: userData, token: newToken } = data.data
    localStorage.setItem('cropcare_token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password)
    const { user: userData, token: newToken } = data.data
    localStorage.setItem('cropcare_token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  /**
   * Login with a pre-existing JWT token (used by OAuth callback).
   * Stores the token and fetches the user profile.
   */
  const loginWithToken = useCallback(async (newToken) => {
    localStorage.setItem('cropcare_token', newToken)
    setToken(newToken)
    const data = await authApi.getMe()
    setUser(data.data.user)
    return data.data.user
  }, [])

  const logout = () => {
    localStorage.removeItem('cropcare_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
