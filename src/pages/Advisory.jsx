import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Loader, Toast } from '../components/ui'
import { advisoryApi, aiApi } from '../api/apiClient'

export default function Advisory() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [toasts, setToasts] = useState([])
  const messagesEndRef = useRef(null)

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration: 4000 }])
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

  // Submit a new question — now uses Gemini AI
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || loading) return

    const question = inputValue.trim()

    if (question.length > 1000) {
      addToast('Question must be under 1000 characters', 'warning')
      return
    }

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
      // Call the AI-powered endpoint
      const response = await aiApi.advisory(question)
      const advisory = response.data

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: advisory.id + '-a',
          type: 'bot',
          text: advisory.answer,
          category: advisory.category,
          aiPowered: response.meta?.aiPowered || false,
          timestamp: advisory.createdAt
        }
      ])
    } catch (error) {
      addToast(error.message || 'AI service failed. Please try again.', 'error')
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

  // Simple markdown-like rendering for AI responses
  const renderFormattedText = (text) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Bold headers: **Text:**
      if (/^\*\*(.+?)\*\*$/.test(line)) {
        elements.push(
          <p key={key++} className="font-bold text-green-700 dark:text-green-300 mt-2 mb-1 text-sm">
            {line.replace(/\*\*/g, '')}
          </p>
        )
      }
      // Numbered list: 1. Text or 1) Text
      else if (/^\d+[\.\)]\s/.test(line)) {
        elements.push(
          <p key={key++} className="text-sm ml-3 mb-0.5">
            {line}
          </p>
        )
      }
      // Bullet list: - Text or • Text
      else if (/^[-•]\s/.test(line)) {
        elements.push(
          <p key={key++} className="text-sm ml-3 mb-0.5">
            {line}
          </p>
        )
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-1" />)
      }
      // Regular text
      else {
        // Handle inline bold: **text**
        const parts = line.split(/(\*\*.*?\*\*)/g)
        elements.push(
          <p key={key++} className="text-sm mb-0.5">
            {parts.map((part, idx) =>
              /^\*\*(.+?)\*\*$/.test(part) ? (
                <strong key={idx} className="font-semibold">{part.replace(/\*\*/g, '')}</strong>
              ) : (
                <span key={idx}>{part}</span>
              )
            )}
          </p>
        )
      }
    }

    return <div className="space-y-0">{elements}</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Farmer Advisory</h1>
              {/* AI Powered Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                AI Powered
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              Get personalized agricultural guidance powered by <strong>Google Gemini AI</strong>. Ask questions about crop care, 
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
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              <span className="text-xs font-bold text-purple-600 dark:text-purple-300">CropCare AI</span>
                            </div>
                            <p className="text-sm">Hello! I'm your AI-powered Farmer Advisory assistant. Ask me about crop care, diseases, pests, or farming best practices!</p>
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
                              {msg.type === 'bot' && (
                                <div className="flex items-center gap-1.5 mb-1">
                                  {msg.category && msg.category !== 'Error' && (
                                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                      {msg.category}
                                    </span>
                                  )}
                                  {msg.category === 'Error' && (
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                      Error
                                    </span>
                                  )}
                                  {msg.aiPowered && (
                                    <span className="text-xs text-purple-500 dark:text-purple-300 ml-auto">
                                      ✨ AI
                                    </span>
                                  )}
                                </div>
                              )}
                              {msg.type === 'bot'
                                ? renderFormattedText(msg.text)
                                : <p className="text-sm whitespace-pre-line">{msg.text}</p>
                              }
                            </div>
                          </div>
                        ))}

                        {/* AI Thinking indicator */}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="bg-green-100 dark:bg-green-900 rounded-lg px-4 py-3 transition-colors duration-200">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1.5 items-center">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-xs text-purple-600 dark:text-purple-300 font-medium ml-1">AI is thinking...</span>
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
                        maxLength={1000}
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
                        {loading ? (
                          <Loader size="sm" variant="spinner" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {inputValue.length}/1000
                      </span>
                      <span className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Powered by Gemini AI
                      </span>
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

                {/* AI Model Info */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                    </svg>
                    AI Model
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Google Gemini 1.5 Flash — optimized for fast, accurate agricultural advice.
                  </p>
                </div>
              </div>
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
