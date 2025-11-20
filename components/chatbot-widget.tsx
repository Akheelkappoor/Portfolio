"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageCircle, Sparkles, Trash2, Copy, Check, Download, Minus, RotateCcw } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  error?: boolean
}

const SUGGESTED_QUESTIONS = [
  "What are your main skills?",
  "Tell me about your experience",
  "What projects have you built?",
  "How can I contact you?"
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
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
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputValue
    if (!text.trim()) return

    setShowSuggestions(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Use the secure Next.js API route instead of calling webhook directly
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          sessionId: `session-${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      setIsTyping(false)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || data.output || "Thanks for your message! I'll get back to you soon.",
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      setIsTyping(false)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        error: true
      }

      setMessages(prev => [...prev, errorMessage])
    }
  }

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.sender === "user")
    if (lastUserMessage) {
      // Remove last bot error message
      setMessages(prev => prev.filter(m => m.id !== messages[messages.length - 1].id))
      sendMessage(lastUserMessage.text)
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        text: "Hi there! 👋 I'm Akheel's AI assistant. Ask me anything about his experience, skills, or projects!",
        sender: "bot",
        timestamp: new Date()
      }
    ])
    setShowSuggestions(true)
  }

  const downloadTranscript = () => {
    const transcript = messages
      .map(m => `[${m.timestamp.toLocaleTimeString()}] ${m.sender === "user" ? "You" : "AI"}: ${m.text}`)
      .join('\n')

    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-transcript-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          style={{
            animation: "gentle-bounce 3s ease-in-out infinite"
          }}
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all duration-300 ${
          isMinimized ? 'w-72 sm:w-80 h-16' : 'w-[calc(100vw-2rem)] sm:w-96 md:w-[400px] h-[calc(100vh-2rem)] sm:h-[600px] max-h-[85vh]'
        } animate-slide-up`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-theme-primary to-theme-secondary p-3 sm:p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-theme-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">AI Assistant</h3>
                <p className="text-xs text-white/80 truncate">Online • Replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 sm:w-8 sm:h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Main Content - Hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Action Buttons */}
              <div className="px-3 sm:px-4 py-2 bg-slate-50 border-b border-slate-200 flex gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={clearConversation}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                  onClick={downloadTranscript}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Download transcript"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in group`}
                  >
                    <div className="flex flex-col gap-1 max-w-[85%]">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-br-sm"
                            : message.error
                            ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-sm"
                            : "bg-white text-slate-800 shadow-md border border-slate-100 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.sender === "user"
                              ? "text-white/70"
                              : message.error
                              ? "text-red-600/70"
                              : "text-slate-400"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.sender === "bot" && !message.error && (
                            <button
                              onClick={() => copyToClipboard(message.text, message.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              title="Copy message"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      {message.error && (
                        <button
                          onClick={retryLastMessage}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 self-end"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Retry
                        </button>
                      )}
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

                {/* Quick Replies */}
                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="text-xs text-slate-500 text-center">Quick questions:</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {SUGGESTED_QUESTIONS.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(question)}
                          className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs bg-white border border-slate-200 rounded-full hover:border-theme-primary hover:bg-theme-primary/5 transition-all"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex-shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all text-xs sm:text-sm"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-theme-primary to-theme-secondary text-white rounded-full hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex-shrink-0"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center hidden sm:block">
                  Powered by AI • Press Enter to send
                </p>
              </div>
            </>
          )}
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

        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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
