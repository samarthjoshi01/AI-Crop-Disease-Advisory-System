import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { advisoryApi } from '../api/apiClient'

export default function Advisory() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [toasts, setToasts] = useState([])
  const messagesEndRef = useRef(null)

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 3000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch existing advisories on mount
  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const response = await advisoryApi.getAll()
        // Convert advisories to chat messages format
        const chatMessages = []
        response.data.forEach((advisory) => {
          chatMessages.push({
            id: advisory.id + '-q',
            type: 'user',
            text: advisory.question,
            timestamp: advisory.createdAt
          })
          chatMessages.push({
            id: advisory.id + '-a',
            type: 'bot',
            text: advisory.answer,
            category: advisory.category,
            timestamp: advisory.createdAt
          })
        })
        setMessages(chatMessages)
      } catch (error) {
        addToast(error.message || 'Failed to load advisory history', 'error')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchAdvisories()
  }, [])

  // Submit a new question
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || loading) return

    const question = inputValue.trim()
    setInputValue('')

    // Add user message immediately
    const userMsgId = Date.now()
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        type: 'user',
        text: question,
        timestamp: new Date().toISOString()
      }
    ])

    setLoading(true)
    try {
      const response = await advisoryApi.create(question)
      const advisory = response.data

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: advisory.id + '-a',
          type: 'bot',
          text: advisory.answer,
          category: advisory.category,
          timestamp: advisory.createdAt
        }
      ])
    } catch (error) {
      addToast(error.message || 'Failed to get advisory response', 'error')
      // Add error message in chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + '-err',
          type: 'bot',
          text: 'Sorry, I encountered an error processing your question. Please try again.',
          category: 'Error',
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Sample questions for quick access
  const sampleQuestions = [
    'How to prevent tomato leaf blight?',
    'Best organic fertilizer for rice?',
    'How to manage water for cotton crops?',
    'How to identify pest infestation in maize?'
  ]

  const handleSampleQuestion = (question) => {
    setInputValue(question)
  }

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
              disease prevention, pest management, seasonal planning, and more.
            </p>

            {/* Chat Area */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="bg-gray-100 dark:bg-gray-600 rounded-lg h-96 flex flex-col transition-colors duration-200">
                  {/* Messages Area */}
                  <div className="flex-grow p-4 overflow-y-auto">
                    {initialLoading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Loader size="md" variant="spinner" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading conversation...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Welcome Message */}
                        <div className="flex justify-start">
                          <div className="bg-green-100 dark:bg-green-900 text-gray-800 dark:text-green-100 rounded-lg px-4 py-2 max-w-sm transition-colors duration-200">
                            <p className="text-sm">Hello! I'm your Farmer Advisory chatbot. Ask me about crop care, diseases, pests, or farming best practices!</p>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`rounded-lg px-4 py-2 max-w-sm transition-colors duration-200 ${
                                msg.type === 'user'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-green-100 dark:bg-green-900 text-gray-800 dark:text-green-100'
                              }`}
                            >
                              {msg.category && msg.type === 'bot' && (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400 block mb-1">
                                  {msg.category}
                                </span>
                              )}
                              <p className="text-sm whitespace-pre-line">{msg.text}</p>
                            </div>
                          </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="bg-green-100 dark:bg-green-900 rounded-lg px-4 py-3 transition-colors duration-200">
                              <div className="flex gap-1.5 items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleSubmit} className="border-t border-gray-300 dark:border-gray-500 p-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything about farming..." 
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                          placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                        disabled={loading || initialLoading}
                      />
                      <button
                        type="submit"
                        disabled={loading || initialLoading || !inputValue.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar — Sample Questions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Quick Questions:</h3>
                  <ul className="space-y-2">
                    {sampleQuestions.map((q, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleSampleQuestion(q)}
                          disabled={loading}
                          className="w-full text-left text-sm text-gray-600 dark:text-gray-300 
                            hover:text-green-600 dark:hover:text-green-400 
                            bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2
                            hover:bg-green-50 dark:hover:bg-green-900/30
                            transition-colors duration-200 
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-0.5">→</span>
                          <span>{q}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2">Topics I can help with:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Disease Prevention', 'Pest Management', 'Water Management', 'Soil & Fertilizers', 'Seasonal Planning', 'Harvest & Yield'].map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 dark:border-blue-400 p-4 rounded transition-colors duration-200">
              <p className="text-blue-800 dark:text-blue-100">
                <span className="font-bold">Note:</span> Currently using simulated AI responses. 
                Full Gemini API integration coming in later weeks for more accurate and detailed answers.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
