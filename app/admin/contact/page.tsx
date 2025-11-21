import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminContactClient from "@/components/admin-contact-client"

export default async function AdminContactPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"

  if (!isAdmin) {
    redirect("/admin/login")
  }

  return <AdminContactClient />
}
