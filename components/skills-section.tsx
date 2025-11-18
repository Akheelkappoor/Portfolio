"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { data: skills, error } = useSWR("/api/homepage/skills", fetcher)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".skill-card")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [skills])

  // Loading state
  if (!skills) {
    return (
      <section id="skills" className="w-full bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading skills...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" ref={sectionRef} className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive toolkit for business analysis and data-driven decision making
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill: any, index: number) => (
            <div
              key={skill.title}
              className="skill-card opacity-0 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-full bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] border border-slate-200">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-amber-600 transition-colors">
                  {skill.title}
                </h3>
                <ul className="space-y-3">
                  {skill.items?.map((item: any) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-amber-500 mt-0.5">✓</span>
                      <span>{item.skill_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
