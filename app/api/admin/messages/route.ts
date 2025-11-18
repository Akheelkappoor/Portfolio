import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// GET - Fetch all messages
export async function GET() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      "SELECT id, name, email, message, is_read, created_at FROM messages ORDER BY created_at DESC"
    )

    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("Failed to fetch messages:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch messages" }, { status: 500 })
  }
}

// PUT - Update message (mark as read/unread)
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, is_read } = await request.json()
    if (!id || typeof is_read !== "boolean") {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
    }

    await query("UPDATE messages SET is_read = $1 WHERE id = $2", [is_read, id])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to update message:", err)
    return NextResponse.json({ error: err?.message || "Failed to update message" }, { status: 500 })
  }
}

// DELETE - Delete message
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
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 })
    }

    await query("DELETE FROM messages WHERE id = $1", [id])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Failed to delete message:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete message" }, { status: 500 })
  }
}
