import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { put, list, del } from "@vercel/blob"
import crypto from "crypto"

const PROJECTS_JSON_KEY = "projects/projects.json"

type Project = {
  id: string
  title: string
  meta: string
  badge?: string
  stack: string[]
  category?: string[]
  challenge?: string[]
  solution?: string[]
  impact?: string[]
  imageUrl?: string | null
}

const SEED_PROJECTS = [
  {
    title: "Automated Invoice Management System",
    meta: "EdTech Company (NDA) • 2 months",
    badge: "Solo Project",
    challenge: [
      "Payment delays (15–30 days) impacting cash flow",
      "Manual Excel tracking consuming 5+ hours weekly",
      "Lack of visibility into invoice status",
    ],
    solution: [
      "Built dual invoice tracking in Google Sheets",
      "Live status updates (Paid/Pending/Overdue)",
      "Automated email reminders for overdue payments",
      "Payment analytics dashboard",
    ],
    impact: ["40% reduction in payment delays", "5+ hours saved weekly", "Eliminated tracking errors"],
    stack: ["Google Sheets", "Apps Script", "Excel", "Email Automation", "Visualization"],
    category: ["automation", "dashboard"],
  },
  {
    title: "Student Dropout Analysis",
    meta: "EdTech Company (NDA) • Ongoing",
    badge: "Strategic Analysis",
    challenge: ["Analyze 200+ student/teacher records", "Identify enrollment patterns and market positioning"],
    solution: [
      "Dropout pattern identification across 10+ courses",
      "Market trend and competitor benchmarking",
      "SWOT & PESTEL for strategic positioning",
    ],
    impact: ["3 key dropout triggers identified", "Insights informed marketing & course priorities"],
    stack: ["Excel", "SQL", "Tableau", "SWOT/PESTEL", "Market Research"],
    category: ["analysis"],
  },
  {
    title: "Real-Time Finance Dashboard",
    meta: "Distribution Company (NDA) • 3 months",
    badge: "Best Performer Q4 2024",
    challenge: ["6+ hours weekly on manual reports", "Data pulled from multiple sources manually"],
    solution: [
      "Live dynamic dashboard in Excel",
      "Automated data export and self-updating KPIs",
      "Error-checking and reconciliation",
    ],
    impact: ["25% reduction in reporting time", "40% faster reconciliation", "99%+ data accuracy"],
    stack: ["Excel Advanced", "Power Query", "Pivot Tables"],
    category: ["dashboard", "automation"],
  },
]

async function readProjects(): Promise<Project[]> {
  try {
    const { blobs } = await list({ prefix: PROJECTS_JSON_KEY })
    if (blobs.length === 0) return []
    const url = blobs[0].url
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return []
    return (await res.json()) as Project[]
  } catch (e) {
    console.log("[v0] readProjects failed:", (e as any)?.message)
    return []
  }
}

async function writeProjects(data: Project[]) {
  await put(PROJECTS_JSON_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
}

async function isAdmin() {
  const store = await cookies()
  return store.get("admin")?.value === "1"
}

export async function GET() {
  try {
    const projects = await readProjects()
    if (projects.length === 0) {
      const seeded = SEED_PROJECTS.map((p) => ({
        id: crypto.randomUUID(),
        imageUrl: null,
        ...p,
      }))
      await writeProjects(seeded)
      return NextResponse.json(seeded, { headers: { "x-seeded": "1" } })
    }
    return NextResponse.json(projects)
  } catch (err) {
    console.log("[v0] GET /api/admin/projects error:", (err as any)?.message)
    return NextResponse.json([], { headers: { "x-warning": "blob-list-failed" } })
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData()
      const title = String(form.get("title") || "").trim()
      const meta = String(form.get("meta") || "").trim()
      const badge = String(form.get("badge") || "").trim() || undefined
      const stack = String(form.get("stack") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const category = String(form.get("category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const challenge =
        String(form.get("challenge") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean) || []
      const solution =
        String(form.get("solution") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean) || []
      const impact =
        String(form.get("impact") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean) || []

      const image = form.get("image") as File | null
      let imageUrl: string | null = null
      if (image && image.size > 0) {
        try {
          const key = `projects/images/${Date.now()}-${image.name}`
          const uploaded = await put(key, image, {
            access: "public",
            contentType: image.type,
            addRandomSuffix: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          })
          imageUrl = uploaded.url
        } catch (e) {
          console.log("[v0] blob put failed:", (e as any)?.message)
          return NextResponse.json(
            { error: "File upload failed. Ensure BLOB_READ_WRITE_TOKEN is set in Vars." },
            { status: 500 },
          )
        }
      }

      if (!title || !meta) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

      const projects = await readProjects()
      const id = crypto.randomUUID()
      const project: Project = { id, title, meta, badge, stack, category, challenge, solution, impact, imageUrl }
      projects.unshift(project)
      try {
        await put(PROJECTS_JSON_KEY, JSON.stringify(projects, null, 2), {
          access: "public",
          contentType: "application/json",
          allowOverwrite: true,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
      } catch (e) {
        console.log("[v0] write projects.json failed:", (e as any)?.message)
        return NextResponse.json(
          { error: "Saving failed. Ensure BLOB_READ_WRITE_TOKEN is set in Vars." },
          { status: 500 },
        )
      }
      return NextResponse.json(project)
    } catch (err: any) {
      console.log("[v0] POST parse failed:", err?.message)
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }
  }
  return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const contentType = request.headers.get("content-type") || ""
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
  }
  const form = await request.formData()
  const id = String(form.get("id") || "")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const projects = await readProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const prev = projects[idx]
  const title = (form.get("title") as string) || prev.title
  const meta = (form.get("meta") as string) || prev.meta
  const badge = ((form.get("badge") as string) || prev.badge || "").trim() || undefined
  const stack =
    ((form.get("stack") as string) || prev.stack.join(","))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || prev.stack
  const category =
    ((form.get("category") as string) || (prev.category || []).join(","))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || prev.category
  const challenge =
    ((form.get("challenge") as string) || (prev.challenge || []).join("\n"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean) || prev.challenge
  const solution =
    ((form.get("solution") as string) || (prev.solution || []).join("\n"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean) || prev.solution
  const impact =
    ((form.get("impact") as string) || (prev.impact || []).join("\n"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean) || prev.impact

  let imageUrl = prev.imageUrl || null
  const image = form.get("image") as File | null
  if (image && image.size > 0) {
    try {
      const key = `projects/images/${Date.now()}-${image.name}`
      const uploaded = await put(key, image, {
        access: "public",
        contentType: image.type,
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      imageUrl = uploaded.url
    } catch (e) {
      console.log("[v0] blob put failed (PUT):", (e as any)?.message)
      return NextResponse.json(
        { error: "File upload failed. Ensure BLOB_READ_WRITE_TOKEN is set in Vars." },
        { status: 500 },
      )
    }
  }

  const updated: Project = { ...prev, title, meta, badge, stack, category, challenge, solution, impact, imageUrl }
  projects[idx] = updated
  try {
    await put(PROJECTS_JSON_KEY, JSON.stringify(projects, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (e) {
    console.log("[v0] write projects.json failed (PUT):", (e as any)?.message)
    return NextResponse.json({ error: "Saving failed. Configure Blob." }, { status: 500 })
  }
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const projects = await readProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const proj = projects[idx]
  if (proj.imageUrl) {
    try {
      const url = new URL(proj.imageUrl)
      const key = url.pathname.slice(1)
      await del(key)
    } catch (e) {
      console.log("[v0] blob delete failed:", (e as any)?.message)
      // ignore; deleting image is optional
    }
  }

  projects.splice(idx, 1)
  try {
    await put(PROJECTS_JSON_KEY, JSON.stringify(projects, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (e) {
    console.log("[v0] write projects.json failed (DELETE):", (e as any)?.message)
    return NextResponse.json({ error: "Saving failed. Configure Blob." }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
