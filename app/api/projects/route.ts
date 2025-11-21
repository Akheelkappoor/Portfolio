import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const PROJECTS_JSON_KEY = "projects/projects.json"

export async function GET() {
  try {
    // Read the single projects.json blob (if it exists)
    // const { blobs } = await list({ prefix: PROJECTS_JSON_KEY })
    // if (blobs.length === 0) {
    //   return NextResponse.json([], { status: 200 })
    // }

    // const url = blobs[0].url
    // const res = await fetch(url, { cache: "no-store" })
    // if (!res.ok) {
    //   return NextResponse.json([], { status: 200 })
    // }

    // const json = await res.json()
    // return NextResponse.json(Array.isArray(json) ? json : [], { status: 200 })

    const { rows } = await query(`
      SELECT
        id, title, meta, badge,
        COALESCE(stack, '[]')   AS stack,
        COALESCE(category, '[]') AS category,
        COALESCE(challenge, '[]') AS challenge,
        COALESCE(solution, '[]')  AS solution,
        COALESCE(impact, '[]')    AS impact,
        image_url AS "imageUrl",
        pdf_url AS "pdfUrl",
        github_url AS "githubUrl",
        live_url AS "liveUrl"
      FROM projects
      ORDER BY display_order ASC, created_at DESC
    `)
    // Ensure arrays are arrays (jsonb in PG comes as objects already parsed)
    const projects = rows.map((r: any) => ({
      ...r,
      stack: Array.isArray(r.stack) ? r.stack : [],
      category: Array.isArray(r.category) ? r.category : [],
      challenge: Array.isArray(r.challenge) ? r.challenge : [],
      solution: Array.isArray(r.solution) ? r.solution : [],
      impact: Array.isArray(r.impact) ? r.impact : [],
    }))
    return NextResponse.json(projects, { status: 200 })
  } catch (e: any) {
    console.log("[v0] public GET /api/projects failed:", e?.message)
    // Fail closed to empty list so the homepage never crashes
    return NextResponse.json([], { status: 200 })
  }
}
