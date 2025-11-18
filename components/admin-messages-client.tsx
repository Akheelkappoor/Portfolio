"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-sidebar"

type Message = {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminMessagesClient() {
  const { data: messages, error, isLoading, mutate } = useSWR<Message[]>("/api/admin/messages", fetcher)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredMessages = Array.isArray(messages) ? messages.filter((msg) => {
    if (filter === "unread") return !msg.is_read
    if (filter === "read") return msg.is_read
    return true
  }) : []

  const unreadCount = Array.isArray(messages) ? messages.filter((m) => !m.is_read).length : 0

  async function toggleRead(id: number, currentStatus: boolean) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: !currentStatus }),
      })
      if (!res.ok) throw new Error("Failed to update")
      await mutate()
    } catch (err: any) {
      alert(err.message || "Failed to update message")
    }
  }

  async function deleteMessage(id: number) {
    if (!confirm("Delete this message? This cannot be undone.")) return
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      await mutate()
      if (selectedMessage?.id === id) setSelectedMessage(null)
    } catch (err: any) {
      alert(err.message || "Failed to delete message")
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <AdminLayout>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Messages</h1>
                <p className="text-slate-600 mt-1 text-sm">
                  {mounted && (unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!")}
                  {!mounted && "Loading..."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => mutate()}
                className="border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <section className="p-8">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              suppressHydrationWarning
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-amber-50 border-2 border-slate-200"
              }`}
            >
              All {mounted && `(${Array.isArray(messages) ? messages.length : 0})`}
            </button>
            <button
              onClick={() => setFilter("unread")}
              suppressHydrationWarning
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === "unread"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-amber-50 border-2 border-slate-200"
              }`}
            >
              Unread {mounted && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter("read")}
              suppressHydrationWarning
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === "read"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-amber-50 border-2 border-slate-200"
              }`}
            >
              Read {mounted && `(${Array.isArray(messages) ? messages.length - unreadCount : 0})`}
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                </svg>
                <p className="text-slate-600 font-medium">Loading messages…</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-900">Failed to load messages</p>
                <p className="text-sm text-red-700 mt-1">Please check your database connection.</p>
              </div>
            </div>
          ) : filteredMessages && filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-slate-600 font-medium">
                {filter === "all" ? "No messages yet" : filter === "unread" ? "No unread messages" : "No read messages"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {filter === "all" ? "Messages from your contact form will appear here" : ""}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all cursor-pointer ${
                    selectedMessage?.id === msg.id
                      ? "border-amber-500 ring-2 ring-amber-200"
                      : msg.is_read
                        ? "border-slate-200 hover:border-slate-300"
                        : "border-amber-300 hover:border-amber-400"
                  }`}
                  onClick={() => {
                    setSelectedMessage(msg)
                    if (!msg.is_read) toggleRead(msg.id, msg.is_read)
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{msg.name}</h3>
                            {!msg.is_read && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-bold">New</span>
                            )}
                          </div>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {msg.email}
                          </a>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{formatDate(msg.created_at)}</p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3">{msg.message}</p>

                    <div className="flex items-center gap-2 pt-4 border-t-2 border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMessage(msg)
                        }}
                        className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 text-sm font-semibold hover:bg-amber-200 transition-colors"
                      >
                        View Full
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleRead(msg.id, msg.is_read)
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
                      >
                        Mark as {msg.is_read ? "Unread" : "Read"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMessage(msg.id)
                        }}
                        className="ml-auto px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b-2 border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-extrabold text-slate-900">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedMessage.name}</h3>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-amber-600 hover:text-amber-700 font-medium hover:underline block mb-2"
                      >
                        {selectedMessage.email}
                      </a>
                      <p className="text-sm text-slate-500">{formatDate(selectedMessage.created_at)}</p>
                    </div>
                    {!selectedMessage.is_read && (
                      <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">Unread</span>
                    )}
                  </div>

                  <div className="pt-6 border-t-2 border-slate-100">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Message</h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="flex-1 h-12 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Reply via Email
                  </a>
                  <button
                    onClick={() => {
                      toggleRead(selectedMessage.id, selectedMessage.is_read)
                      setSelectedMessage({ ...selectedMessage, is_read: !selectedMessage.is_read })
                    }}
                    className="h-12 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                  >
                    {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="h-12 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}
