"use client"

import useSWR, { mutate as globalMutate } from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectFormModern } from "@/components/project-form-modern"
import { AdminLayout } from "@/components/admin-sidebar"

type Project = {
  id: string
  title: string
  meta: string
  badge?: string
  stack: string[]
  category?: string[]
  challenge?: string[]
  solution?: string[]
  impact?: string[]
  imageUrl?: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminProjectsClient() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>("/api/admin/projects-aws", fetcher)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const PROJECTS_PER_PAGE = 6

  async function onCreate(data: {
    title: string
    meta: string
    badge: string
    stack: string[]
    category: string[]
    challenge: string[]
    solution: string[]
    impact: string[]
    image?: File
  }) {
    setCreating(true)
    setCreateError(null)
    try {
      const fd = new FormData()
      fd.append("title", data.title)
      fd.append("meta", data.meta)
      if (data.badge) fd.append("badge", data.badge)
      fd.append("stack", data.stack.join(", "))
      if (data.category.length > 0) fd.append("category", data.category.join(", "))
      if (data.challenge.length > 0) fd.append("challenge", data.challenge.join("\n"))
      if (data.solution.length > 0) fd.append("solution", data.solution.join("\n"))
      if (data.impact.length > 0) fd.append("impact", data.impact.join("\n"))
      if (data.image) fd.append("image", data.image)

      const res = await fetch("/api/admin/projects-aws", { method: "POST", body: fd })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData?.error || "Failed to create")
      await mutate()
      await globalMutate("/api/projects") // refresh homepage feed
    } catch (err: any) {
      setCreateError(err.message || "Failed to create")
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Manage Projects</h1>
                <p className="text-slate-600 mt-1 text-sm">Create, edit, and organize your portfolio projects</p>
              </div>
              <Button
                variant="outline"
                onClick={() => globalMutate("/api/admin/projects-aws")}
                className="border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50 transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <section className="p-8">

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
              </svg>
              <p className="text-slate-600 font-medium">Loading projects…</p>
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200 mb-6">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-900">Failed to load projects</p>
              <p className="text-sm text-red-700 mt-1">Ensure DATABASE_URL, AWS_REGION, and S3_BUCKET are set in Vars.</p>
            </div>
          </div>
        ) : null}

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Add New Project</h2>
          </div>
          <ProjectFormModern onSubmit={onCreate} loading={creating} error={createError} />
        </div>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Existing Projects</h2>
                {data && data.length > 0 && (
                  <p className="text-sm text-slate-600 mt-0.5">{data.length} total projects</p>
                )}
              </div>
            </div>
          </div>

          {data && data.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-600 font-medium">No projects yet</p>
              <p className="text-sm text-slate-500 mt-1">Create your first project using the form above</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(data) && data
                  .slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE)
                  .map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onEdit={() => setEditingProject(p)}
                      onChanged={() => globalMutate("/api/admin/projects-aws")}
                    />
                  ))}
              </div>

              {/* Pagination */}
              {Array.isArray(data) && Math.ceil(data.length / PROJECTS_PER_PAGE) > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50"
                  >
                    ← Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(data.length / PROJECTS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-amber-600 text-white shadow-lg scale-110"
                            : "bg-white text-slate-700 hover:bg-amber-50 border-2 border-slate-300 hover:border-amber-400"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(Math.ceil(data.length / PROJECTS_PER_PAGE), currentPage + 1))}
                    disabled={currentPage === Math.ceil(data.length / PROJECTS_PER_PAGE)}
                    className="border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Modal */}
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSaved={() => {
              globalMutate("/api/admin/projects-aws")
              setEditingProject(null)
            }}
          />
        )}
      </section>
    </main>
    </AdminLayout>
  )
}

function ProjectCard({ project, onEdit, onChanged }: { project: Project; onEdit: () => void; onChanged: () => void }) {
  const [deleting, setDeleting] = useState(false)

  async function onDelete() {
    if (!confirm(`Delete "${project.title}"? This action cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/projects-aws?id=${encodeURIComponent(project.id)}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete")
      await globalMutate("/api/admin/projects-aws")
      await globalMutate("/api/projects")
      onChanged()
    } catch (err: any) {
      alert(err.message || "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] overflow-hidden group">
      {project.imageUrl && (
        <div className="relative h-48 bg-slate-200 overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          {project.badge && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg">{project.badge}</span>
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
        <p className="text-sm text-slate-600 mb-4">{project.meta}</p>

        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.stack.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold">
                {tech}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                +{project.stack.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t-2 border-slate-100">
          <Button
            onClick={onEdit}
            className="flex-1 h-10 font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button
            onClick={onDelete}
            disabled={deleting}
            className="h-10 px-4 font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            {deleting ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function EditProjectModal({ project, onClose, onSaved }: { project: Project; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: {
    title: string
    meta: string
    badge: string
    stack: string[]
    category: string[]
    challenge: string[]
    solution: string[]
    impact: string[]
    image?: File
  }) {
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("id", project.id)
      fd.append("title", data.title)
      fd.append("meta", data.meta)
      if (data.badge) fd.append("badge", data.badge)
      fd.append("stack", data.stack.join(", "))
      if (data.category.length > 0) fd.append("category", data.category.join(", "))
      if (data.challenge.length > 0) fd.append("challenge", data.challenge.join("\n"))
      if (data.solution.length > 0) fd.append("solution", data.solution.join("\n"))
      if (data.impact.length > 0) fd.append("impact", data.impact.join("\n"))
      if (data.image) fd.append("image", data.image)

      const res = await fetch("/api/admin/projects-aws", { method: "PUT", body: fd })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData?.error || "Failed to update")

      await globalMutate("/api/admin/projects-aws")
      await globalMutate("/api/projects")
      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b-2 border-slate-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <ProjectFormModern
            onSubmit={handleSubmit}
            loading={saving}
            error={error}
            initialData={{
              title: project.title,
              meta: project.meta,
              badge: project.badge,
              stack: project.stack,
              category: project.category,
              challenge: project.challenge,
              solution: project.solution,
              impact: project.impact,
            }}
            submitText="Save Changes"
          />
        </div>
      </div>
    </div>
  )
}
