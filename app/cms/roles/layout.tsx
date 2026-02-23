import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserPermissions, requirePermission } from "@/lib/permissions"

export default async function RolesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  const permissions = await getUserPermissions(user.id)
  await requirePermission(permissions, "roles")
  return <>{children}</>
}
