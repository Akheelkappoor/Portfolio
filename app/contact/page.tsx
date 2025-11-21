"use client"

import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: contactData, error, isLoading } = useSWR("/api/homepage/contact", fetcher)

  return (
    <main className="bg-white text-slate-900">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <header className="flex items-center justify-between">
            <Link href="/" className="font-bold tracking-tight text-xl sm:text-2xl text-slate-800 hover:text-amber-600 transition-colors">
              AK
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
              <Link href="/#about" className="text-slate-700 hover:text-amber-600 transition-colors">
                About
              </Link>
              <Link href="/#experience" className="text-slate-700 hover:text-amber-600 transition-colors">
                Experience
              </Link>
              <Link href="/#skills" className="text-slate-700 hover:text-amber-600 transition-colors">
                Skills
              </Link>
              <Link href="/#projects" className="text-slate-700 hover:text-amber-600 transition-colors">
                Projects
              </Link>
              <Link href="/contact" className="text-amber-600 font-semibold">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-amber-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
            <nav className="flex flex-col px-4 py-4 space-y-3">
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-amber-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
              >
                About
              </Link>
              <Link
                href="/#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-amber-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
              >
                Experience
              </Link>
              <Link
                href="/#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-amber-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
              >
                Skills
              </Link>
              <Link
                href="/#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-amber-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
              >
                Projects
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-600 font-semibold py-2 px-4 rounded-lg bg-amber-50"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 rounded w-48 mx-auto"></div>
                <div className="h-12 bg-slate-200 rounded w-96 mx-auto"></div>
                <div className="h-6 bg-slate-200 rounded w-full max-w-2xl mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="inline-block mb-4">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold">
                    Let's Work Together
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 sm:mb-6">
                  {contactData?.heading || "Get In Touch"}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                  {contactData?.subheading || "Have a project in mind? Let's discuss how we can work together."}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Contact Information</h2>
                <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
                  Fill out the form or reach out directly through any of these channels.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-100">
                        <div className="h-20 bg-slate-200 rounded"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {contactData?.show_email && contactData?.email && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          ✉️
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">Email</div>
                          <a
                            href={`mailto:${contactData.email}`}
                            className="text-sm sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors break-all"
                          >
                            {contactData.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactData?.show_phone && contactData?.phone && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          📱
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">Phone</div>
                          <a
                            href={`tel:${contactData.phone}`}
                            className="text-sm sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                          >
                            {contactData.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactData?.show_linkedin && contactData?.linkedin_url && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          💼
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">LinkedIn</div>
                          <a
                            href={contactData.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors break-all"
                          >
                            {contactData.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactData?.show_github && contactData?.github_url && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          💻
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">GitHub</div>
                          <a
                            href={contactData.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors break-all"
                          >
                            {contactData.github_url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactData?.show_twitter && contactData?.twitter_url && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          🐦
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">Twitter</div>
                          <a
                            href={contactData.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors break-all"
                          >
                            {contactData.twitter_url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {contactData?.show_location && contactData?.location && (
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          📍
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">Location</div>
                          <div className="text-sm sm:text-lg font-bold text-slate-900">{contactData.location}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
