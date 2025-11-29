import { useState } from 'react'
import { Send, Loader, RotateCcw } from 'lucide-react'

export default function QAInference() {
  const [conversation, setConversation] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState('What is Java?')
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)

  const handleStartSession = () => {
    setSessionStarted(true)
    setConversation([
      {
        type: 'system',
        content: currentQuestion,
        timestamp: new Date(),
      },
    ])
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return

    const newConversation = [
      ...conversation,
      {
        type: 'user',
        content: userAnswer,
        timestamp: new Date(),
      },
    ]
    setConversation(newConversation)
    setLoading(true)

    try {
      const response = await fetch('/api/inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
        }),
      })

      const data = await response.json()
      const followUpQuestion = data.followUpQuestion || 'No follow-up question generated.'

      setConversation([
        ...newConversation,
        {
          type: 'system',
          content: followUpQuestion,
          timestamp: new Date(),
        },
      ])

      setCurrentQuestion(followUpQuestion)
      setUserAnswer('')
    } catch (error) {
      console.error('Error:', error)
      setConversation([
        ...newConversation,
        {
          type: 'error',
          content: 'Error generating follow-up question. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setConversation([])
    setCurrentQuestion('What is Java?')
    setUserAnswer('')
    setSessionStarted(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault()
      handleSubmitAnswer()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interactive Q&A System
          </h1>
          <p className="text-gray-600">
            AI-powered follow-up question generator
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px] border border-gray-200">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {!sessionStarted ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">💡</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Start a New Session
                </h2>
                <p className="text-gray-600 mb-8 max-w-xs">
                  Begin your interactive learning journey with AI-generated
                  follow-up questions
                </p>
                <button
                  onClick={handleStartSession}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Start Session
                </button>
              </div>
            ) : (
              <>
                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                          : msg.type === 'error'
                          ? 'bg-red-100 text-red-800 rounded-bl-none border border-red-300'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none border border-gray-300'
                      }`}
                    >
                      {msg.type === 'system' && (
                        <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                          System
                        </p>
                      )}
                      <p className="break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 border border-gray-300">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">
                        Generating follow-up question...
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          {sessionStarted && (
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  disabled={loading}
                  className="flex-1 bg-gray-50 text-gray-900 rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
                  rows="3"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !userAnswer.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors disabled:cursor-not-allowed shadow-md"
                    title="Send (Enter)"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium shadow-md flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}