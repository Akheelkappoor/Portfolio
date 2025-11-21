"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin-sidebar"

type Profile = {
  id: number
  name: string
  title: string
  bio: string | null
  profile_image_url: string | null
  resume_url: string | null
  updated_at: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminProfileClient() {
  const { data: profile, error, isLoading, mutate } = useSWR<Profile>("/api/admin/profile", fetcher)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get("name"),
      title: formData.get("title"),
      bio: formData.get("bio"),
      profile_image_url: formData.get("profile_image_url"),
      resume_url: formData.get("resume_url"),
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update profile")

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

  return (
    <AdminLayout>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Profile & Settings</h1>
                <p className="text-slate-600 mt-1 text-sm">
                  {isEditing ? "Edit your personal information and preferences" : "View your personal information and preferences"}
                </p>
              </div>
              {!isEditing && profile && (
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
                  Edit Profile
                </Button>
              )}
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
                <p className="text-slate-600 font-medium">Loading profile…</p>
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
                <p className="text-sm font-semibold text-red-900">Failed to load profile</p>
                <p className="text-sm text-red-700 mt-1">Please check your database connection.</p>
              </div>
            </div>
          ) : profile ? (
            <form onSubmit={handleSubmit} className="max-w-4xl">
              {/* Success Message */}
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
                    <p className="text-sm font-semibold text-green-900">Profile updated successfully!</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
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

              {/* Personal Information */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Personal Information</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-900">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      required
                      readOnly={!isEditing}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold text-slate-900">
                      Job Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={profile.title}
                      required
                      readOnly={!isEditing}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-sm font-bold text-slate-900">
                      Bio / About
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profile.bio || ""}
                      rows={4}
                      readOnly={!isEditing}
                      className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Notice */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-300 shadow-lg p-8 mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Contact Info & Social Links</h2>
                    <p className="text-slate-700 text-base leading-relaxed mb-4">
                      All contact information and social media links are now managed in one central location for consistency across your entire portfolio.
                    </p>
                    <a
                      href="/admin/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Edit Contact & Social Links
                    </a>
                    <p className="text-sm text-slate-600 mt-3">
                      This includes: Email, Phone, LinkedIn, GitHub, Twitter, Location, and Footer
                    </p>
                  </div>
                </div>
              </div>

              {/* Media & Files */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Media & Files</h2>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile_image_url" className="text-sm font-bold text-slate-900">
                      Profile Image URL
                    </Label>
                    <Input
                      id="profile_image_url"
                      name="profile_image_url"
                      type="url"
                      defaultValue={profile.profile_image_url || ""}
                      placeholder="https://example.com/profile.jpg"
                      readOnly={!isEditing}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the URL of your profile image. This will be displayed on your portfolio homepage.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume_url" className="text-sm font-bold text-slate-900">
                      Resume URL
                    </Label>
                    <Input
                      id="resume_url"
                      name="resume_url"
                      type="url"
                      defaultValue={profile.resume_url || ""}
                      placeholder="https://example.com/resume.pdf"
                      readOnly={!isEditing}
                      className="h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the URL where your resume PDF is hosted. Visitors can download it from your portfolio.
                    </p>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          ) : null}
        </section>
      </main>
    </AdminLayout>
  )
}
