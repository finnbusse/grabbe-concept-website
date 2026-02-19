import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CmsShell } from "@/components/cms/cms-shell"

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

  return (
    <CmsShell userEmail={user.email ?? ""} userProfile={userProfile}>
      {children}
    </CmsShell>
  )
}
