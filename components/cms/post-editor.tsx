"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface PostEditorProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    category: string | null
    published: boolean
    featured: boolean
    image_url: string | null
  }
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [content, setContent] = useState(post?.content ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [category, setCategory] = useState(post?.category ?? "aktuelles")
  const [published, setPublished] = useState(post?.published ?? false)
  const [featured, setFeatured] = useState(post?.featured ?? false)
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
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
        excerpt: excerpt || null,
        category,
        published,
        featured,
        image_url: imageUrl || null,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (post) {
        const { error: updateError } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", post.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("posts")
          .insert(payload)
        if (insertError) throw insertError
      }

      router.push("/cms/posts")
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
            <Link href="/cms/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {post ? "Beitrag bearbeiten" : "Neuer Beitrag"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPublished(!published)}
          >
            {published ? (
              <>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Veroeffentlicht
              </>
            ) : (
              <>
                <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                Entwurf
              </>
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
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Beitragstitel eingeben..."
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
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Kurztext (optional)</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kurze Zusammenfassung..."
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
              placeholder="Beitragsinhalt hier eingeben...

Sie koennen Absaetze mit Leerzeilen trennen."
              className="min-h-[400px] w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">
              Einstellungen
            </h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategorie</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="aktuelles">Aktuelles</option>
                  <option value="schulleben">Schulleben</option>
                  <option value="veranstaltungen">Veranstaltungen</option>
                  <option value="erfolge">Erfolge</option>
                  <option value="projekte">Projekte</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Bild-URL (optional)</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm text-card-foreground">Hervorgehobener Beitrag</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
