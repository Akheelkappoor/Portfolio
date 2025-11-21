"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function SetupWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Step 1: Admin
    admin_password: "",
    admin_password_confirm: "",
    admin_email: "",

    // Step 2: Personal
    name: "",
    title: "",
    bio: "",

    // Step 3: Contact
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    location: "",

    // Step 4: Branding
    logo_text: "",
    footer_tagline: "",
  })

  const totalSteps = 5

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setError(null)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.admin_password) {
          setError("Password is required")
          return false
        }
        if (formData.admin_password.length < 8) {
          setError("Password must be at least 8 characters")
          return false
        }
        if (formData.admin_password !== formData.admin_password_confirm) {
          setError("Passwords do not match")
          return false
        }
        return true
      case 2:
        if (!formData.name || !formData.title) {
          setError("Name and title are required")
          return false
        }
        return true
      case 3:
        if (!formData.email) {
          setError("Email is required")
          return false
        }
        return true
      case 4:
        if (!formData.logo_text) {
          setError("Logo text is required")
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, complete: true }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Setup failed")
      }

      // Login with the new password
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.admin_password }),
      })

      if (loginRes.ok) {
        router.push("/admin")
      } else {
        router.push("/admin/login")
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete setup")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AdminPassword formData={formData} onChange={handleChange} />
      case 2:
        return <Step2PersonalInfo formData={formData} onChange={handleChange} />
      case 3:
        return <Step3ContactInfo formData={formData} onChange={handleChange} />
      case 4:
        return <Step4Branding formData={formData} onChange={handleChange} />
      case 5:
        return <Step5Complete formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-3xl">🚀</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
            Welcome to Your Portfolio!
          </h1>
          <p className="text-lg text-slate-600">
            Let's set up your portfolio in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-amber-600 text-white scale-110 shadow-lg"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? "bg-green-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            <span>Admin</span>
            <span>Personal</span>
            <span>Contact</span>
            <span>Branding</span>
            <span>Done!</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-slate-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm font-semibold">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-slate-200">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              variant="outline"
              className="px-6 py-3 rounded-xl font-semibold"
            >
              ← Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg"
            >
              {loading ? "Setting up..." : currentStep === totalSteps ? "Complete Setup 🎉" : "Next →"}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <p>Need help? Check the documentation after setup</p>
        </div>
      </div>
    </div>
  )
}

// Step Components
function Step1AdminPassword({
  formData,
  onChange,
}: {
  formData: any
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">🔐 Step 1: Admin Password</h2>
        <p className="text-slate-600">Create a secure password to access your admin panel</p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-semibold mb-2">💡 Important:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use at least 8 characters</li>
          <li>• Mix letters, numbers, and symbols</li>
          <li>• Don't use common passwords</li>
          <li>• You can change this later in Settings</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="admin_email">Admin Email (optional)</Label>
          <Input
            id="admin_email"
            type="email"
            value={formData.admin_email}
            onChange={(e) => onChange("admin_email", e.target.value)}
            placeholder="admin@example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="admin_password">Password *</Label>
          <Input
            id="admin_password"
            type="password"
            value={formData.admin_password}
            onChange={(e) => onChange("admin_password", e.target.value)}
            placeholder="Enter a secure password"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="admin_password_confirm">Confirm Password *</Label>
          <Input
            id="admin_password_confirm"
            type="password"
            value={formData.admin_password_confirm}
            onChange={(e) => onChange("admin_password_confirm", e.target.value)}
            placeholder="Re-enter your password"
            className="mt-1"
            required
          />
        </div>
      </div>
    </div>
  )
}

function Step2PersonalInfo({
  formData,
  onChange,
}: {
  formData: any
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">👤 Step 2: Personal Information</h2>
        <p className="text-slate-600">Tell visitors about yourself</p>
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-900 font-semibold mb-2">📝 This will appear on:</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Hero section (homepage)</li>
          <li>• Navigation bar</li>
          <li>• Footer</li>
          <li>• Meta tags (SEO)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="John Doe"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="title">Job Title / Role *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Full Stack Developer"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio / About (optional)</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Tell visitors about yourself, your skills, and experience..."
            rows={4}
            className="mt-1"
          />
          <p className="text-xs text-slate-500 mt-1">You can edit this later in the admin panel</p>
        </div>
      </div>
    </div>
  )
}

function Step3ContactInfo({
  formData,
  onChange,
}: {
  formData: any
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">📞 Step 3: Contact Information</h2>
        <p className="text-slate-600">How can people reach you?</p>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-900 font-semibold mb-2">🌐 This appears in:</p>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Contact page</li>
          <li>• Footer (all pages)</li>
          <li>• Homepage contact section</li>
          <li>• You can show/hide each field later</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="your@email.com"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 234 567 8900"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, Country"
            className="mt-1"
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-slate-900 mb-3">Social Links (optional)</h3>

          <div className="space-y-3">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => onChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="github_url">GitHub</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => onChange("github_url", e.target.value)}
                placeholder="https://github.com/yourusername"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter / X</Label>
              <Input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => onChange("twitter_url", e.target.value)}
                placeholder="https://twitter.com/yourusername"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4Branding({
  formData,
  onChange,
}: {
  formData: any
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">🎨 Step 4: Branding</h2>
        <p className="text-slate-600">Make it yours!</p>
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
        <p className="text-sm text-purple-900 font-semibold mb-2">✨ Branding tips:</p>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Logo text: Your initials or name (2-4 characters)</li>
          <li>• Keep it simple and memorable</li>
          <li>• You can customize colors later in Settings</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="logo_text">Logo Text *</Label>
          <Input
            id="logo_text"
            value={formData.logo_text}
            onChange={(e) => onChange("logo_text", e.target.value)}
            placeholder="JD"
            maxLength={10}
            className="mt-1"
            required
          />
          <p className="text-xs text-slate-500 mt-1">This appears in navigation and footer (max 10 characters)</p>
        </div>

        <div>
          <Label htmlFor="footer_tagline">Footer Tagline</Label>
          <Textarea
            id="footer_tagline"
            value={formData.footer_tagline}
            onChange={(e) => onChange("footer_tagline", e.target.value)}
            placeholder="Full Stack Developer crafting amazing web experiences"
            rows={2}
            className="mt-1"
          />
          <p className="text-xs text-slate-500 mt-1">A short description that appears in your footer</p>
        </div>
      </div>
    </div>
  )
}

function Step5Complete({ formData }: { formData: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl animate-bounce">
            <span className="text-white text-5xl">🎉</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Almost Done!</h2>
        <p className="text-lg text-slate-600">Review your information before completing setup</p>
      </div>

      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">👤 Personal Info</h3>
          <p className="text-sm text-slate-600">Name: {formData.name}</p>
          <p className="text-sm text-slate-600">Title: {formData.title}</p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 mb-2">📧 Contact</h3>
          <p className="text-sm text-slate-600">Email: {formData.email}</p>
          {formData.phone && <p className="text-sm text-slate-600">Phone: {formData.phone}</p>}
          {formData.location && <p className="text-sm text-slate-600">Location: {formData.location}</p>}
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 mb-2">🎨 Branding</h3>
          <p className="text-sm text-slate-600">Logo: {formData.logo_text}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">🚀 What's next?</h3>
        <ul className="text-sm text-amber-800 space-y-2">
          <li>✅ Your admin panel will be ready at <code className="bg-amber-100 px-2 py-1 rounded">/admin</code></li>
          <li>✅ Add projects, work experience, and skills</li>
          <li>✅ Upload your profile image and resume</li>
          <li>✅ Customize colors and branding</li>
          <li>✅ All content is editable from the admin panel!</li>
        </ul>
      </div>

      <div className="text-center text-sm text-slate-600">
        <p>Click "Complete Setup" to finish and access your admin panel 🎊</p>
      </div>
    </div>
  )
}
