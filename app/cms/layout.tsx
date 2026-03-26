import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CmsShell } from "@/components/cms/cms-shell"
import { getUserPermissions, getUserRoleSlugs, getUserPagePermissions, EMPTY_PERMISSIONS } from "@/lib/permissions"
import type { UserPagePermission } from "@/lib/permissions"

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile (gracefully handle missing table or columns)
  let userProfile = null
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("first_name, last_name, title, avatar_url")
      .eq("user_id", user.id)
      .single()
    if (!error) {
      userProfile = data
    } else if (error.message?.includes("avatar_url")) {
      // avatar_url column doesn't exist yet - query without it
      const { data: fallbackData } = await supabase
        .from("user_profiles")
        .select("first_name, last_name, title")
        .eq("user_id", user.id)
        .single()
      if (fallbackData) {
        userProfile = { ...fallbackData, avatar_url: null }
      }
    }
  } catch {
    // Table may not exist yet
  }

  // Fetch RBAC data (gracefully handle missing tables)
  let permissions = EMPTY_PERMISSIONS
  let roleSlugs: string[] = []
  let pagePermissions: UserPagePermission[] = []
  try {
    const [p, rs, pp] = await Promise.all([
      getUserPermissions(user.id),
      getUserRoleSlugs(user.id),
      getUserPagePermissions(user.id),
    ])
    permissions = p
    roleSlugs = rs
    pagePermissions = pp
  } catch {
    // RBAC setup is missing/broken: fail closed (no implicit full access)
    permissions = EMPTY_PERMISSIONS
    roleSlugs = []
    pagePermissions = []
  }

  return (
    <CmsShell
      userEmail={user.email ?? ""}
      userProfile={userProfile}
      permissions={permissions}
      roleSlugs={roleSlugs}
      pagePermissions={pagePermissions}
    >
      {children}
    </CmsShell>
  )
}
