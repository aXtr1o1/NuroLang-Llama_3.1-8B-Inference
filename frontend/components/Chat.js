import { useState } from 'react'
import { Send, RotateCcw } from 'lucide-react'

export default function Chat() {
  const [chat, setChat] = useState([])
  const [question, setQuestion] = useState('What is Java?')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const start = () => {
    setStarted(true)
    setChat([{ type: 'system', text: question }])
  }

  const submit = async () => {
    if (!answer.trim()) return

    setChat(prev => [...prev, { type: 'user', text: answer }])
    setLoading(true)

    try {
      const res = await fetch('/api/inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      })

      const data = await res.json()
      setChat(prev => [...prev, { type: 'system', text: data.followUpQuestion }])
      setQuestion(data.followUpQuestion)
      setAnswer('')
    } catch (err) {
      setChat(prev => [...prev, { type: 'error', text: 'Error!' }])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setChat([])
    setQuestion('What is Java?')
    setAnswer('')
    setStarted(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {!started ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Q&A System</h2>
              <button
                onClick={start}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Start
              </button>
            </div>
          ) : (
            <>
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-gray-600 text-sm">Generating...</div>}
            </>
          )}
        </div>

        {/* Input */}
        {started && (
          <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type answer..."
              disabled={loading}
              className="flex-1 bg-gray-50 rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={submit}
                disabled={loading || !answer.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={reset}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}