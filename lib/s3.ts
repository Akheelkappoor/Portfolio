import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const region = process.env.AWS_REGION

export const s3 = new S3Client({
  region,
  // Prefer EC2 instance role in production; fallback to env vars for local
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      : undefined,
})

export async function uploadToS3(opts: {
  bucket: string
  key: string
  body: ArrayBuffer | Uint8Array
  contentType?: string
  cacheControl?: string
}) {
  const cmd = new PutObjectCommand({
    Bucket: opts.bucket,
    Key: opts.key,
    Body: opts.body,
    ContentType: opts.contentType || "application/octet-stream",
    CacheControl: opts.cacheControl || "public, max-age=31536000, immutable",
    // ACL removed - bucket policy handles public access
  })
  await s3.send(cmd)
}

export async function deleteFromS3(bucket: string, key: string) {
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key })
  await s3.send(cmd)
}

export function publicS3Url(key: string) {
  const base = process.env.S3_PUBLIC_BASE_URL
  if (base) return `${base.replace(/\/$/, "")}/${key}`
  const bucket = process.env.S3_BUCKET
  const region = process.env.AWS_REGION
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}
