import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch all work experiences
export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM work_experience WHERE is_visible = true ORDER BY display_order ASC, created_at DESC"
    )
    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("Failed to fetch work experiences:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch work experiences" }, { status: 500 })
  }
}

// POST - Create new work experience
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { title, company, location, period, achievements, display_order } = data

    const result = await query(
      `INSERT INTO work_experience (title, company, location, period, achievements, display_order, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [title, company, location, period, achievements, display_order || 0]
    )

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to create work experience:", err)
    return NextResponse.json({ error: err?.message || "Failed to create work experience" }, { status: 500 })
  }
}

// PUT - Update work experience
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { id, title, company, location, period, achievements, display_order, is_visible } = data

    await query(
      `UPDATE work_experience SET
        title = $1,
        company = $2,
        location = $3,
        period = $4,
        achievements = $5,
        display_order = $6,
        is_visible = $7,
        updated_at = NOW()
      WHERE id = $8`,
      [title, company, location, period, achievements, display_order, is_visible, id]
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update work experience:", err)
    return NextResponse.json({ error: err?.message || "Failed to update work experience" }, { status: 500 })
  }
}

// DELETE - Delete work experience
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await query("DELETE FROM work_experience WHERE id = $1", [id])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to delete work experience:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete work experience" }, { status: 500 })
  }
}
