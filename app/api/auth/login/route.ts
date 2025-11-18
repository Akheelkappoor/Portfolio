import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { password } = await request.json()
  if (!password) return NextResponse.json({ error: "Missing password" }, { status: 400 })
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminPass) {
    return NextResponse.json(
      { error: "Admin not configured. Add ADMIN_PASSWORD in Vars to enable login." },
      { status: 500 },
    )
  }
  if (password !== adminPass) return NextResponse.json({ error: "Invalid password" }, { status: 401 })

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
}
