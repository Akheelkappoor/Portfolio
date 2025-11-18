"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin-sidebar"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type TabType = "hero" | "experience" | "skills"

export default function AdminHomepageClient() {
  const [activeTab, setActiveTab] = useState<TabType>("hero")

  // Add animation styles
  const fadeInStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
  `

  const tabs = [
    { id: "hero" as TabType, label: "Hero Section", icon: "🏠" },
    { id: "experience" as TabType, label: "Work Experience", icon: "💼" },
    { id: "skills" as TabType, label: "Skills", icon: "⚡" },
  ]

  return (
    <AdminLayout>
      <style>{fadeInStyle}</style>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Homepage Content</h1>
              <p className="text-slate-600 mt-1 text-sm">Edit your homepage sections and content</p>
            </div>
          </div>
        </div>

        <section className="p-8">
          {/* Tabs */}
          <div className="mb-8 flex gap-2 border-b-2 border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-all border-b-4 ${
                  activeTab === tab.id
                    ? "border-amber-600 text-amber-700 bg-amber-50"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "hero" && <HeroSectionEditor />}
          {activeTab === "experience" && <ExperienceEditor />}
          {activeTab === "skills" && <SkillsEditor />}
        </section>
      </main>
    </AdminLayout>
  )
}

// Hero Section Editor Component
function HeroSectionEditor() {
  const { data: hero, error, isLoading, mutate } = useSWR("/api/homepage/hero", fetcher)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState<{ profile?: boolean; resume?: boolean }>({})
  const [uploadedFiles, setUploadedFiles] = useState<{ profile_image_url?: string; resume_url?: string }>({})

  async function handleFileUpload(file: File, type: "profile" | "resume") {
    setUploading({ ...uploading, [type]: true })

    // For now, we'll save to /public folder
    // In production, you'd upload to S3/Cloudinary
    const fileName = `${type}-${Date.now()}-${file.name}`
    const publicPath = `/${fileName}`

    // Create a FormData to simulate upload
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For demo: just use a local URL
      // In production, upload to storage service here
      const url = publicPath

      setUploadedFiles({
        ...uploadedFiles,
        [type === "profile" ? "profile_image_url" : "resume_url"]: url
      })

      alert(`File uploaded! Save the form to apply changes.\nPath: ${url}\n\nNote: In production, upload this to /public folder or use a cloud storage service.`)
    } catch (err: any) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading({ ...uploading, [type]: false })
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      badge_text: formData.get("badge_text"),
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      description: formData.get("description"),
      profile_image_url: uploadedFiles.profile_image_url || formData.get("profile_image_url"),
      resume_url: uploadedFiles.resume_url || formData.get("resume_url"),
      cta_primary_text: formData.get("cta_primary_text"),
      cta_primary_link: formData.get("cta_primary_link"),
      cta_secondary_text: formData.get("cta_secondary_text"),
      cta_secondary_link: formData.get("cta_secondary_link"),
      stat_1_value: formData.get("stat_1_value"),
      stat_1_label: formData.get("stat_1_label"),
      stat_2_value: formData.get("stat_2_value"),
      stat_2_label: formData.get("stat_2_label"),
      stat_3_value: formData.get("stat_3_value"),
      stat_3_label: formData.get("stat_3_label"),
      stat_4_value: formData.get("stat_4_value"),
      stat_4_label: formData.get("stat_4_label"),
      availability_status: formData.get("availability_status"),
      availability_location: formData.get("availability_location"),
    }

    try {
      const res = await fetch("/api/homepage/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update hero section")

      await mutate()
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
          </svg>
          <p className="text-slate-600 font-medium">Loading hero section…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm font-semibold text-red-900">Failed to load hero section</p>
          <p className="text-sm text-red-700 mt-1">Please check your database connection.</p>
        </div>
      </div>
    )
  }

  if (!hero) return null

  return (
    <div className="max-w-6xl">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hero Section Content</h2>
          <p className="text-sm text-slate-600 mt-1">Edit the main landing section of your homepage</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="h-12 px-6 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-green-50 border-2 border-green-200">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-900">Hero section updated successfully!</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-900">Failed to save</p>
            <p className="text-sm text-red-700 mt-1">{saveError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Basic Information</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="badge_text" className="text-sm font-bold text-slate-900">
                Badge Text
              </Label>
              <Input
                id="badge_text"
                name="badge_text"
                defaultValue={hero.badge_text || ""}
                readOnly={!isEditing}
                placeholder="Business Analyst"
                className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-900">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={hero.name || ""}
                required
                readOnly={!isEditing}
                className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tagline" className="text-sm font-bold text-slate-900">
                Tagline / Subtitle
              </Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={hero.tagline || ""}
                readOnly={!isEditing}
                className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-bold text-slate-900">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={hero.description || ""}
                readOnly={!isEditing}
                rows={4}
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Media Files */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Media & Files</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile_image_url" className="text-sm font-bold text-slate-900">
                Profile Image
              </Label>
              <div className="flex gap-2">
                <Input
                  id="profile_image_url"
                  name="profile_image_url"
                  type="url"
                  defaultValue={uploadedFiles.profile_image_url || hero.profile_image_url || ""}
                  readOnly={!isEditing}
                  placeholder="/profile.jpg"
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
                {isEditing && (
                  <label className="flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "profile")
                      }}
                      disabled={uploading.profile}
                    />
                    <Button
                      type="button"
                      className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                      disabled={uploading.profile}
                      onClick={(e) => {
                        e.preventDefault()
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        input?.click()
                      }}
                    >
                      {uploading.profile ? (
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      )}
                    </Button>
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload an image or enter URL manually
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume_url" className="text-sm font-bold text-slate-900">
                Resume PDF
              </Label>
              <div className="flex gap-2">
                <Input
                  id="resume_url"
                  name="resume_url"
                  type="url"
                  defaultValue={uploadedFiles.resume_url || hero.resume_url || ""}
                  readOnly={!isEditing}
                  placeholder="/resume.pdf"
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
                {isEditing && (
                  <label className="flex-shrink-0">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "resume")
                      }}
                      disabled={uploading.resume}
                    />
                    <Button
                      type="button"
                      className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                      disabled={uploading.resume}
                      onClick={(e) => {
                        e.preventDefault()
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        input?.click()
                      }}
                    >
                      {uploading.resume ? (
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      )}
                    </Button>
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload a PDF or enter URL manually
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Call-to-Action Buttons</h3>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta_primary_text" className="text-sm font-bold text-slate-900">
                  Primary Button Text
                </Label>
                <Input
                  id="cta_primary_text"
                  name="cta_primary_text"
                  defaultValue={hero.cta_primary_text || ""}
                  readOnly={!isEditing}
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_primary_link" className="text-sm font-bold text-slate-900">
                  Primary Button Link
                </Label>
                <Input
                  id="cta_primary_link"
                  name="cta_primary_link"
                  defaultValue={hero.cta_primary_link || ""}
                  readOnly={!isEditing}
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_secondary_text" className="text-sm font-bold text-slate-900">
                  Secondary Button Text
                </Label>
                <Input
                  id="cta_secondary_text"
                  name="cta_secondary_text"
                  defaultValue={hero.cta_secondary_text || ""}
                  readOnly={!isEditing}
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_secondary_link" className="text-sm font-bold text-slate-900">
                  Secondary Button Link
                </Label>
                <Input
                  id="cta_secondary_link"
                  name="cta_secondary_link"
                  defaultValue={hero.cta_secondary_link || ""}
                  readOnly={!isEditing}
                  className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Statistics</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`stat_${num}_value`} className="text-sm font-bold text-slate-900">
                    Stat {num} Value
                  </Label>
                  <Input
                    id={`stat_${num}_value`}
                    name={`stat_${num}_value`}
                    defaultValue={hero[`stat_${num}_value`] || ""}
                    readOnly={!isEditing}
                    placeholder="80+"
                    className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`stat_${num}_label`} className="text-sm font-bold text-slate-900">
                    Stat {num} Label
                  </Label>
                  <Input
                    id={`stat_${num}_label`}
                    name={`stat_${num}_label`}
                    defaultValue={hero[`stat_${num}_label`] || ""}
                    readOnly={!isEditing}
                    placeholder="Projects"
                    className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Availability Badge</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="availability_status" className="text-sm font-bold text-slate-900">
                Status
              </Label>
              <Input
                id="availability_status"
                name="availability_status"
                defaultValue={hero.availability_status || ""}
                readOnly={!isEditing}
                placeholder="Available Immediately"
                className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability_location" className="text-sm font-bold text-slate-900">
                Location
              </Label>
              <Input
                id="availability_location"
                name="availability_location"
                defaultValue={hero.availability_location || ""}
                readOnly={!isEditing}
                placeholder="Dubai, UAE"
                className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="h-14 px-8 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="inline-flex items-center gap-3">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Changes
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setSaveError(null)
                mutate()
              }}
              className="h-14 px-6 border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

// Work Experience Editor Component
function ExperienceEditor() {
  const { data: experiences, error, isLoading, mutate } = useSWR("/api/homepage/experience", fetcher)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent<HTMLFormElement>, id?: number) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Get achievements as array
    const achievementsText = formData.get("achievements") as string
    const achievements = achievementsText.split("\n").filter((line) => line.trim() !== "")

    const data = {
      id,
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      period: formData.get("period"),
      achievements,
      display_order: formData.get("display_order") || 0,
      is_visible: true,
    }

    try {
      const res = await fetch("/api/homepage/experience", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save experience")

      await mutate()
      setEditingId(null)
      setIsAdding(false)
    } catch (err: any) {
      setSaveError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      const res = await fetch(`/api/homepage/experience?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      await mutate()
    } catch (err: any) {
      alert(err.message || "Failed to delete")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
          </svg>
          <p className="text-slate-600 font-medium">Loading experiences…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
        <p className="text-sm font-semibold text-red-900">Failed to load experiences</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
          <p className="text-sm text-slate-600 mt-1">Manage your work experience timeline</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="h-12 px-6 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </Button>
        )}
      </div>

      {saveError && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <p className="text-sm font-semibold text-red-900">{saveError}</p>
        </div>
      )}

      {/* Add New Form */}
      {isAdding && (
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl border-2 border-amber-400 shadow-2xl p-8 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Add New Experience</h3>
          </div>
          <form onSubmit={(e) => handleSave(e)}>
            <ExperienceForm saving={saving} onCancel={() => setIsAdding(false)} />
          </form>
        </div>
      )}

      {/* Existing Experiences */}
      <div className="space-y-6">
        {Array.isArray(experiences) && experiences.map((exp: any) => (
          <div key={exp.id} className="bg-gradient-to-br from-white to-orange-50/20 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 hover:border-amber-300">
            {editingId === exp.id ? (
              <form onSubmit={(e) => handleSave(e, exp.id)}>
                <ExperienceForm exp={exp} saving={saving} onCancel={() => setEditingId(null)} />
              </form>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-lg text-slate-700 mt-1">{exp.company}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {exp.location} • {exp.period}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingId(exp.id)}
                      className="h-10 px-4 border-2 border-amber-500 text-amber-700 hover:bg-amber-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(exp.id)}
                      className="h-10 px-4 border-2 border-red-500 text-red-700 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {Array.isArray(exp.achievements) && exp.achievements.map((achievement: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="text-amber-500 mt-1">✓</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExperienceForm({
  exp,
  saving,
  onCancel,
}: {
  exp?: any
  saving: boolean
  onCancel: () => void
}) {
  const [achievements, setAchievements] = useState<string[]>(exp?.achievements || [""])

  function addAchievement() {
    setAchievements([...achievements, ""])
  }

  function removeAchievement(index: number) {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  function updateAchievement(index: number, value: string) {
    const newAchievements = [...achievements]
    newAchievements[index] = value
    setAchievements(newAchievements)
  }

  return (
    <div className="space-y-6">
      <input type="hidden" name="achievements" value={achievements.filter(a => a.trim()).join("\n")} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-bold text-slate-900">
            Job Title *
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={exp?.title || ""}
            required
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-bold text-slate-900">
            Company *
          </Label>
          <Input
            id="company"
            name="company"
            defaultValue={exp?.company || ""}
            required
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-bold text-slate-900">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={exp?.location || ""}
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period" className="text-sm font-bold text-slate-900">
            Period
          </Label>
          <Input
            id="period"
            name="period"
            defaultValue={exp?.period || ""}
            placeholder="Mar 2024 – Sep 2024"
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-slate-900">
            Achievements
          </Label>
          <Button
            type="button"
            onClick={addAchievement}
            className="h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Achievement
          </Button>
        </div>

        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Textarea
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder={`Achievement ${index + 1}`}
                  rows={2}
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none w-full"
                />
              </div>
              {achievements.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  variant="outline"
                  className="h-10 w-10 p-0 border-2 border-red-500 text-red-700 hover:bg-red-50 rounded-lg flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={saving}
          className="h-14 px-8 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-14 px-6 border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Skills Editor Component
function SkillsEditor() {
  const { data: skills, error, isLoading, mutate } = useSWR("/api/homepage/skills", fetcher)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSaveCategory(e: React.FormEvent<HTMLFormElement>, id?: number) {
    e.preventDefault()
    setSaving(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      type: "category",
      id,
      title: formData.get("title"),
      icon: formData.get("icon"),
      display_order: formData.get("display_order") || 0,
      is_visible: true,
    }

    try {
      const res = await fetch("/api/homepage/skills", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save category")

      await mutate()
      setEditingCategoryId(null)
      setIsAddingCategory(false)
    } catch (err: any) {
      alert(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm("Delete this category and all its skills?")) return

    try {
      const res = await fetch(`/api/homepage/skills?type=category&id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      await mutate()
    } catch (err: any) {
      alert(err.message || "Failed to delete")
    }
  }

  async function handleAddSkill(categoryId: number, skillName: string) {
    if (!skillName.trim()) return

    try {
      const res = await fetch("/api/homepage/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "item",
          category_id: categoryId,
          skill_name: skillName,
          display_order: 0,
        }),
      })

      if (!res.ok) throw new Error("Failed to add skill")
      await mutate()
    } catch (err: any) {
      alert(err.message || "Failed to add skill")
    }
  }

  async function handleDeleteSkill(id: number) {
    try {
      const res = await fetch(`/api/homepage/skills?type=item&id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      await mutate()
    } catch (err: any) {
      alert(err.message || "Failed to delete")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
          </svg>
          <p className="text-slate-600 font-medium">Loading skills…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200">
        <p className="text-sm font-semibold text-red-900">Failed to load skills</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Technical Skills</h2>
          <p className="text-sm text-slate-600 mt-1">Manage skill categories and items</p>
        </div>
        {!isAddingCategory && (
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="h-12 px-6 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Button>
        )}
      </div>

      {/* Add New Category Form */}
      {isAddingCategory && (
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl border-2 border-amber-400 shadow-2xl p-8 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Add New Category</h3>
          </div>
          <form onSubmit={(e) => handleSaveCategory(e)}>
            <CategoryForm saving={saving} onCancel={() => setIsAddingCategory(false)} />
          </form>
        </div>
      )}

      {/* Existing Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.isArray(skills) && skills.map((category: any) => (
          <SkillCategoryCard
            key={category.id}
            category={category}
            isEditing={editingCategoryId === category.id}
            onEdit={() => setEditingCategoryId(category.id)}
            onCancelEdit={() => setEditingCategoryId(null)}
            onSave={handleSaveCategory}
            onDelete={() => handleDeleteCategory(category.id)}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            saving={saving}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryForm({ category, saving, onCancel }: { category?: any; saving: boolean; onCancel: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-bold text-slate-900">
            Category Title *
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={category?.title || ""}
            required
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="text-sm font-bold text-slate-900">
            Icon (Emoji)
          </Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={category?.icon || ""}
            placeholder="📊"
            className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={saving}
          className="h-14 px-8 text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-14 px-6 border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

function SkillCategoryCard({
  category,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onAddSkill,
  onDeleteSkill,
  saving,
}: any) {
  const [newSkill, setNewSkill] = useState("")

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/20 rounded-3xl border-2 border-slate-200 shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 hover:border-purple-300">
      {isEditing ? (
        <form onSubmit={(e) => onSave(e, category.id)}>
          <CategoryForm category={category} saving={saving} onCancel={onCancelEdit} />
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{category.icon}</span>
              <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onEdit}
                className="h-10 px-4 border-2 border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onDelete}
                className="h-10 px-4 border-2 border-red-500 text-red-700 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {Array.isArray(category.items) && category.items.filter((item: any) => item.id).map((item: any) => (
              <li key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span className="text-slate-700">{item.skill_name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteSkill(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 mt-4">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill..."
              className="h-10 px-4 rounded-xl border-2 border-slate-200"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onAddSkill(category.id, newSkill)
                  setNewSkill("")
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                onAddSkill(category.id, newSkill)
                setNewSkill("")
              }}
              className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
