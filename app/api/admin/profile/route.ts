import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch profile
export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query("SELECT * FROM profile ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to fetch profile:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch profile" }, { status: 500 })
  }
}

// PUT - Update profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      name,
      title,
      email,
      phone,
      location,
      bio,
      linkedin_url,
      github_url,
      twitter_url,
      profile_image_url,
      resume_url,
    } = data

    await query(
      `UPDATE profile SET
        name = $1,
        title = $2,
        email = $3,
        phone = $4,
        location = $5,
        bio = $6,
        linkedin_url = $7,
        github_url = $8,
        twitter_url = $9,
        profile_image_url = $10,
        resume_url = $11,
        updated_at = NOW()
      WHERE id = (SELECT id FROM profile ORDER BY id LIMIT 1)`,
      [name, title, email, phone, location, bio, linkedin_url, github_url, twitter_url, profile_image_url, resume_url]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update profile:", err)
    return NextResponse.json({ error: err?.message || "Failed to update profile" }, { status: 500 })
  }
}
