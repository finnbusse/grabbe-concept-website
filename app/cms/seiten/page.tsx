import { createClient } from "@/lib/supabase/server"
import { EDITABLE_PAGES } from "@/lib/page-content"
import { PageTree, type PageTreeItem } from "@/components/cms/page-tree"

export default async function SeitenPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, published, route_path, section")
    .order("sort_order", { ascending: true })

  // Build static page items from EDITABLE_PAGES (deduplicate by route)
  const seenRoutes = new Set<string>()
  const staticItems: PageTreeItem[] = []

  for (const ep of EDITABLE_PAGES) {
    // Group homepage sections under one "Startseite" entry
    if (ep.route === "/") {
      if (!seenRoutes.has("/")) {
        seenRoutes.add("/")
        staticItems.push({
          id: "homepage",
          title: "Startseite",
          route: "/",
          type: "static",
          published: true,
        })
      }
      continue
    }

    if (seenRoutes.has(ep.route)) continue
    seenRoutes.add(ep.route)

    staticItems.push({
      id: ep.id,
      title: ep.title,
      route: ep.route,
      type: "static",
      published: true,
    })
  }

  // Build custom page items from DB
  const customItems: PageTreeItem[] = ((pages as Array<{
    id: string
    title: string
    slug: string
    published: boolean
    route_path: string | null
    section: string | null
  }>) || []).map((p) => ({
    id: p.id,
    title: p.title,
    route: p.route_path ? `${p.route_path}/${p.slug}` : `/seiten/${p.slug}`,
    type: "custom" as const,
    published: p.published,
  }))

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Seiten</h1>
          <p className="mt-2 text-muted-foreground">
            Alle Seiten der Website verwalten – Inhalte bearbeiten, Einstellungen ändern und neue Seiten erstellen.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PageTree staticPages={staticItems} customPages={customItems} />
      </div>
    </div>
  )
}
