import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Check if setup is completed
export async function GET() {
  try {
    const result = await query("SELECT * FROM setup_status ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      return NextResponse.json({
        is_completed: false,
        current_step: 1
      })
    }

    return NextResponse.json(result.rows[0])
  } catch (err: any) {
    console.error("Failed to fetch setup status:", err)
    return NextResponse.json({ error: err?.message || "Failed to fetch setup status" }, { status: 500 })
  }
}

// POST - Complete setup wizard
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      // Step 1: Admin Password
      admin_password,
      admin_email,

      // Step 2: Personal Info
      name,
      title,
      bio,

      // Step 3: Contact Info
      email,
      phone,
      linkedin_url,
      github_url,
      twitter_url,
      location,

      // Step 4: Branding
      logo_text,
      footer_tagline,

      // Completion
      complete
    } = data

    // Start transaction
    const client = await query("BEGIN")

    try {
      // Step 1: Create admin credentials
      if (admin_password) {
        const hashedPassword = await bcrypt.hash(admin_password, 10)

        // Check if admin already exists
        const adminCheck = await query("SELECT COUNT(*) FROM admin_credentials")

        if (parseInt(adminCheck.rows[0].count) === 0) {
          await query(
            "INSERT INTO admin_credentials (username, password_hash, email) VALUES ($1, $2, $3)",
            ["admin", hashedPassword, admin_email || ""]
          )
        } else {
          await query(
            "UPDATE admin_credentials SET password_hash = $1, email = $2, updated_at = NOW() WHERE id = (SELECT id FROM admin_credentials ORDER BY id LIMIT 1)",
            [hashedPassword, admin_email || ""]
          )
        }
      }

      // Step 2: Update profile
      if (name && title) {
        await query(
          `UPDATE profile SET
            name = $1,
            title = $2,
            bio = $3,
            updated_at = NOW()
          WHERE id = (SELECT id FROM profile ORDER BY id LIMIT 1)`,
          [name, title, bio || ""]
        )
      }

      // Step 3: Update contact info
      if (email) {
        await query(
          `UPDATE contact_page_content SET
            email = $1,
            phone = $2,
            linkedin_url = $3,
            github_url = $4,
            twitter_url = $5,
            location = $6,
            updated_at = NOW()
          WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)`,
          [email, phone || "", linkedin_url || "", github_url || "", twitter_url || "", location || ""]
        )
      }

      // Step 4: Update branding
      if (logo_text) {
        await query(
          `UPDATE contact_page_content SET
            logo_text = $1,
            footer_tagline = $2,
            updated_at = NOW()
          WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)`,
          [logo_text, footer_tagline || ""]
        )
      }

      // Mark setup as complete
      if (complete) {
        await query(
          `UPDATE setup_status SET
            is_completed = true,
            completed_at = NOW(),
            updated_at = NOW()
          WHERE id = (SELECT id FROM setup_status ORDER BY id LIMIT 1)`
        )
      }

      await query("COMMIT")

      return NextResponse.json({ ok: true, message: "Setup completed successfully" })
    } catch (error) {
      await query("ROLLBACK")
      throw error
    }
  } catch (err: any) {
    console.error("Failed to complete setup:", err)
    return NextResponse.json({ error: err?.message || "Failed to complete setup" }, { status: 500 })
  }
}
