import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

// One-time initialization endpoint to populate homepage data
export async function POST() {
  try {
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin")?.value === "1"
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if hero_section already has data
    const existing = await query("SELECT COUNT(*) as count FROM hero_section")
    if (existing.rows[0].count > 0) {
      return NextResponse.json({ message: "Hero section already initialized" })
    }

    // Insert initial hero data
    await query(`
      INSERT INTO hero_section (
        badge_text, name, tagline, description,
        profile_image_url, resume_url,
        cta_primary_text, cta_primary_link,
        cta_secondary_text, cta_secondary_link,
        stat_1_value, stat_1_label,
        stat_2_value, stat_2_label,
        stat_3_value, stat_3_label,
        stat_4_value, stat_4_label,
        availability_status, availability_location
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      )
    `, [
      'Business Analyst',
      'Akheel',
      'Kappoor',
      'Business Analyst with 1+ year of experience delivering 80+ projects. Expert in requirements gathering, process optimization, and translating business needs into technical solutions using SQL, Python, Excel, Power BI, and Tableau. Reduced reporting time by 87% and saved companies hundreds of hours.',
      '/profile.jpg',
      '/resume.pdf',
      'View My Work',
      '#projects',
      'Get In Touch',
      '#contact',
      '80+',
      'Projects Delivered',
      '87%',
      'Time Saved',
      '40%',
      'Efficiency Improved',
      '1 Year',
      'Experience',
      'available',
      'Dubai, UAE'
    ])

    return NextResponse.json({ message: "Homepage initialized successfully!" })
  } catch (err: any) {
    console.error("Failed to initialize homepage:", err)
    return NextResponse.json({ error: err?.message || "Failed to initialize" }, { status: 500 })
  }
}
