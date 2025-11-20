"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="w-full bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 sm:mb-4">
            Let's Work Together
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Have a project in mind? Let's discuss how I can help drive your business forward
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  ✉️
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400">Email</div>
                  <a
                    href="mailto:akheelkappoor@outlook.com"
                    className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                  >
                    akheelkappoor@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  📱
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400">Phone</div>
                  <a
                    href="tel:+971504978045"
                    className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base"
                  >
                    +971 50 497 8045
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  💼
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400">LinkedIn</div>
                  <a
                    href="https://linkedin.com/in/akheelkappoor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                  >
                    linkedin.com/in/akheelkappoor
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                  🌐
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm text-slate-400">Website</div>
                  <a
                    href="https://akheelkappoor.mooo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-amber-400 transition-colors text-sm sm:text-base truncate block"
                  >
                    akheelkappoor.mooo.com
                  </a>
                </div>
              </div>

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
