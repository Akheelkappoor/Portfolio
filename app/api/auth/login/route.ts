import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { password } = await request.json()
  if (!password) return NextResponse.json({ error: "Missing password" }, { status: 400 })

  try {
    // Check database for admin credentials first
    const result = await query("SELECT * FROM admin_credentials ORDER BY id LIMIT 1")

    if (result.rows.length > 0) {
      // Database credentials exist - use them
      const admin = result.rows[0]
      const isValid = await bcrypt.compare(password, admin.password_hash)

      if (!isValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 })
      }
    } else {
      // Fallback to environment variable (for backward compatibility)
      const adminPass = process.env.ADMIN_PASSWORD
      if (!adminPass) {
        return NextResponse.json(
          { error: "Admin not configured. Please complete setup first." },
          { status: 500 },
        )
      }
      if (password !== adminPass) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 })
      }
    }

    const res = NextResponse.json({ ok: true })
    const secure = process.env.NODE_ENV === "production"
    res.cookies.set("admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
