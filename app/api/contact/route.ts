import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Save message to database
    await query(
      "INSERT INTO messages (name, email, message, is_read, created_at) VALUES ($1, $2, $3, false, NOW())",
      [name, email, message]
    )

    // Optional: Send email notification
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD
    const toEmail = process.env.CONTACT_TO_EMAIL || user
    const fromEmail = process.env.CONTACT_FROM_EMAIL || user

    // Only send email if credentials are configured
    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
        })

        await transporter.sendMail({
          from: fromEmail,
          to: toEmail,
          replyTo: email,
          subject: `Portfolio Contact from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        })
      } catch (emailErr) {
        // Log email error but don't fail the request
        console.error("Failed to send email notification:", emailErr)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Contact form error:", err)
    return NextResponse.json({ error: err?.message || "Failed to send message" }, { status: 500 })
  }
}
