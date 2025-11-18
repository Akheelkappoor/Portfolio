import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminHomepageClient from "@/components/admin-homepage-client"

export const dynamic = "force-dynamic"

export default async function AdminHomepagePage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) redirect("/admin/login")
  return <AdminHomepageClient />
}
