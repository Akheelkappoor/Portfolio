import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Export all database data as JSON
export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Export all tables
    const [
      projects,
      messages,
      profile,
      heroSection,
      experiences,
      skillsCategories,
      skillsItems,
      settings
    ] = await Promise.all([
      query("SELECT * FROM projects ORDER BY created_at DESC").catch(() => ({ rows: [] })),
      query("SELECT * FROM messages ORDER BY created_at DESC").catch(() => ({ rows: [] })),
      query("SELECT * FROM profile ORDER BY id LIMIT 1").catch(() => ({ rows: [] })),
      query("SELECT * FROM hero_section ORDER BY id LIMIT 1").catch(() => ({ rows: [] })),
      query("SELECT * FROM work_experience ORDER BY id ASC").catch(() => ({ rows: [] })),
      query("SELECT * FROM skills_categories ORDER BY id ASC").catch(() => ({ rows: [] })),
      query("SELECT * FROM skills_items ORDER BY category_id ASC").catch(() => ({ rows: [] })),
      query("SELECT * FROM site_settings ORDER BY id LIMIT 1").catch(() => ({ rows: [] })),
    ])

    const backup = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      data: {
        projects: projects.rows,
        messages: messages.rows,
        profile: profile.rows[0] || null,
        heroSection: heroSection.rows[0] || null,
        workExperience: experiences.rows,
        skillsCategories: skillsCategories.rows,
        skillsItems: skillsItems.rows,
        siteSettings: settings.rows[0] || null,
      }
    }

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
  } catch (err: any) {
    console.error("Failed to export data:", err)
    return NextResponse.json({ error: err?.message || "Failed to export data" }, { status: 500 })
  }
}
