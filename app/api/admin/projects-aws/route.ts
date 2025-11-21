import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { uploadToS3, publicS3Url /*, deleteFromS3*/ } from "@/lib/s3"

async function isAuthed() {
  const store = await cookies()
  return store.get("admin")?.value === "1"
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { rows } = await query(`
      SELECT id, title, meta, badge,
             COALESCE(stack,'[]') AS stack,
             COALESCE(category,'[]') AS category,
             COALESCE(challenge,'[]') AS challenge,
             COALESCE(solution,'[]') AS solution,
             COALESCE(impact,'[]') AS impact,
             image_url AS "imageUrl",
             pdf_url AS "pdfUrl",
             github_url AS "githubUrl",
             live_url AS "liveUrl",
             display_order AS "displayOrder",
             created_at AS "createdAt",
             updated_at AS "updatedAt"
      FROM projects
      ORDER BY display_order ASC, created_at DESC
    `)
    return NextResponse.json(rows, { status: 200 })
  } catch (err: any) {
    console.error("[v0] GET /api/admin/projects-aws error:", err?.message)
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const ct = req.headers.get("content-type") || ""
    let title = "",
      meta = "",
      badge = ""
    let stack: string[] = [],
      category: string[] = [],
      challenge: string[] = [],
      solution: string[] = [],
      impact: string[] = []
    let githubUrl = "",
      liveUrl = "",
      imageUrl: string | null = null,
      pdfUrl: string | null = null
    let displayOrder = 0

    if (ct.includes("multipart/form-data")) {
      let form: FormData
      try {
        form = await req.formData()
      } catch (err: any) {
        console.error("[v0] FormData parse error:", err.message)
        return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 })
      }
      title = String(form.get("title") || "")
      meta = String(form.get("meta") || "")
      badge = String(form.get("badge") || "")
      stack = String(form.get("stack") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      category = String(form.get("category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      challenge = String(form.get("challenge") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      solution = String(form.get("solution") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      impact = String(form.get("impact") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      githubUrl = String(form.get("githubUrl") || "")
      liveUrl = String(form.get("liveUrl") || "")
      displayOrder = parseInt(String(form.get("displayOrder") || "0"), 10)

      // Handle image upload
      const file = form.get("image") as File | null
      if (file && file.size > 0) {
        const buf = new Uint8Array(await file.arrayBuffer())
        const ext = file.name.split(".").pop() || "png"
        const key = `projects/${crypto.randomUUID()}.${ext}`
        await uploadToS3({
          bucket: process.env.S3_BUCKET!,
          key,
          body: buf,
          contentType: file.type || "application/octet-stream",
        })
        imageUrl = publicS3Url(key)
      }

      // Handle PDF upload
      const pdfFile = form.get("pdf") as File | null
      if (pdfFile && pdfFile.size > 0) {
        const buf = new Uint8Array(await pdfFile.arrayBuffer())
        const ext = pdfFile.name.split(".").pop() || "pdf"
        const key = `projects/pdfs/${crypto.randomUUID()}.${ext}`
        await uploadToS3({
          bucket: process.env.S3_BUCKET!,
          key,
          body: buf,
          contentType: pdfFile.type || "application/pdf",
        })
        pdfUrl = publicS3Url(key)
      }
    } else {
      const body = await req.json()
      title = body.title || ""
      meta = body.meta || ""
      badge = body.badge || ""
      stack = Array.isArray(body.stack) ? body.stack : []
      category = Array.isArray(body.category) ? body.category : []
      challenge = Array.isArray(body.challenge) ? body.challenge : []
      solution = Array.isArray(body.solution) ? body.solution : []
      impact = Array.isArray(body.impact) ? body.impact : []
      githubUrl = body.githubUrl || ""
      liveUrl = body.liveUrl || ""
      imageUrl = body.imageUrl || null
      pdfUrl = body.pdfUrl || null
      displayOrder = body.displayOrder || 0
    }

    const id = crypto.randomUUID()
    const now = new Date()
    await query(
      `INSERT INTO projects (id, title, meta, badge, stack, category, challenge, solution, impact, image_url, pdf_url, github_url, live_url, display_order, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        id,
        title,
        meta,
        badge,
        JSON.stringify(stack),
        JSON.stringify(category),
        JSON.stringify(challenge),
        JSON.stringify(solution),
        JSON.stringify(impact),
        imageUrl,
        pdfUrl,
        githubUrl,
        liveUrl,
        displayOrder,
        now,
        now,
      ],
    )
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (err: any) {
    console.error("[v0] POST /api/admin/projects-aws error:", err?.message)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const ct = req.headers.get("content-type") || ""
    let id = ""
    let title = "",
      meta = "",
      badge = ""
    let stack: string[] | undefined = undefined
    let category: string[] | undefined = undefined
    let challenge: string[] | undefined = undefined
    let solution: string[] | undefined = undefined
    let impact: string[] | undefined = undefined
    let githubUrl: string | undefined = undefined
    let liveUrl: string | undefined = undefined
    let imageUrl: string | null | undefined = undefined
    let pdfUrl: string | null | undefined = undefined
    let displayOrder: number | undefined = undefined

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData()
      id = String(form.get("id") || "")
      title = String(form.get("title") || "")
      meta = String(form.get("meta") || "")
      badge = String(form.get("badge") || "")
      stack = String(form.get("stack") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      category = String(form.get("category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      challenge = String(form.get("challenge") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      solution = String(form.get("solution") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      impact = String(form.get("impact") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      githubUrl = String(form.get("githubUrl") || "")
      liveUrl = String(form.get("liveUrl") || "")
      if (form.has("displayOrder")) {
        displayOrder = parseInt(String(form.get("displayOrder") || "0"), 10)
      }

      // Handle image upload
      const file = form.get("image") as File | null
      if (file && file.size > 0) {
        const buf = new Uint8Array(await file.arrayBuffer())
        const ext = file.name.split(".").pop() || "png"
        const key = `projects/${crypto.randomUUID()}.${ext}`
        await uploadToS3({
          bucket: process.env.S3_BUCKET!,
          key,
          body: buf,
          contentType: file.type || "application/octet-stream",
        })
        imageUrl = publicS3Url(key)
      } else {
        imageUrl = undefined
      }

      // Handle PDF upload/removal
      const shouldRemovePdf = form.get("removePdf") === "true"
      const pdfFile = form.get("pdf") as File | null

      if (shouldRemovePdf && (!pdfFile || pdfFile.size === 0)) {
        // Remove PDF: no new file uploaded and removal requested
        pdfUrl = null
      } else if (pdfFile && pdfFile.size > 0) {
        // Upload new PDF (replaces old one if exists)
        const buf = new Uint8Array(await pdfFile.arrayBuffer())
        const ext = pdfFile.name.split(".").pop() || "pdf"
        const key = `projects/pdfs/${crypto.randomUUID()}.${ext}`
        await uploadToS3({
          bucket: process.env.S3_BUCKET!,
          key,
          body: buf,
          contentType: pdfFile.type || "application/pdf",
        })
        pdfUrl = publicS3Url(key)
      } else {
        // No change to PDF
        pdfUrl = undefined
      }
    } else {
      const body = await req.json()
      id = body.id
      title = body.title || ""
      meta = body.meta || ""
      badge = body.badge || ""
      if ("stack" in body) stack = Array.isArray(body.stack) ? body.stack : []
      if ("category" in body) category = Array.isArray(body.category) ? body.category : []
      if ("challenge" in body) challenge = Array.isArray(body.challenge) ? body.challenge : []
      if ("solution" in body) solution = Array.isArray(body.solution) ? body.solution : []
      if ("impact" in body) impact = Array.isArray(body.impact) ? body.impact : []
      if ("githubUrl" in body) githubUrl = body.githubUrl || ""
      if ("liveUrl" in body) liveUrl = body.liveUrl || ""
      if ("imageUrl" in body) imageUrl = body.imageUrl
      if ("pdfUrl" in body) pdfUrl = body.pdfUrl
      if ("displayOrder" in body) displayOrder = body.displayOrder
    }

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const fields: string[] = ["title = $2", "meta = $3", "badge = $4"]
    const values: any[] = [id, title, meta, badge]
    let i = 5
    if (stack !== undefined) {
      fields.push(`stack = $${i++}`)
      values.push(JSON.stringify(stack))
    }
    if (category !== undefined) {
      fields.push(`category = $${i++}`)
      values.push(JSON.stringify(category))
    }
    if (challenge !== undefined) {
      fields.push(`challenge = $${i++}`)
      values.push(JSON.stringify(challenge))
    }
    if (solution !== undefined) {
      fields.push(`solution = $${i++}`)
      values.push(JSON.stringify(solution))
    }
    if (impact !== undefined) {
      fields.push(`impact = $${i++}`)
      values.push(JSON.stringify(impact))
    }
    if (githubUrl !== undefined) {
      fields.push(`github_url = $${i++}`)
      values.push(githubUrl)
    }
    if (liveUrl !== undefined) {
      fields.push(`live_url = $${i++}`)
      values.push(liveUrl)
    }
    if (imageUrl !== undefined) {
      fields.push(`image_url = $${i++}`)
      values.push(imageUrl)
    }
    if (pdfUrl !== undefined) {
      fields.push(`pdf_url = $${i++}`)
      values.push(pdfUrl)
    }
    if (displayOrder !== undefined) {
      fields.push(`display_order = $${i++}`)
      values.push(displayOrder)
    }
    fields.push(`updated_at = $${i}`)
    values.push(new Date())

    await query(`UPDATE projects SET ${fields.join(", ")} WHERE id = $1`, values)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    console.error("[v0] PUT /api/admin/projects-aws error:", err?.message)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    // Optional: also delete S3 object by deriving key from image_url
    // const { rows } = await query(`SELECT image_url FROM projects WHERE id = $1`, [id])
    // const imageUrl = rows[0]?.image_url as string | undefined
    // if (imageUrl) {
    //   const key = new URL(imageUrl).pathname.slice(1)
    //   await deleteFromS3(process.env.S3_BUCKET!, key)
    // }

    await query(`DELETE FROM projects WHERE id = $1`, [id])
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    console.error("[v0] DELETE /api/admin/projects-aws error:", err?.message)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
