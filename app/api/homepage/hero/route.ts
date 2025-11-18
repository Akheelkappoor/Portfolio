import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch hero section
export async function GET() {
  try {
    const result = await query("SELECT * FROM hero_section ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Hero section not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to fetch hero section:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch hero section" }, { status: 500 })
  }
}

// PUT - Update hero section
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      badge_text,
      name,
      tagline,
      description,
      profile_image_url,
      resume_url,
      cta_primary_text,
      cta_primary_link,
      cta_secondary_text,
      cta_secondary_link,
      stat_1_value,
      stat_1_label,
      stat_2_value,
      stat_2_label,
      stat_3_value,
      stat_3_label,
      stat_4_value,
      stat_4_label,
      availability_status,
      availability_location,
    } = data

    await query(
      `UPDATE hero_section SET
        badge_text = $1,
        name = $2,
        tagline = $3,
        description = $4,
        profile_image_url = $5,
        resume_url = $6,
        cta_primary_text = $7,
        cta_primary_link = $8,
        cta_secondary_text = $9,
        cta_secondary_link = $10,
        stat_1_value = $11,
        stat_1_label = $12,
        stat_2_value = $13,
        stat_2_label = $14,
        stat_3_value = $15,
        stat_3_label = $16,
        stat_4_value = $17,
        stat_4_label = $18,
        availability_status = $19,
        availability_location = $20,
        updated_at = NOW()
      WHERE id = (SELECT id FROM hero_section ORDER BY id LIMIT 1)`,
      [
        badge_text,
        name,
        tagline,
        description,
        profile_image_url,
        resume_url,
        cta_primary_text,
        cta_primary_link,
        cta_secondary_text,
        cta_secondary_link,
        stat_1_value,
        stat_1_label,
        stat_2_value,
        stat_2_label,
        stat_3_value,
        stat_3_label,
        stat_4_value,
        stat_4_label,
        availability_status,
        availability_location,
      ]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update hero section:", err)
    return NextResponse.json({ error: err?.message || "Failed to update hero section" }, { status: 500 })
  }
}
