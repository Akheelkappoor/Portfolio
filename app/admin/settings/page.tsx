import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminSettingsClient from "@/components/admin-settings-client"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) redirect("/admin/login")
  return <AdminSettingsClient />
}
