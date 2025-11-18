import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminMessagesClient from "@/components/admin-messages-client"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) redirect("/admin/login")
  return <AdminMessagesClient />
}
