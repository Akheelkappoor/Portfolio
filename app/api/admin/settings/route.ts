import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch settings
export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query("SELECT * FROM site_settings ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to fetch settings:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      admin_email,
      email_notifications,
      session_timeout,
      site_title,
      site_description,
      google_analytics_id,
      contact_form_email,
      primary_color,
      secondary_color,
      logo_url,
      favicon_url,
      default_og_image,
      twitter_handle,
      meta_keywords,
    } = data

    await query(
      `UPDATE site_settings SET
        admin_email = $1,
        email_notifications = $2,
        session_timeout = $3,
        site_title = $4,
        site_description = $5,
        google_analytics_id = $6,
        contact_form_email = $7,
        primary_color = $8,
        secondary_color = $9,
        logo_url = $10,
        favicon_url = $11,
        default_og_image = $12,
        twitter_handle = $13,
        meta_keywords = $14,
        updated_at = NOW()
      WHERE id = (SELECT id FROM site_settings ORDER BY id LIMIT 1)`,
      [
        admin_email,
        email_notifications,
        session_timeout,
        site_title,
        site_description,
        google_analytics_id,
        contact_form_email,
        primary_color,
        secondary_color,
        logo_url,
        favicon_url,
        default_og_image,
        twitter_handle,
        meta_keywords,
      ]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update settings:", err)
    return NextResponse.json({ error: err?.message || "Failed to update settings" }, { status: 500 })
  }
}
