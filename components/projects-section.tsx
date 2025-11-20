"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type Project = {
  id?: string
  title: string
  meta: string
  badge?: string
  challenge?: string[]
  solution?: string[]
  impact?: string[]
  stack: string[]
  category?: string[]
  imageUrl?: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const PROJECTS_PER_PAGE = 4

export function ProjectsSection() {
  const { data, error } = useSWR<Project[]>("/api/projects", fetcher)
  const [currentPage, setCurrentPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)

  const projects = Array.isArray(data) ? data : []
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const displayedProjects = projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to projects section when page changes
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="projects" ref={sectionRef} className="w-full bg-slate-100 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 sm:mb-4">
            Featured Projects
          </h2>
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-medium px-4">
            Strategic solutions that drive measurable business impact
          </p>
        </div>

        {error ? (
          <div className="mt-8 text-center text-sm text-red-600">Unable to load projects right now.</div>
        ) : null}

        {projects.length === 0 && !error ? (
          <div className="mt-8 text-center text-sm text-slate-600">
            No projects yet — add some in your admin dashboard.
          </div>
        ) : null}

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          {displayedProjects.map((p, index) => (
            <div
              key={`${p.id || p.title}-${currentPage}`}
              className="project-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-slate-300">
                {p.imageUrl && (
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={p.imageUrl || "/placeholder.svg"}
                      alt={`${p.title} cover`}
                      width={1200}
                      height={630}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {p.badge && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                        <span className="rounded-full bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold shadow-xl border-2 border-white">
                          {p.badge}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-white">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-slate-700 text-xs sm:text-sm font-medium">{p.meta}</p>
                  </div>

                  {p.challenge && <SectionBlock title="Challenge" items={p.challenge.slice(0, 2)} />}
                  {p.solution && <SectionBlock title="Solution" items={p.solution.slice(0, 2)} />}
                  {p.impact && <SectionBlock title="Impact" items={p.impact.slice(0, 2)} icon="📊" />}

                  <div className="flex flex-wrap gap-2 pt-3 sm:pt-4 border-t-2 border-slate-300">
                    {p.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-amber-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold hover:bg-amber-700 transition-colors shadow-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 px-4">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="hover:bg-amber-50 hover:border-amber-600 transition-all text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">← Previous</span>
              <span className="sm:hidden">←</span>
            </Button>

            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all text-sm ${
                    currentPage === page
                      ? "bg-amber-600 text-white shadow-lg scale-110"
                      : "bg-white text-slate-700 hover:bg-amber-50 border border-slate-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="hover:bg-amber-50 hover:border-amber-600 transition-all text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Next →</span>
              <span className="sm:hidden">→</span>
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .project-card {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}

function SectionBlock({ title, items, icon }: { title: string; items: string[]; icon?: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
        {icon && <span className="text-base sm:text-lg">{icon}</span>}
        {title}
      </h4>
      <ul className="space-y-1.5 sm:space-y-2">
        {items.map((i, index) => (
          <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 font-medium">
            <span className="text-amber-600 mt-0.5 font-bold flex-shrink-0">•</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
