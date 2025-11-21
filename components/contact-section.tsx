"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ContactSection() {
  const { data: contactData, isLoading } = useSWR("/api/homepage/contact", fetcher)

  return (
    <section id="contact" className="w-full bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 sm:mb-4">
            {isLoading ? "Let's Work Together" : contactData?.heading || "Let's Work Together"}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            {isLoading ? "Have a project in mind? Let's discuss how I can help drive your business forward" : contactData?.subheading || "Have a project in mind? Let's discuss how I can help drive your business forward"}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl">
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 rounded-xl bg-white/5 h-16"></div>
                  ))}
                </div>
              ) : (
                <>
                  {contactData?.show_email && contactData?.email && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                        ✉️
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-slate-400">Email</div>
                        <a
                          href={`mailto:${contactData.email}`}
                          className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                        >
                          {contactData.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData?.show_phone && contactData?.phone && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                        📱
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-slate-400">Phone</div>
                        <a
                          href={`tel:${contactData.phone}`}
                          className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base"
                        >
                          {contactData.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData?.show_linkedin && contactData?.linkedin_url && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                        💼
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-slate-400">LinkedIn</div>
                        <a
                          href={contactData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                        >
                          {contactData.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData?.show_github && contactData?.github_url && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                        💻
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-slate-400">GitHub</div>
                        <a
                          href={contactData.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                        >
                          {contactData.github_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData?.show_twitter && contactData?.twitter_url && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                        🐦
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-slate-400">Twitter</div>
                        <a
                          href={contactData.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                        >
                          {contactData.twitter_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4 sm:pt-6 border-t border-white/20">
                <Link href="/contact">
                  <Button className="w-full py-4 sm:py-6 text-sm sm:text-base bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:scale-105 shadow-lg">
                    Send Me a Message →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
