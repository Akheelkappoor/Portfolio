import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Fetch public settings (no auth required)
export async function GET() {
  try {
    const result = await query("SELECT primary_color, secondary_color, site_title, site_description FROM site_settings ORDER BY id LIMIT 1")

    if (result.rows.length === 0) {
      // Return defaults if no settings found
      return NextResponse.json({
        primary_color: "#f59e0b",
        secondary_color: "#ea580c",
        site_title: "Portfolio",
        site_description: ""
      })
    }

    return NextResponse.json({
      primary_color: result.rows[0].primary_color || "#f59e0b",
      secondary_color: result.rows[0].secondary_color || "#ea580c",
      site_title: result.rows[0].site_title || "Portfolio",
      site_description: result.rows[0].site_description || ""
    })
  } catch (err: any) {
    console.error("Failed to fetch settings:", err)
    // Return defaults on error
    return NextResponse.json({
      primary_color: "#f59e0b",
      secondary_color: "#ea580c",
      site_title: "Portfolio",
      site_description: ""
    })
  }
}
