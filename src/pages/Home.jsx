import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Card from '../components/Card'
import Footer from '../components/Footer'
import { Loader } from '../components/ui'

const API_BASE = 'http://localhost:5000/api'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch live stats from backend on mount — visible in Chrome DevTools Network tab
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [healthRes, diagnosesRes, advisoriesRes] = await Promise.all([
          fetch(`${API_BASE}/health`),
          fetch(`${API_BASE}/diagnoses`),
          fetch(`${API_BASE}/advisories`)
        ])

        const health = await healthRes.json()
        const diagnoses = await diagnosesRes.json()
        const advisories = await advisoriesRes.json()

        setStats({
          serverStatus: health.success ? 'Online' : 'Offline',
          totalDiagnoses: diagnoses.count || 0,
          totalAdvisories: advisories.count || 0,
          recentDiagnoses: diagnoses.data?.slice(0, 3) || []
        })
      } catch (err) {
        setError('Backend server is not running. Start it with: cd backend && npm run dev')
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const features = [
    {
      title: 'Disease Detection',
      description: 'Upload an image of your crop and get instant AI-powered disease detection with confidence scores and treatment recommendations.',
      actionText: 'Detect Disease'
    },
    {
      title: 'Farmer Advisory',
      description: 'Chat with our AI-powered advisor for personalized agricultural guidance, crop care tips, and disease prevention strategies.',
      actionText: 'Get Advice'
    },
    {
      title: 'Diagnosis History',
      description: 'Keep track of all your crop disease diagnoses, treatments applied, and monitor your farm health over time.',
      actionText: 'View History'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to protect your crops and maximize yield</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                title={feature.title}
                description={feature.description}
                actionText={feature.actionText}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Backend Stats Section — shows real API data */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">System Dashboard</h2>
            <p className="text-gray-500 dark:text-gray-400">Live data from the backend API</p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader size="lg" variant="spinner" />
              <p className="text-gray-500 dark:text-gray-400">Connecting to backend server...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <svg className="w-10 h-10 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 dark:text-red-300 font-semibold mb-1">Backend Not Connected</p>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {stats && !error && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Server Status */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center transition-colors duration-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.serverStatus}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">API Server Status</p>
              </div>

              {/* Diagnosis Count */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center transition-colors duration-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalDiagnoses}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Disease Diagnoses</p>
              </div>

              {/* Advisory Count */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center transition-colors duration-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalAdvisories}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Advisory Sessions</p>
              </div>
            </div>
          )}

          {/* Recent Diagnoses Table */}
          {stats && stats.recentDiagnoses.length > 0 && !error && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Diagnoses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white text-sm">Crop</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white text-sm">Disease</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white text-sm">Confidence</th>
                      <th className="px-4 py-3 font-bold text-gray-800 dark:text-white text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDiagnoses.map((d) => (
                      <tr key={d.id} className="border-b border-gray-200 dark:border-gray-600">
                        <td className="px-4 py-3 text-gray-800 dark:text-white font-medium">{d.cropName}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.diseaseName}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono">{d.confidence?.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            d.status === 'Treated'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : d.status === 'Under Treatment'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
