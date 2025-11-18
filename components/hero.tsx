"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { data: hero, error } = useSWR("/api/homepage/hero", fetcher)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = heroRef.current?.querySelectorAll(".fade-in-element")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Loading state
  if (!hero) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </section>
    )
  }

  // Error state - if API returns error
  if (error || hero.error) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hero Section Not Configured</h2>
          <p className="text-slate-600 mb-4">Please configure the hero section in the admin panel.</p>
          <a href="/admin/homepage" className="text-theme-primary hover:underline">Go to Admin Panel →</a>
        </div>
      </section>
    )
  }

  // Parse stats and CTAs - ensure they are arrays
  const stats = Array.isArray(hero.stats) ? hero.stats : (hero.stats ? (typeof hero.stats === 'string' ? JSON.parse(hero.stats) : []) : [])
  const ctas = Array.isArray(hero.ctas) ? hero.ctas : (hero.ctas ? (typeof hero.ctas === 'string' ? JSON.parse(hero.ctas) : []) : [])

  return (
    <section ref={heroRef} className="w-full min-h-screen flex items-center bg-white">
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <header className="flex items-center justify-between">
            <div className="font-bold tracking-tight text-2xl text-slate-800">AK</div>
            <nav className="flex items-center gap-8 text-sm font-medium">
              <a href="#about" className="text-slate-700 hover:text-theme-primary transition-colors smooth-scroll">
                About
              </a>
              <a href="#experience" className="text-slate-700 hover:text-theme-primary transition-colors smooth-scroll">
                Experience
              </a>
              <a href="#skills" className="text-slate-700 hover:text-theme-primary transition-colors smooth-scroll">
                Skills
              </a>
              <a href="#projects" className="text-slate-700 hover:text-theme-primary transition-colors smooth-scroll">
                Projects
              </a>
              <a href="#contact" className="text-slate-700 hover:text-theme-primary transition-colors smooth-scroll">
                Contact
              </a>
            </nav>
          </header>
        </div>
      </div>

      {/* Hero Content */}
      <div className="mx-auto max-w-7xl px-6 py-24 mt-16 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 fade-in-element">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, white)',
                color: 'var(--color-primary)'
              }}>
                {hero.badge || "Business Analyst"}
              </span>
            </div>

            <h1 className="text-balance text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-slate-900">
              {hero.name || "Akheel"}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-theme-secondary">
                {hero.tagline || "Kappoor"}
              </span>
            </h1>

            <p className="text-pretty text-lg text-slate-600 leading-relaxed max-w-xl">
              {hero.description || "Business Analyst with 1+ year of experience delivering 80+ projects."}
            </p>

            <div className="flex flex-wrap gap-4">
              {ctas.map((cta: any, index: number) => (
                <a key={index} href={cta.url || "#"}>
                  <Button
                    variant={cta.variant || "default"}
                    className={
                      cta.variant === "outline"
                        ? "px-6 py-6 text-base border-2 border-theme-primary text-theme-primary transition-all duration-300 hover:scale-105"
                        : cta.variant === "ghost"
                        ? "px-6 py-6 text-base text-slate-700 hover:text-theme-primary transition-all duration-300"
                        : "px-6 py-6 text-base bg-slate-800 hover:bg-slate-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    }
                    style={cta.variant === "outline" ? {
                      backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, white)'
                    } : undefined}
                  >
                    {cta.label || "Button"}
                  </Button>
                </a>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat: any, index: number) => (
                <StatItem key={index} value={stat.value || "0"} label={stat.label || "Stat"} />
              ))}
            </div>
          </div>

          {/* Right: Large Photo */}
          <div className="relative fade-in-element delay-200">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse" style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 40%, white)'
              }}></div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" style={{
                backgroundColor: 'color-mix(in srgb, var(--color-secondary) 40%, white)'
              }}></div>

              {/* Photo container with hover effect */}
              <div className="relative z-10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-3xl rotate-6 group-hover:rotate-3 transition-transform duration-500"></div>
                <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 bg-white">
                  <Image
                    src={hero.profile_image_url || "/profile.jpg"}
                    alt={`${hero.name || "Akheel"} ${hero.tagline || "Kappoor"} - ${hero.badge || "Business Analyst"}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 right-8 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl ${
                    hero.availability_status === "available"
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : hero.availability_status === "busy"
                      ? "bg-gradient-to-br from-red-400 to-rose-500"
                      : "bg-gradient-to-br from-theme-primary to-theme-secondary"
                  }`}>
                    {hero.availability_status === "available" ? "✓" : hero.availability_status === "busy" ? "✕" : "~"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{hero.availability_text || "Available Immediately"}</div>
                    <div className="text-xs text-slate-600">{hero.location || "Dubai, UAE"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="group">
      <div className="text-3xl sm:text-4xl font-bold text-slate-900 group-hover:text-theme-primary transition-colors">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-slate-600 mt-1">{label}</div>
    </div>
  )
}
