import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Contact | Akheel Kappoor - Business Analyst",
  description: "Get in touch with Akheel Kappoor. Available for Business Analyst opportunities in Dubai, UAE.",
}

export default function ContactPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <header className="flex items-center justify-between">
            <Link href="/" className="font-bold tracking-tight text-2xl text-slate-800 hover:text-amber-600 transition-colors">
              AK
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium">
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
          </header>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
                Let's Work Together
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Touch</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind or looking for a Business Analyst? I'm available for opportunities in Dubai, UAE.
              Let's discuss how I can help drive your business forward.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Information</h2>
                <p className="text-slate-600 mb-8">
                  Fill out the form or reach out directly through any of these channels.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Email</div>
                    <a
                      href="mailto:akheelkappoor@outlook.com"
                      className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                    >
                      akheelkappoor@outlook.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                    📱
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Phone</div>
                    <a
                      href="tel:+971504978045"
                      className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                    >
                      +971 50 497 8045
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">LinkedIn</div>
                    <a
                      href="https://linkedin.com/in/akheelkappoor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                    >
                      linkedin.com/in/akheelkappoor
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">Location</div>
                    <div className="text-lg font-bold text-slate-900">Dubai, UAE</div>
                    <div className="text-sm text-slate-600 mt-1">Available Immediately</div>
                  </div>
                </div>
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
