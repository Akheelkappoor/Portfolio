import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  const secure = process.env.NODE_ENV === "production"
  res.cookies.set("admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  })
  return res
}
