"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Settings, User, Globe, Palette, Search, Database, Mail } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminSettingsClient() {
  const { data: settings, error, mutate } = useSWR("/api/admin/settings", fetcher)
  const { data: emailSettings, mutate: mutateEmail } = useSWR("/api/admin/email-settings", fetcher)
  const [activeTab, setActiveTab] = useState("account")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    admin_email: "",
    email_notifications: true,
    session_timeout: 3600,
    site_title: "",
    site_description: "",
    google_analytics_id: "",
    contact_form_email: "",
    primary_color: "#f59e0b",
    secondary_color: "#ea580c",
    logo_url: "",
    favicon_url: "",
    default_og_image: "",
    twitter_handle: "",
    meta_keywords: "",
  })

  const [emailFormData, setEmailFormData] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_user: "",
    smtp_password: "",
    from_email: "",
    to_email: "",
    email_enabled: false,
  })

  // Update form when data loads
  useEffect(() => {
    if (settings) {
      setFormData({
        admin_email: settings.admin_email || "",
        email_notifications: settings.email_notifications ?? true,
        session_timeout: settings.session_timeout || 3600,
        site_title: settings.site_title || "",
        site_description: settings.site_description || "",
        google_analytics_id: settings.google_analytics_id || "",
        contact_form_email: settings.contact_form_email || "",
        primary_color: settings.primary_color || "#f59e0b",
        secondary_color: settings.secondary_color || "#ea580c",
        logo_url: settings.logo_url || "",
        favicon_url: settings.favicon_url || "",
        default_og_image: settings.default_og_image || "",
        twitter_handle: settings.twitter_handle || "",
        meta_keywords: settings.meta_keywords || "",
      })
    }
  }, [settings])

  // Update email form when email settings load
  useEffect(() => {
    if (emailSettings) {
      setEmailFormData({
        smtp_host: emailSettings.smtp_host || "smtp.gmail.com",
        smtp_port: emailSettings.smtp_port || 587,
        smtp_user: emailSettings.smtp_user || "",
        smtp_password: "", // Never populate password field
        from_email: emailSettings.from_email || "",
        to_email: emailSettings.to_email || "",
        email_enabled: emailSettings.email_enabled || false,
      })
    }
  }, [emailSettings])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setMessage("Settings saved successfully!")
        mutate()
        setTimeout(() => setMessage(""), 3000)
      } else {
        const data = await res.json()
        setMessage(`Error: ${data.error || "Failed to save"}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }
    setSaving(false)
  }

  const handleEmailSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailFormData),
      })
      if (res.ok) {
        setMessage("Email settings saved successfully!")
        mutateEmail()
        // Clear password field after save
        setEmailFormData(prev => ({ ...prev, smtp_password: "" }))
        setTimeout(() => setMessage(""), 3000)
      } else {
        const data = await res.json()
        setMessage(`Error: ${data.error || "Failed to save"}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }
    setSaving(false)
  }

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/export")
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        setMessage("Database exported successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Error: Failed to export database")
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "email", label: "Email", icon: Mail },
    { id: "site", label: "Site", icon: Globe },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "seo", label: "SEO", icon: Search },
    { id: "backup", label: "Backup & Export", icon: Database },
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <p className="text-red-400">Failed to load settings. Please try again.</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-700/50 rounded-lg w-64"></div>
            <div className="h-96 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400">Configure your portfolio site</p>
            </div>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${message.includes("Error") ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-green-500/10 border border-green-500/20 text-green-400"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 space-y-6">
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                <p className="text-slate-400 text-sm mb-6">Manage your admin account and security preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={formData.admin_email}
                    onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="email_notifications"
                    checked={formData.email_notifications}
                    onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <label htmlFor="email_notifications" className="text-slate-300 text-sm">
                    Enable email notifications for new messages
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Session Timeout (seconds)</label>
                  <input
                    type="number"
                    value={formData.session_timeout}
                    onChange={(e) => setFormData({ ...formData, session_timeout: parseInt(e.target.value) || 3600 })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="3600"
                  />
                  <p className="text-xs text-slate-500 mt-1">Default: 3600 seconds (1 hour)</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Email Settings</h2>
                <p className="text-slate-400 text-sm mb-6">Configure SMTP settings for contact form email notifications</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>📧 Gmail Setup:</strong> Use your Gmail address and create an App Password at{" "}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    myaccount.google.com/apppasswords
                  </a>
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="email_enabled"
                    checked={emailFormData.email_enabled}
                    onChange={(e) => setEmailFormData({ ...emailFormData, email_enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <label htmlFor="email_enabled" className="text-slate-300 font-medium">
                    Enable Email Notifications
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={emailFormData.smtp_host}
                      onChange={(e) => setEmailFormData({ ...emailFormData, smtp_host: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      value={emailFormData.smtp_port}
                      onChange={(e) => setEmailFormData({ ...emailFormData, smtp_port: parseInt(e.target.value) || 587 })}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Gmail Address</label>
                  <input
                    type="email"
                    value={emailFormData.smtp_user}
                    onChange={(e) => setEmailFormData({ ...emailFormData, smtp_user: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Gmail App Password
                    {emailSettings?.has_password && (
                      <span className="ml-2 text-xs text-green-400">(Password saved)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={emailFormData.smtp_password}
                    onChange={(e) => setEmailFormData({ ...emailFormData, smtp_password: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter new password to update"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to keep existing password</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">From Email</label>
                  <input
                    type="email"
                    value={emailFormData.from_email}
                    onChange={(e) => setEmailFormData({ ...emailFormData, from_email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your@gmail.com (usually same as Gmail address)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Send To Email</label>
                  <input
                    type="email"
                    value={emailFormData.to_email}
                    onChange={(e) => setEmailFormData({ ...emailFormData, to_email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="where@to-receive-messages.com"
                  />
                  <p className="text-xs text-slate-500 mt-1">Where contact form messages will be sent</p>
                </div>
              </div>
            </div>
          )}

          {/* Site Settings */}
          {activeTab === "site" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Site Settings</h2>
                <p className="text-slate-400 text-sm mb-6">Configure basic site information and integrations</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Site Title</label>
                  <input
                    type="text"
                    value={formData.site_title}
                    onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Akheel Kappoor - Business Analyst Portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Site Description</label>
                  <textarea
                    value={formData.site_description}
                    onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Business Analyst with 1+ year of experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={formData.google_analytics_id}
                    onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contact Form Email</label>
                  <input
                    type="email"
                    value={formData.contact_form_email}
                    onChange={(e) => setFormData({ ...formData, contact_form_email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="contact@example.com"
                  />
                  <p className="text-xs text-slate-500 mt-1">Where contact form submissions will be sent</p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
                <p className="text-slate-400 text-sm mb-6">Customize the look and feel of your portfolio</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="w-16 h-10 rounded border border-slate-600 bg-slate-900/50 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="w-16 h-10 rounded border border-slate-600 bg-slate-900/50 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="#ea580c"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-slate-500 mt-1">Upload to S3/Cloudinary and paste URL here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Favicon URL</label>
                  <input
                    type="url"
                    value={formData.favicon_url}
                    onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">SEO Settings</h2>
                <p className="text-slate-400 text-sm mb-6">Optimize your portfolio for search engines and social media</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Open Graph Image</label>
                  <input
                    type="url"
                    value={formData.default_og_image}
                    onChange={(e) => setFormData({ ...formData, default_og_image: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://example.com/og-image.png"
                  />
                  <p className="text-xs text-slate-500 mt-1">Used when sharing on social media (1200x630px recommended)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twitter Handle</label>
                  <input
                    type="text"
                    value={formData.twitter_handle}
                    onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="@yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Meta Keywords</label>
                  <textarea
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="business analyst, portfolio, data analysis..."
                  />
                  <p className="text-xs text-slate-500 mt-1">Comma-separated keywords for search engines</p>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Export */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Backup & Export</h2>
                <p className="text-slate-400 text-sm mb-6">Manage your portfolio data backups</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Export Database</h3>
                  <p className="text-slate-400 text-sm mb-4">Download a complete backup of all your portfolio data as JSON</p>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Export Now
                  </button>
                </div>

                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Import Data</h3>
                  <p className="text-slate-400 text-sm mb-4">Restore from a previously exported backup file</p>
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-700 text-slate-500 rounded-lg cursor-not-allowed"
                  >
                    Import (Coming Soon)
                  </button>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Reset to Defaults</h3>
                  <p className="text-slate-400 text-sm mb-4">Reset all settings to their default values (cannot be undone)</p>
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-700 text-slate-500 rounded-lg cursor-not-allowed"
                  >
                    Reset (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== "backup" && (
            <div className="pt-6 border-t border-slate-700">
              <button
                onClick={activeTab === "email" ? handleEmailSave : handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
