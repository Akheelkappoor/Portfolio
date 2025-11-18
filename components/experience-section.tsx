"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { data: experiences, error } = useSWR("/api/homepage/experience", fetcher)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in-left")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".slide-element")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [experiences])

  // Loading state
  if (!experiences) {
    return (
      <section id="experience" className="w-full bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading experiences...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" ref={sectionRef} className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Delivering measurable impact through data-driven solutions
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500"></div>

          <div className="space-y-12">
            {experiences.map((exp: any, index: number) => (
              <div
                key={index}
                className={`relative slide-element opacity-0 ${
                  index % 2 === 0 ? "md:pr-1/2 md:text-right" : "md:pl-1/2 md:ml-auto"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-lg transform -translate-x-1/2"></div>

                <div className="ml-20 md:ml-0 md:w-11/12">
                  <div className="group bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-200">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{exp.title}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 text-slate-600">
                          <span className="font-semibold">{exp.company}</span>
                          <span className="text-amber-600">•</span>
                          <span className="text-sm">{exp.location}</span>
                        </div>
                        <div className="text-sm text-slate-500">{exp.period}</div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {exp.achievements?.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700">
                          <span className="text-amber-500 mt-1">✓</span>
                          <span className="text-left">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .slide-element:nth-child(2) {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  )
}
