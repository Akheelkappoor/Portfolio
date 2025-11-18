import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminProjectsClient from "@/components/admin-projects-client"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) redirect("/admin/login")
  return <AdminProjectsClient />
}
