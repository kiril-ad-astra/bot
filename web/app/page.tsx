'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  role: 'user' | 'sophie'
  content: string
  time: string
}

export default function SophieChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'sophie',
      content: '¡Hola! 💙 Soy Sophie, tu enfermera favorita en Miami. ¿En qué puedo ayudarte hoy?',
      time: getTime()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('👩‍⚕️ En el hospital')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      time: getTime()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
      
      // Si no hay API configurada, simular respuesta
      if (!API_URL || API_URL.includes('YOUR_SUBDOMAIN')) {
        await simulateSophieResponse(userMsg.content)
        return
      }

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          userId: 'web-' + Math.random().toString(36).substr(2, 9),
          sessionId: 'sess-' + Math.random().toString(36).substr(2, 9),
          platform: 'web'
        })
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'sophie',
        content: data.reply,
        time: getTime()
      }])

    } catch (err) {
      // Fallback: respuesta simulada
      await simulateSophieResponse(userMsg.content)
    } finally {
      setLoading(false)
    }
  }

  async function simulateSophieResponse(userMessage: string) {
    // Simular delay de red
    await new Promise(r => setTimeout(r, 1000))
    
    const responses = [
      '¡Qué interesante! 💙 Cuéntame más...',
      'Ay, chamo, eso me recuerda a cuando estaba en Caracas...',
      'Como enfermera te digo: ¡toma agua! 😄 Pero en serio, ¿cómo te sientes?',
      'Miami está caluroso hoy, ¿verdad? 🌴',
      '¡Chevere! Me encanta hablar contigo.',
      'Hmm... déjame pensar... 💭',
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'sophie',
      content: randomResponse,
      time: getTime()
    }])
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-2xl">
                👩‍⚕️
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Sophie Hart</h1>
              <p className="text-xs text-slate-400">{status}</p>
            </div>
          </div>
          
          <a 
            href="https://t.me/SophieHartBot" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-full text-sm border border-blue-500/30 transition-colors"
          >
            Telegram
          </a>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 rounded-br-md'
                    : 'bg-slate-800/90 border border-white/10 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className="text-xs opacity-60 mt-1 block">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe a Sophie..."
            className="flex-1 bg-slate-800/80 border border-white/10 rounded-full px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-full font-medium transition-all"
          >
            Enviar
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-white/10">
        <p>Sophie es una IA • No reemplaza consejo médico • Made with 💙</p>
      </footer>
    </div>
  )
}

function getTime() {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
