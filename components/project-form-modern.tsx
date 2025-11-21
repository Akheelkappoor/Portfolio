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
    pdf?: File
    removePdf?: boolean
    githubUrl?: string
    liveUrl?: string
    displayOrder?: number
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
    pdfUrl?: string | null
    githubUrl?: string | null
    liveUrl?: string | null
    displayOrder?: number
  }
  submitText?: string
  existingProjects?: Array<{ id: string; title: string; displayOrder?: number }>
  currentProjectId?: string
}

export function ProjectFormModern({ onSubmit, loading, error, initialData, submitText = "Create Project", existingProjects = [], currentProjectId }: ProjectFormProps) {
  // Calculate suggested next order (max + 1)
  const suggestedOrder = existingProjects.length > 0
    ? Math.max(...existingProjects.map(p => p.displayOrder || 0)) + 1
    : 0

  const [title, setTitle] = useState(initialData?.title || "")
  const [meta, setMeta] = useState(initialData?.meta || "")
  const [badge, setBadge] = useState(initialData?.badge || "")
  const [stack, setStack] = useState<string[]>(initialData?.stack || [])
  const [category, setCategory] = useState<string[]>(initialData?.category || [])
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenge || [])
  const [solutions, setSolutions] = useState<string[]>(initialData?.solution || [])
  const [impacts, setImpacts] = useState<string[]>(initialData?.impact || [])
  const [image, setImage] = useState<File | undefined>()
  const [pdf, setPdf] = useState<File | undefined>()
  const [removePdf, setRemovePdf] = useState(false)
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "")
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "")
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.displayOrder ?? suggestedOrder)

  // Check for duplicate order
  const duplicateProject = existingProjects.find(
    p => p.displayOrder === displayOrder && p.id !== currentProjectId
  )

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
      pdf,
      removePdf,
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      displayOrder,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Project Details */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-100">
          📋 Project Details
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E-Commerce Dashboard Redesign"
                required
                className="h-11 rounded-lg border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta" className="text-sm font-semibold text-slate-700">Meta Info *</Label>
              <Input
                id="meta"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Client Name • 3 Months"
                required
                className="h-11 rounded-lg border-slate-300"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="badge" className="text-sm font-semibold text-slate-700">Badge</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Award Winner"
                className="h-11 rounded-lg border-slate-300"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="displayOrder" className="text-sm font-semibold text-slate-700">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                placeholder={String(suggestedOrder)}
                className={`h-11 rounded-lg ${duplicateProject ? 'border-amber-400 bg-amber-50' : 'border-slate-300'}`}
              />
              <div className="flex items-start gap-2 text-xs">
                {!initialData?.displayOrder && (
                  <p className="text-slate-500">💡 Suggested: <span className="font-semibold text-amber-600">{suggestedOrder}</span> (next available)</p>
                )}
                {duplicateProject && (
                  <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Order {displayOrder} used by "{duplicateProject.title}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Links & Media */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-100">
          🔗 Links & Media
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-sm font-semibold text-slate-700">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="h-11 rounded-lg border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="text-sm font-semibold text-slate-700">Live Demo URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://your-project.com"
                className="h-11 rounded-lg border-slate-300"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold text-slate-700">Cover Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0])}
                className="h-11 rounded-lg border-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:bg-amber-50 file:text-amber-700 file:font-semibold hover:file:bg-amber-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf" className="text-sm font-semibold text-slate-700">PDF Document</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setPdf(e.target.files?.[0])}
                className="h-11 rounded-lg border-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:bg-red-50 file:text-red-700 file:font-semibold hover:file:bg-red-100"
              />
              {initialData?.pdfUrl && !removePdf && (
                <div className="flex items-center justify-between text-xs mt-2 p-2 bg-slate-50 rounded">
                  <a href={initialData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">View current PDF</a>
                  <label className="flex items-center gap-1.5 cursor-pointer text-red-700 hover:text-red-900">
                    <input
                      type="checkbox"
                      checked={removePdf}
                      onChange={(e) => setRemovePdf(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-red-600"
                    />
                    <span className="font-medium">Remove</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Tech Stack */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-100">
          💻 Technologies
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Tech Stack</Label>
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
                placeholder="Add technology (e.g., React, Python)"
                className="h-10 rounded-lg border-slate-300"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newStack.trim()) {
                    setStack([...stack, newStack.trim()])
                    setNewStack("")
                  }
                }}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Add
              </Button>
            </div>
            {stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 text-sm font-medium border border-amber-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => setStack(stack.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Categories</Label>
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
                placeholder="Add category (e.g., Dashboard, Mobile App)"
                className="h-10 rounded-lg border-slate-300"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newCategory.trim()) {
                    setCategory([...category, newCategory.trim()])
                    setNewCategory("")
                  }
                }}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Add
              </Button>
            </div>
            {category.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 text-sm font-medium border border-blue-200"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => setCategory(category.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Project Details */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-100">
          📝 Project Story
        </h3>

        <div className="space-y-6">
          {/* Challenge */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Challenge</Label>
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
                placeholder="Add challenge point"
                className="h-10 rounded-lg border-slate-300"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newChallenge.trim()) {
                    setChallenges([...challenges, newChallenge.trim()])
                    setNewChallenge("")
                  }
                }}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Add
              </Button>
            </div>
            {challenges.length > 0 && (
              <ul className="space-y-2 mt-3">
                {challenges.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span className="flex-1 text-sm text-slate-700">{ch}</span>
                    <button
                      type="button"
                      onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Solution</Label>
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
                placeholder="Add solution point"
                className="h-10 rounded-lg border-slate-300"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newSolution.trim()) {
                    setSolutions([...solutions, newSolution.trim()])
                    setNewSolution("")
                  }
                }}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Add
              </Button>
            </div>
            {solutions.length > 0 && (
              <ul className="space-y-2 mt-3">
                {solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span className="flex-1 text-sm text-slate-700">{sol}</span>
                    <button
                      type="button"
                      onClick={() => setSolutions(solutions.filter((_, i) => i !== idx))}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Impact */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Impact</Label>
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
                placeholder="Add impact metric"
                className="h-10 rounded-lg border-slate-300"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newImpact.trim()) {
                    setImpacts([...impacts, newImpact.trim()])
                    setNewImpact("")
                  }
                }}
                className="h-10 px-4 bg-amber-600 hover:bg-amber-700 rounded-lg"
              >
                Add
              </Button>
            </div>
            {impacts.length > 0 && (
              <ul className="space-y-2 mt-3">
                {impacts.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-green-600 font-bold mt-0.5">📊</span>
                    <span className="flex-1 text-sm text-slate-700">{imp}</span>
                    <button
                      type="button"
                      onClick={() => setImpacts(impacts.filter((_, i) => i !== idx))}
                      className="text-green-600 hover:text-green-800 font-bold"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
              </svg>
              Saving...
            </div>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  )
}
