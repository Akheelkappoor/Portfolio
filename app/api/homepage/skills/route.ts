import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch all skills with categories
export async function GET() {
  try {
    const result = await query(
      `SELECT
        sc.id, sc.title, sc.icon, sc.display_order,
        json_agg(
          json_build_object(
            'id', si.id,
            'skill_name', si.skill_name,
            'display_order', si.display_order
          ) ORDER BY si.display_order ASC
        ) as items
       FROM skills_categories sc
       LEFT JOIN skills_items si ON sc.id = si.category_id
       WHERE sc.is_visible = true
       GROUP BY sc.id
       ORDER BY sc.display_order ASC`
    )
    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("Failed to fetch skills:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch skills" }, { status: 500 })
  }
}

// POST - Create new skill category or item
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { type, title, icon, category_id, skill_name, display_order } = data

    if (type === "category") {
      const result = await query(
        `INSERT INTO skills_categories (title, icon, display_order, is_visible)
         VALUES ($1, $2, $3, true)
         RETURNING *`,
        [title, icon, display_order || 0]
      )
      return NextResponse.json(result.rows[0])
    } else if (type === "item") {
      const result = await query(
        `INSERT INTO skills_items (category_id, skill_name, display_order)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [category_id, skill_name, display_order || 0]
      )
      return NextResponse.json(result.rows[0])
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (err: any) {
    console.error("Failed to create skill:", err)
    return NextResponse.json({ error: err?.message || "Failed to create skill" }, { status: 500 })
  }
}

// PUT - Update skill category or item
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { type, id, title, icon, skill_name, display_order, is_visible } = data

    if (type === "category") {
      await query(
        `UPDATE skills_categories SET
          title = $1,
          icon = $2,
          display_order = $3,
          is_visible = $4,
          updated_at = NOW()
        WHERE id = $5`,
        [title, icon, display_order, is_visible, id]
      )
    } else if (type === "item") {
      await query(
        `UPDATE skills_items SET
          skill_name = $1,
          display_order = $2
        WHERE id = $3`,
        [skill_name, display_order, id]
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update skill:", err)
    return NextResponse.json({ error: err?.message || "Failed to update skill" }, { status: 500 })
  }
}

// DELETE - Delete skill category or item
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!id || !type) {
      return NextResponse.json({ error: "ID and type are required" }, { status: 400 })
    }

    if (type === "category") {
      await query("DELETE FROM skills_categories WHERE id = $1", [id])
    } else if (type === "item") {
      await query("DELETE FROM skills_items WHERE id = $1", [id])
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to delete skill:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete skill" }, { status: 500 })
  }
}
