import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import DiseaseDetection from './pages/DiseaseDetection'
import Advisory from './pages/Advisory'
import History from './pages/History'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <ErrorBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />

                {/* Protected routes */}
                <Route path="/disease-detection" element={
                  <ProtectedRoute><DiseaseDetection /></ProtectedRoute>
                } />
                <Route path="/advisory" element={
                  <ProtectedRoute><Advisory /></ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute><History /></ProtectedRoute>
                } />
              </Routes>
            </ErrorBoundary>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
