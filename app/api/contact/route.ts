import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { query } from "@/lib/db"
import { decrypt } from "@/lib/encryption"

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

    // Try to get email settings from database first
    let emailConfig = null
    try {
      const result = await query("SELECT * FROM email_settings ORDER BY id LIMIT 1")
      if (result.rows.length > 0 && result.rows[0].email_enabled) {
        const settings = result.rows[0]
        emailConfig = {
          host: settings.smtp_host,
          port: settings.smtp_port,
          user: settings.smtp_user,
          password: settings.smtp_password_encrypted ? decrypt(settings.smtp_password_encrypted) : '',
          from: settings.from_email,
          to: settings.to_email,
        }
      }
    } catch (dbErr) {
      console.error("Failed to fetch email settings from database:", dbErr)
    }

    // Fall back to environment variables if database config not available
    if (!emailConfig) {
      const user = process.env.GMAIL_USER
      const pass = process.env.GMAIL_APP_PASSWORD
      if (user && pass) {
        emailConfig = {
          host: 'smtp.gmail.com',
          port: 587,
          user,
          password: pass,
          from: process.env.CONTACT_FROM_EMAIL || user,
          to: process.env.CONTACT_TO_EMAIL || user,
        }
      }
    }

    // Send email if configuration exists
    if (emailConfig && emailConfig.user && emailConfig.password) {
      try {
        const transporter = nodemailer.createTransport({
          host: emailConfig.host,
          port: emailConfig.port,
          secure: false, // true for 465, false for other ports
          auth: {
            user: emailConfig.user,
            pass: emailConfig.password,
          },
        })

        await transporter.sendMail({
          from: emailConfig.from,
          to: emailConfig.to,
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
