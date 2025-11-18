"use client"

import type * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    try {
      setLoading(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to send message")

      toast({ title: "Message sent!", description: "Thanks for reaching out — I’ll reply soon." })
      form.reset()
    } catch (err: any) {
      toast({
        title: "Unable to send",
        description: err.message || "Please email me directly.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8 md:p-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h3>
        <p className="text-slate-600">Fill out the form below and I'll get back to you within 24 hours.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold text-slate-900">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-slate-900">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-bold text-slate-900">
            Message *
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell me about your project or opportunity..."
            required
            rows={6}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          aria-live="polite"
          aria-busy={loading}
          className="w-full h-14 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-3">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
              </svg>
              Sending Message...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Send Message
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Or email me directly at{" "}
          <a href="mailto:akheelkappoor@outlook.com" className="text-amber-600 hover:text-amber-700 font-semibold underline">
            akheelkappoor@outlook.com
          </a>
        </p>
      </form>
    </div>
  )
}
