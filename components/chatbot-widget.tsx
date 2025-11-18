"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageCircle, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! 👋 I'm Akheel's AI assistant. Ask me anything about his experience, skills, or projects!",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Send to N8N webhook
      const response = await fetch("https://n8n.lms-i2global.com/webhook/chat-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
          sessionId: `session-${Date.now()}`
        })
      })

      const data = await response.json()

      setIsTyping(false)

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || "Thanks for your message! I'll get back to you soon.",
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      setIsTyping(false)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! I'm having trouble connecting right now. Please try again or contact me directly via email.",
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-bounce"
          style={{
            animation: "bounce 2s ease-in-out infinite"
          }}
        >
          <MessageCircle className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-theme-primary to-theme-secondary p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-theme-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-xs text-white/80">Online • Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-br-sm"
                      : "bg-white text-slate-800 shadow-md border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-slate-400"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white text-slate-800 shadow-md border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-full hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Powered by AI • Connected to database
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
