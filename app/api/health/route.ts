import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { s3 } from "@/lib/s3"
import { ListObjectsV2Command } from "@aws-sdk/client-s3"

export async function GET() {
  const result: Record<string, string> = {}
  let status = 200

  // DB check
  try {
    await query("SELECT 1")
    result.db = "ok"
  } catch (e: any) {
    result.db = `error: ${e?.message || "unknown"}`
    status = 500
  }

  // S3 check
  try {
    const bucket = process.env.S3_BUCKET!
    await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 0 }))
    result.s3 = "ok"
  } catch (e: any) {
    result.s3 = `error: ${e?.message || "unknown"}`
    status = 500
  }

  return NextResponse.json(result, { status })
}
