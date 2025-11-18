"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ProjectFormProps = {
  onSubmit: (data: {
    title: string
    meta: string
    badge: string
    stack: string[]
    category: string[]
    challenge: string[]
    solution: string[]
    impact: string[]
    image?: File
  }) => void
  loading: boolean
  error: string | null
  initialData?: {
    title?: string
    meta?: string
    badge?: string
    stack?: string[]
    category?: string[]
    challenge?: string[]
    solution?: string[]
    impact?: string[]
  }
  submitText?: string
}

export function ProjectFormModern({ onSubmit, loading, error, initialData, submitText = "Create Project" }: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [meta, setMeta] = useState(initialData?.meta || "")
  const [badge, setBadge] = useState(initialData?.badge || "")
  const [stack, setStack] = useState<string[]>(initialData?.stack || [])
  const [category, setCategory] = useState<string[]>(initialData?.category || [])
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenge || [])
  const [solutions, setSolutions] = useState<string[]>(initialData?.solution || [])
  const [impacts, setImpacts] = useState<string[]>(initialData?.impact || [])
  const [image, setImage] = useState<File | undefined>()

  const [newStack, setNewStack] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newSolution, setNewSolution] = useState("")
  const [newImpact, setNewImpact] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      meta,
      badge,
      stack,
      category,
      challenge: challenges,
      solution: solutions,
      impact: impacts,
      image,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">1</span>
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-slate-900">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E-Commerce Dashboard Redesign"
              required
              className="h-12 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta" className="text-sm font-bold text-slate-900">Meta Info *</Label>
            <Input
              id="meta"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Client Name • 3 Months"
              required
              className="h-12 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge" className="text-sm font-bold text-slate-900">Badge (Optional)</Label>
            <Input
              id="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Award Winner"
              className="h-12 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-bold text-slate-900">Cover Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0])}
              className="h-12 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-semibold hover:file:bg-amber-100"
            />
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">2</span>
          Tech Stack & Categories
        </h3>
        <div className="space-y-6">
          {/* Stack */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={newStack}
                onChange={(e) => setNewStack(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newStack.trim()) {
                      setStack([...stack, newStack.trim()])
                      setNewStack("")
                    }
                  }
                }}
                placeholder="Add technology (e.g., Excel, SQL, Python)"
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newStack.trim()) {
                    setStack([...stack, newStack.trim()])
                    setNewStack("")
                  }
                }}
                className="h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
              >
                + Add
              </Button>
            </div>
            {stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {stack.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    {item}
                    <button
                      type="button"
                      onClick={() => setStack(stack.filter((_, i) => i !== idx))}
                      className="text-amber-600 hover:text-amber-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Categories</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newCategory.trim()) {
                      setCategory([...category, newCategory.trim()])
                      setNewCategory("")
                    }
                  }
                }}
                placeholder="Add category (e.g., automation, dashboard)"
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newCategory.trim()) {
                    setCategory([...category, newCategory.trim()])
                    setNewCategory("")
                  }
                }}
                className="h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
              >
                + Add
              </Button>
            </div>
            {category.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {category.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm">
                    {item}
                    <button
                      type="button"
                      onClick={() => setCategory(category.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-slate-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">3</span>
          Project Details
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Challenge */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Challenges</Label>
            <div className="flex gap-2">
              <Input
                value={newChallenge}
                onChange={(e) => setNewChallenge(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newChallenge.trim()) {
                      setChallenges([...challenges, newChallenge.trim()])
                      setNewChallenge("")
                    }
                  }
                }}
                placeholder="Add challenge"
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newChallenge.trim()) {
                    setChallenges([...challenges, newChallenge.trim()])
                    setNewChallenge("")
                  }
                }}
                className="h-11 px-4 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl"
              >
                +
              </Button>
            </div>
            {challenges.length > 0 && (
              <div className="space-y-2 mt-3">
                {challenges.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-red-50 border-2 border-red-100 p-3 rounded-lg group hover:border-red-300 transition-colors">
                    <span className="text-red-600 font-bold text-sm mt-0.5">•</span>
                    <span className="flex-1 text-sm text-slate-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solution */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Solutions</Label>
            <div className="flex gap-2">
              <Input
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newSolution.trim()) {
                      setSolutions([...solutions, newSolution.trim()])
                      setNewSolution("")
                    }
                  }
                }}
                placeholder="Add solution"
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newSolution.trim()) {
                    setSolutions([...solutions, newSolution.trim()])
                    setNewSolution("")
                  }
                }}
                className="h-11 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl"
              >
                +
              </Button>
            </div>
            {solutions.length > 0 && (
              <div className="space-y-2 mt-3">
                {solutions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-blue-50 border-2 border-blue-100 p-3 rounded-lg group hover:border-blue-300 transition-colors">
                    <span className="text-blue-600 font-bold text-sm mt-0.5">•</span>
                    <span className="flex-1 text-sm text-slate-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => setSolutions(solutions.filter((_, i) => i !== idx))}
                      className="text-blue-400 hover:text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900">Impact</Label>
            <div className="flex gap-2">
              <Input
                value={newImpact}
                onChange={(e) => setNewImpact(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newImpact.trim()) {
                      setImpacts([...impacts, newImpact.trim()])
                      setNewImpact("")
                    }
                  }
                }}
                placeholder="Add impact"
                className="h-11 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newImpact.trim()) {
                    setImpacts([...impacts, newImpact.trim()])
                    setNewImpact("")
                  }
                }}
                className="h-11 px-4 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-xl"
              >
                +
              </Button>
            </div>
            {impacts.length > 0 && (
              <div className="space-y-2 mt-3">
                {impacts.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-green-50 border-2 border-green-100 p-3 rounded-lg group hover:border-green-300 transition-colors">
                    <span className="text-green-600 font-bold text-sm mt-0.5">•</span>
                    <span className="flex-1 text-sm text-slate-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => setImpacts(impacts.filter((_, i) => i !== idx))}
                      className="text-green-400 hover:text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold text-red-900">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="h-14 px-12 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-3">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
              </svg>
              {submitText}...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {submitText}
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
