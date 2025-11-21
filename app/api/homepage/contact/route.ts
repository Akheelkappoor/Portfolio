import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch contact page content
export async function GET() {
  try {
    const result = await query("SELECT * FROM contact_page_content ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Contact page content not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to fetch contact page content:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch contact page content" }, { status: 500 })
  }
}

// PUT - Update contact page content
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      heading,
      subheading,
      email,
      phone,
      linkedin_url,
      github_url,
      twitter_url,
      location,
      logo_text,
      footer_tagline,
      copyright_text,
      footer_note,
      show_email,
      show_phone,
      show_linkedin,
      show_github,
      show_twitter,
      show_location,
    } = data

    await query(
      `UPDATE contact_page_content SET
        heading = $1,
        subheading = $2,
        email = $3,
        phone = $4,
        linkedin_url = $5,
        github_url = $6,
        twitter_url = $7,
        location = $8,
        logo_text = $9,
        footer_tagline = $10,
        copyright_text = $11,
        footer_note = $12,
        show_email = $13,
        show_phone = $14,
        show_linkedin = $15,
        show_github = $16,
        show_twitter = $17,
        show_location = $18,
        updated_at = NOW()
      WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)`,
      [
        heading,
        subheading,
        email,
        phone,
        linkedin_url,
        github_url,
        twitter_url,
        location,
        logo_text,
        footer_tagline,
        copyright_text,
        footer_note,
        show_email,
        show_phone,
        show_linkedin,
        show_github,
        show_twitter,
        show_location,
      ]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update contact page content:", err)
    return NextResponse.json({ error: err?.message || "Failed to update contact page content" }, { status: 500 })
  }
}
