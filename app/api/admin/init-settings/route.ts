import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create site_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        admin_email VARCHAR(255),
        email_notifications BOOLEAN DEFAULT true,
        session_timeout INTEGER DEFAULT 3600,
        site_title VARCHAR(255) DEFAULT 'Portfolio',
        site_description TEXT,
        google_analytics_id VARCHAR(100),
        contact_form_email VARCHAR(255),
        primary_color VARCHAR(7) DEFAULT '#f59e0b',
        secondary_color VARCHAR(7) DEFAULT '#ea580c',
        logo_url VARCHAR(500),
        favicon_url VARCHAR(500),
        default_og_image VARCHAR(500),
        twitter_handle VARCHAR(100),
        meta_keywords TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Check if settings exist
    const existing = await query("SELECT COUNT(*) as count FROM site_settings")
    if (existing.rows[0].count > 0) {
      return NextResponse.json({ message: "Settings already initialized" })
    }

    // Insert default settings
    await query(`
      INSERT INTO site_settings (
        admin_email,
        site_title,
        site_description,
        contact_form_email,
        primary_color,
        secondary_color
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'admin@example.com',
      'Akheel Kappoor - Business Analyst Portfolio',
      'Business Analyst with 1+ year of experience delivering 80+ projects. Expert in requirements gathering, process optimization, and data-driven solutions.',
      'admin@example.com',
      '#f59e0b',
      '#ea580c'
    ])

    return NextResponse.json({ message: "Settings initialized successfully!" })
  } catch (err: any) {
    console.error("Failed to initialize settings:", err)
    return NextResponse.json({ error: err?.message || "Failed to initialize" }, { status: 500 })
  }
}
