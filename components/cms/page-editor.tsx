"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface PageEditorProps {
  page?: {
    id: string
    title: string
    slug: string
    content: string
    section: string | null
    sort_order: number
    published: boolean
  }
}

export function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(page?.title ?? "")
  const [slug, setSlug] = useState(page?.slug ?? "")
  const [content, setContent] = useState(page?.content ?? "")
  const [section, setSection] = useState(page?.section ?? "allgemein")
  const [sortOrder, setSortOrder] = useState(page?.sort_order ?? 0)
  const [published, setPublished] = useState(page?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!page) setSlug(generateSlug(value))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Nicht angemeldet")

      const payload = {
        title,
        slug,
        content,
        section,
        sort_order: sortOrder,
        published,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (page) {
        const { error: err } = await supabase.from("pages").update(payload).eq("id", page.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from("pages").insert(payload)
        if (err) throw err
      }

      router.push("/cms/pages")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cms/pages"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {page ? "Seite bearbeiten" : "Neue Seite"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPublished(!published)}>
            {published ? (
              <><Eye className="mr-1.5 h-3.5 w-3.5" />Aktiv</>
            ) : (
              <><EyeOff className="mr-1.5 h-3.5 w-3.5" />Entwurf</>
            )}
          </Button>
          <Button onClick={handleSave} disabled={saving || !title || !slug}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Seitentitel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Seitentitel eingeben..."
                  className="font-display text-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL-Pfad (Slug)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-pfad"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <Label htmlFor="content" className="mb-3 block">Inhalt</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Seiteninhalt hier eingeben..."
              className="min-h-[400px] w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">Einstellungen</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="section">Bereich</Label>
                <select
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="allgemein">Allgemein</option>
                  <option value="unsere-schule">Unsere Schule</option>
                  <option value="schulleben">Schulleben</option>
                  <option value="informationen">Informationen</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sort_order">Sortierung</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
