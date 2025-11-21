"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin-sidebar"
import { Switch } from "@/components/ui/switch"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminContactClient() {
  const { data: contactData, error, isLoading, mutate } = useSWR("/api/homepage/contact", fetcher)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    location: "",
    logo_text: "",
    footer_tagline: "",
    copyright_text: "",
    footer_note: "",
    show_email: true,
    show_phone: true,
    show_linkedin: true,
    show_github: true,
    show_twitter: true,
    show_location: true,
  })

  // Initialize form when data loads
  if (contactData && !isEditing && formData.email === "") {
    setFormData({
      heading: contactData.heading || "",
      subheading: contactData.subheading || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      linkedin_url: contactData.linkedin_url || "",
      github_url: contactData.github_url || "",
      twitter_url: contactData.twitter_url || "",
      location: contactData.location || "",
      logo_text: contactData.logo_text || "",
      footer_tagline: contactData.footer_tagline || "",
      copyright_text: contactData.copyright_text || "",
      footer_note: contactData.footer_note || "",
      show_email: contactData.show_email !== false,
      show_phone: contactData.show_phone !== false,
      show_linkedin: contactData.show_linkedin !== false,
      show_github: contactData.show_github !== false,
      show_twitter: contactData.show_twitter !== false,
      show_location: contactData.show_location !== false,
    })
  }

  const handleChange = (field: string, value: any) => {
    setIsEditing(true)
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const res = await fetch("/api/homepage/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save")
      }

      setSaveSuccess(true)
      setIsEditing(false)
      mutate()

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <main className="min-h-screen p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="h-4 bg-slate-200 rounded w-96"></div>
            <div className="space-y-3 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <main className="min-h-screen p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error loading contact data</h2>
            <p className="text-red-700">{error.message || "Failed to load contact page content"}</p>
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <main className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Contact Page</h1>
                <p className="text-slate-600 mt-1 text-sm">Edit your contact page content and information</p>
              </div>
              <div className="flex gap-3">
                {saveSuccess && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-green-800 font-semibold text-sm">Saved successfully!</span>
                  </div>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving || !isEditing}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="p-8 max-w-4xl">
          {saveError && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-800 font-semibold">Error: {saveError}</p>
            </div>
          )}

          {/* Hero Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📄</span> Page Header
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="heading" className="text-sm font-semibold text-slate-700">
                  Page Heading
                </Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => handleChange("heading", e.target.value)}
                  placeholder="Get In Touch"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subheading" className="text-sm font-semibold text-slate-700">
                  Subheading / Description
                </Label>
                <Textarea
                  id="subheading"
                  value={formData.subheading}
                  onChange={(e) => handleChange("subheading", e.target.value)}
                  placeholder="Have a project in mind? Let's discuss how we can work together."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📞</span> Contact Information
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_email"
                    checked={formData.show_email}
                    onCheckedChange={(checked) => handleChange("show_email", checked)}
                  />
                  <Label htmlFor="show_email" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_phone"
                    checked={formData.show_phone}
                    onCheckedChange={(checked) => handleChange("show_phone", checked)}
                  />
                  <Label htmlFor="show_phone" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="linkedin_url" className="text-sm font-semibold text-slate-700">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_linkedin"
                    checked={formData.show_linkedin}
                    onCheckedChange={(checked) => handleChange("show_linkedin", checked)}
                  />
                  <Label htmlFor="show_linkedin" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="github_url" className="text-sm font-semibold text-slate-700">
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_github"
                    checked={formData.show_github}
                    onCheckedChange={(checked) => handleChange("show_github", checked)}
                  />
                  <Label htmlFor="show_github" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>

              {/* Twitter */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="twitter_url" className="text-sm font-semibold text-slate-700">
                    Twitter/X URL
                  </Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleChange("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_twitter"
                    checked={formData.show_twitter}
                    onCheckedChange={(checked) => handleChange("show_twitter", checked)}
                  />
                  <Label htmlFor="show_twitter" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    id="show_location"
                    checked={formData.show_location}
                    onCheckedChange={(checked) => handleChange("show_location", checked)}
                  />
                  <Label htmlFor="show_location" className="text-sm text-slate-600 cursor-pointer">
                    Show
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer & Branding */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mt-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🎨</span> Footer & Branding
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo_text" className="text-sm font-semibold text-slate-700">
                  Logo Text (Navigation & Footer)
                </Label>
                <Input
                  id="logo_text"
                  value={formData.logo_text}
                  onChange={(e) => handleChange("logo_text", e.target.value)}
                  placeholder="AK"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">This appears in the navigation and footer</p>
              </div>

              <div>
                <Label htmlFor="footer_tagline" className="text-sm font-semibold text-slate-700">
                  Footer Tagline
                </Label>
                <Textarea
                  id="footer_tagline"
                  value={formData.footer_tagline}
                  onChange={(e) => handleChange("footer_tagline", e.target.value)}
                  placeholder="Business Analyst transforming data into actionable insights"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="copyright_text" className="text-sm font-semibold text-slate-700">
                  Copyright Text
                </Label>
                <Input
                  id="copyright_text"
                  value={formData.copyright_text}
                  onChange={(e) => handleChange("copyright_text", e.target.value)}
                  placeholder="All rights reserved."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="footer_note" className="text-sm font-semibold text-slate-700">
                  Footer Note
                </Label>
                <Input
                  id="footer_note"
                  value={formData.footer_note}
                  onChange={(e) => handleChange("footer_note", e.target.value)}
                  placeholder="Built with ❤ using Next.js"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Save Button (Bottom) */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving || !isEditing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </section>
      </main>
    </AdminLayout>
  )
}
