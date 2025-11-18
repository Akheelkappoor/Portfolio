"use client"

import { useEffect } from "react"

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function loadColorTheme() {
      try {
        const res = await fetch("/api/settings")
        const settings = await res.json()

        // Inject CSS variables into the document
        if (settings.primary_color) {
          document.documentElement.style.setProperty("--color-primary", settings.primary_color)
        }
        if (settings.secondary_color) {
          document.documentElement.style.setProperty("--color-secondary", settings.secondary_color)
        }
      } catch (err) {
        console.error("Failed to load color theme:", err)
        // Set defaults on error
        document.documentElement.style.setProperty("--color-primary", "#f59e0b")
        document.documentElement.style.setProperty("--color-secondary", "#ea580c")
      }
    }

    loadColorTheme()
  }, [])

  return <>{children}</>
}
