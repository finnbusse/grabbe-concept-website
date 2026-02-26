"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2, Trash2, Lock } from "lucide-react"
import { TagSelector } from "@/components/cms/tag-selector"
import { ImagePicker } from "@/components/cms/image-picker"
import { SeoPreview } from "@/components/cms/seo-preview"
import { PublishCelebration } from "@/components/cms/publish-celebration"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageSettingsData {
  id: string
  title: string
  slug: string
  route: string
  heroImageUrl: string
  heroSubtitle: string
  metaDescription: string
  seoTitle: string
  seoOgImage: string
  published: boolean
  createdAt: string | null
  updatedAt: string | null
  tagIds: string[]
}

interface PageSettingsFormProps {
  page: PageSettingsData
  isStatic: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PageSettingsForm({ page, isStatic }: PageSettingsFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "allgemein"
  const [title, setTitle] = useState(page.title)
  const [heroImageUrl, setHeroImageUrl] = useState(page.heroImageUrl)
  const [heroSubtitle, setHeroSubtitle] = useState(page.heroSubtitle)
  const [metaDescription, setMetaDescription] = useState(page.metaDescription)
  const [seoTitle, setSeoTitle] = useState(page.seoTitle)
  const [seoOgImage, setSeoOgImage] = useState(page.seoOgImage)
  const [published, setPublished] = useState(page.published)
  const [tagIds, setTagIds] = useState<string[]>(page.tagIds)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const wasPublished = page.published

  // Fetch global SEO settings for the preview
  const [seoSeparator, setSeoSeparator] = useState(" / ")
  const [seoSuffix, setSeoSuffix] = useState("Grabbe-Gymnasium")
  useEffect(() => {
    async function loadSeoSettings() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["seo_title_separator", "seo_title_suffix"])
        if (data) {
          for (const row of data as Array<{ key: string; value: string }>) {
            if (row.key === "seo_title_separator" && row.value) setSeoSeparator(row.value)
            if (row.key === "seo_title_suffix" && row.value) setSeoSuffix(row.value)
          }
        }
      } catch { /* use defaults */ }
    }
    loadSeoSettings()
  }, [])

  const handleTabChange = (value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)
    window.history.replaceState({}, "", url.toString())
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      if (isStatic) {
        // For static pages, save hero image via page-content API
        const res = await fetch("/api/page-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: page.id === "homepage" ? "homepage-hero" : page.id,
            content: { hero_image: heroImageUrl },
          }),
        })
        if (!res.ok) throw new Error("Speichern fehlgeschlagen")
      } else {
        // For custom pages, update the pages table
        const supabase = createClient()
        const payload: Record<string, unknown> = {
          title,
          hero_image_url: heroImageUrl || null,
          hero_subtitle: heroSubtitle || null,
          meta_description: metaDescription || null,
          seo_og_image: seoOgImage || null,
          published,
          updated_at: new Date().toISOString(),
        }
        const { error: err } = await supabase.from("pages").update(payload as never).eq("id", page.id)
        if (err) {
          // Retry without hero_image_url/hero_subtitle if columns don't exist
          const errMsg = (err as { message?: string }).message || ""
          if (errMsg.includes("hero_image_url") || errMsg.includes("hero_subtitle")) {
            const { hero_image_url: _a, hero_subtitle: _b, ...payloadWithout } = payload
            const { error: err2 } = await supabase.from("pages").update(payloadWithout as never).eq("id", page.id)
            if (err2) throw err2
          } else {
            throw err
          }
        }
      }

      // Revalidate
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: page.route }),
      }).catch(() => {})

      setSuccess(true)
      // Show celebration when publishing for the first time
      if (!wasPublished && published && !isStatic) {
        setShowCelebration(true)
      }
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (isStatic) return
    if (!confirm("Seite wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) return
    setDeleting(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from("pages").delete().eq("id", page.id)
      if (err) throw err
      router.push("/cms/seiten")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen")
      setDeleting(false)
    }
  }

  // Compute values for SEO preview
  const previewTitle = seoTitle || title || page.title
  const previewDesc = metaDescription || "Beschreibung der Seite"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cms/seiten"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">Einstellungen</h1>
            <p className="text-sm text-muted-foreground">{page.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/cms/seiten/${page.id}/bearbeiten`}>
              Bearbeiten
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            {saving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Einstellungen gespeichert!
        </div>
      )}

      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList>
          <TabsTrigger value="allgemein">Allgemein</TabsTrigger>
          <TabsTrigger value="inhalt">Inhalt</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          {!isStatic && <TabsTrigger value="gefahr" className="text-destructive data-[state=active]:text-destructive">Gefährliche Zone</TabsTrigger>}
        </TabsList>

        {/* ==================== ALLGEMEIN TAB ==================== */}
        <TabsContent value="allgemein" className="space-y-8">
          <div className="max-w-2xl space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Seitentitel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Seitentitel"
                className="font-display text-lg"
                disabled={isStatic}
              />
              {isStatic && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Titel geschützter Seiten kann nicht geändert werden
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>URL / Pfad</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                <span className="text-sm font-mono text-muted-foreground">{page.route}</span>
              </div>
              {!isStatic && (
                <p className="text-xs text-muted-foreground">Pfad kann in der Seitenstruktur geändert werden</p>
              )}
            </div>

            {/* Status */}
            {!isStatic && (
              <>
                <div className="border-b border-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pub">Veröffentlicht</Label>
                    <p className="text-xs text-muted-foreground">Seite ist für Besucher sichtbar</p>
                  </div>
                  <Switch id="pub" checked={published} onCheckedChange={setPublished} />
                </div>
              </>
            )}

            {/* Tags */}
            <div className="border-b border-border" />
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tags</h3>
              <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />
            </div>

            {/* Timestamps */}
            {(page.createdAt || page.updatedAt) && (
              <>
                <div className="border-b border-border" />
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Zeitstempel</h3>
                  {page.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Erstellt am: {new Date(page.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                  {page.updatedAt && (
                    <p className="text-xs text-muted-foreground">
                      Zuletzt bearbeitet: {new Date(page.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* ==================== INHALT TAB ==================== */}
        <TabsContent value="inhalt" className="space-y-8">
          <div className="max-w-2xl space-y-6">
            {/* Hero Subtitle */}
            {!isStatic && (
              <div className="grid gap-2">
                <Label htmlFor="heroSubtitle">Hero-Untertitel (optional)</Label>
                <Input
                  id="heroSubtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Beschreibender Text unter dem Seitentitel"
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Wird als beschreibender Text unter dem Seitentitel angezeigt</p>
                  {heroSubtitle && (
                    <span className={`text-xs ${heroSubtitle.length > 180 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {heroSubtitle.length}/200
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Hero Image */}
            <div className="border-b border-border" />
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hero-Bild</h3>
              <ImagePicker
                value={heroImageUrl || null}
                onChange={(url) => setHeroImageUrl(url || "")}
                aspectRatio="16/9"
              />
            </div>
          </div>
        </TabsContent>

        {/* ==================== SEO TAB ==================== */}
        <TabsContent value="seo" className="space-y-8">
          <div className="max-w-2xl space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="seoTitle">SEO-Titel (optional)</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${title || "Seitentitel"}${seoSeparator}${seoSuffix}`}
              />
              <p className="text-xs text-muted-foreground">
                Wird automatisch ergänzt um &quot;{seoSeparator}{seoSuffix}&quot;
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metaDesc">Meta-Beschreibung</Label>
              <textarea
                id="metaDesc"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Kurze Beschreibung für Suchmaschinen (max. 160 Zeichen)"
                maxLength={320}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <span className={`text-xs ${metaDescription.length > 160 ? "text-amber-600" : "text-muted-foreground"}`}>
                {metaDescription.length}/160 Zeichen
              </span>
            </div>

            {/* Google preview */}
            <div className="border-b border-border" />
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Google-Vorschau</h3>
              <SeoPreview
                title={previewTitle}
                description={previewDesc}
                url={page.route}
                titleSeparator={seoSeparator}
                titleSuffix={seoSuffix}
              />
            </div>

            <div className="border-b border-border" />
            <div className="grid gap-2">
              <Label>Social-Media Bild</Label>
              <ImagePicker
                value={seoOgImage || null}
                onChange={(url) => setSeoOgImage(url || "")}
                aspectRatio="16/9"
              />
            </div>
          </div>
        </TabsContent>

        {/* ==================== GEFÄHRLICHE ZONE TAB ==================== */}
        {!isStatic && (
          <TabsContent value="gefahr" className="space-y-8">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-destructive border-b border-destructive/30 pb-2">
                Seite löschen
              </h3>
              <p className="text-sm text-muted-foreground">
                Das Löschen einer Seite kann nicht rückgängig gemacht werden. Alle Inhalte gehen verloren.
              </p>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
                Seite löschen
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Publish Celebration */}
      {showCelebration && (
        <PublishCelebration
          title={title}
          url={page.route}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  )
}
