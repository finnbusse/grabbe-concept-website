import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CmsSidebar } from "@/components/cms/cms-sidebar"

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-svh">
      <CmsSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto bg-muted">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
