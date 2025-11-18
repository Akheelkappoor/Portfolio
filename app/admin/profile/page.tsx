import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminProfileClient from "@/components/admin-profile-client"

export const dynamic = "force-dynamic"

export default async function AdminProfilePage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) redirect("/admin/login")
  return <AdminProfileClient />
}
