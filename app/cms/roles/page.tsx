"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, Plus, Trash2, Pencil, X, Save, Loader2 } from "lucide-react"
import { EMPTY_PERMISSIONS } from "@/lib/permissions"
import type { CmsPermissions, CmsRole } from "@/lib/permissions"

const PERMISSION_LABELS: Array<{ key: string; label: string; section: string }> = [
  { key: "posts.create", label: "Beiträge erstellen", section: "Inhalte" },
  { key: "posts.edit", label: "Beiträge bearbeiten (alle)", section: "Inhalte" },
  { key: "posts.editOwn", label: "Eigene Beiträge bearbeiten", section: "Inhalte" },
  { key: "posts.delete", label: "Beiträge löschen (alle)", section: "Inhalte" },
  { key: "posts.deleteOwn", label: "Eigene Beiträge löschen", section: "Inhalte" },
  { key: "posts.publish", label: "Beiträge veröffentlichen", section: "Inhalte" },
  { key: "events.create", label: "Termine erstellen", section: "Inhalte" },
  { key: "events.edit", label: "Termine bearbeiten (alle)", section: "Inhalte" },
  { key: "events.editOwn", label: "Eigene Termine bearbeiten", section: "Inhalte" },
  { key: "events.delete", label: "Termine löschen (alle)", section: "Inhalte" },
  { key: "events.deleteOwn", label: "Eigene Termine löschen", section: "Inhalte" },
  { key: "events.publish", label: "Termine veröffentlichen", section: "Inhalte" },
  { key: "pages.edit", label: "Seiten bearbeiten", section: "Inhalte" },
  { key: "documents.upload", label: "Dokumente hochladen", section: "Inhalte" },
  { key: "documents.delete", label: "Dokumente löschen (alle)", section: "Inhalte" },
  { key: "documents.deleteOwn", label: "Eigene Dokumente löschen", section: "Inhalte" },
  { key: "tags", label: "Tags verwalten", section: "Inhalte" },
  { key: "seitenEditor", label: "Seiten-Editor", section: "CMS-Bereiche" },
  { key: "navigation", label: "Navigation", section: "CMS-Bereiche" },
  { key: "seitenstruktur", label: "Seitenstruktur", section: "CMS-Bereiche" },
  { key: "settings.basic", label: "Einstellungen (Basis)", section: "CMS-Bereiche" },
  { key: "settings.advanced", label: "Einstellungen (Erweitert)", section: "CMS-Bereiche" },
  { key: "settings.seo", label: "Einstellungen (SEO)", section: "CMS-Bereiche" },
  { key: "messages", label: "Nachrichten", section: "Eingänge" },
  { key: "anmeldungen", label: "Anmeldungen", section: "Eingänge" },
  { key: "users.view", label: "Benutzer anzeigen", section: "Verwaltung" },
  { key: "users.create", label: "Benutzer erstellen", section: "Verwaltung" },
  { key: "users.delete", label: "Benutzer löschen", section: "Verwaltung" },
  { key: "users.assignRoles", label: "Rollen zuweisen", section: "Verwaltung" },
  { key: "diagnostic", label: "Diagnose", section: "Verwaltung" },
  { key: "roles.view", label: "Rollen anzeigen", section: "Verwaltung" },
  { key: "roles.create", label: "Rollen erstellen", section: "Verwaltung" },
  { key: "roles.edit", label: "Rollen bearbeiten", section: "Verwaltung" },
  { key: "roles.delete", label: "Rollen löschen", section: "Verwaltung" },
]

function getPermValue(perms: CmsPermissions, key: string): boolean {
  if (key === "posts.editOwn") return perms.posts.edit === "own" || perms.posts.edit === "all"
  if (key === "posts.deleteOwn") return perms.posts.delete === "own" || perms.posts.delete === "all"
  if (key === "events.editOwn") return perms.events.edit === "own" || perms.events.edit === "all"
  if (key === "events.deleteOwn") return perms.events.delete === "own" || perms.events.delete === "all"
  if (key === "documents.deleteOwn") return perms.documents.delete === "own" || perms.documents.delete === "all"

  const parts = key.split(".")
  if (parts.length === 1) {
    return (perms as unknown as Record<string, unknown>)[key] === true
  }
  const parent = (perms as unknown as Record<string, unknown>)[parts[0]]
  if (typeof parent === "object" && parent !== null) {
    const val = (parent as Record<string, unknown>)[parts[1]]
    return val === true || val === "all"
  }
  return false
}

function setPermValue(perms: CmsPermissions, key: string, value: boolean): CmsPermissions {
  const copy = JSON.parse(JSON.stringify(perms)) as CmsPermissions

  if (key === "posts.edit") { copy.posts.edit = value ? "all" : false; return copy }
  if (key === "posts.editOwn") { copy.posts.edit = value ? (copy.posts.edit === "all" ? "all" : "own") : false; return copy }
  if (key === "posts.delete") { copy.posts.delete = value ? "all" : false; return copy }
  if (key === "posts.deleteOwn") { copy.posts.delete = value ? (copy.posts.delete === "all" ? "all" : "own") : false; return copy }
  if (key === "events.edit") { copy.events.edit = value ? "all" : false; return copy }
  if (key === "events.editOwn") { copy.events.edit = value ? (copy.events.edit === "all" ? "all" : "own") : false; return copy }
  if (key === "events.delete") { copy.events.delete = value ? "all" : false; return copy }
  if (key === "events.deleteOwn") { copy.events.delete = value ? (copy.events.delete === "all" ? "all" : "own") : false; return copy }
  if (key === "documents.delete") { copy.documents.delete = value ? "all" : false; return copy }
  if (key === "documents.deleteOwn") { copy.documents.delete = value ? (copy.documents.delete === "all" ? "all" : "own") : false; return copy }

  const parts = key.split(".")
  if (parts.length === 1) {
    ;(copy as unknown as Record<string, unknown>)[key] = value
  } else {
    const parent = (copy as unknown as Record<string, unknown>)[parts[0]]
    if (typeof parent === "object" && parent !== null) {
      ;(parent as Record<string, unknown>)[parts[1]] = value
    }
  }
  return copy
}

function PermissionsChecklist({ permissions, onChange, disabled }: { permissions: CmsPermissions; onChange: (p: CmsPermissions) => void; disabled?: boolean }) {
  const sections = [...new Set(PERMISSION_LABELS.map((p) => p.section))]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{section}</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {PERMISSION_LABELS.filter((p) => p.section === section).map((perm) => (
              <label key={perm.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={getPermValue(permissions, perm.key)}
                  onChange={(e) => onChange(setPermValue(permissions, perm.key, e.target.checked))}
                  disabled={disabled}
                  className="rounded border-border"
                />
                {perm.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RolesPage() {
  const [roles, setRoles] = useState<CmsRole[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formPermissions, setFormPermissions] = useState<CmsPermissions>({ ...EMPTY_PERMISSIONS })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/roles")
      if (res.ok) {
        const data = await res.json()
        setRoles(data.roles || [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRoles() }, [loadRoles])

  function startCreate() {
    setEditingId(null)
    setFormName("")
    setFormSlug("")
    setFormPermissions({ ...EMPTY_PERMISSIONS })
    setShowForm(true)
  }

  function startEdit(role: CmsRole) {
    setEditingId(role.id)
    setFormName(role.name)
    setFormSlug(role.slug)
    setFormPermissions(role.permissions)
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId
        ? { id: editingId, name: formName, permissions: formPermissions }
        : { name: formName, slug: formSlug, permissions: formPermissions }

      const res = await fetch("/api/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Fehler")
      setMessage(editingId ? "Rolle aktualisiert." : "Rolle erstellt.")
      setShowForm(false)
      loadRoles()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Fehler")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Rolle wirklich löschen?")) return
    setDeletingId(id)
    setMessage("")
    try {
      const res = await fetch("/api/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Fehler")
      setMessage("Rolle gelöscht.")
      loadRoles()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Fehler")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Rollenverwaltung</h1>
          <p className="text-sm text-muted-foreground">System- und benutzerdefinierte Rollen verwalten</p>
        </div>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Neue Rolle
        </Button>
      </div>

      {message && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">{message}</div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Rolle bearbeiten" : "Neue Rolle erstellen"}</CardTitle>
            <CardDescription>Berechtigungen für die Rolle festlegen.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="roleName">Name</Label>
                  <Input id="roleName" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="z.B. Redakteur" required />
                </div>
                {!editingId && (
                  <div className="grid gap-2">
                    <Label htmlFor="roleSlug">Slug (eindeutig)</Label>
                    <Input id="roleSlug" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="z.B. redakteur" required />
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="mb-3 text-sm font-semibold">Berechtigungen</p>
                <PermissionsChecklist permissions={formPermissions} onChange={setFormPermissions} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  <X className="mr-1 h-3.5 w-3.5" />Abbrechen
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1 h-3.5 w-3.5" />}
                  Speichern
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-3">
          {roles.map((role) => (
            <div key={role.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{role.name}</span>
                      {role.is_system && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">System</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Slug: {role.slug}</p>
                  </div>
                </div>
                {!role.is_system && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(role)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={deletingId === role.id}
                      onClick={() => handleDelete(role.id)}
                    >
                      {deletingId === role.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Keine Rollen vorhanden.</p>
          )}
        </div>
      )}
    </div>
  )
}
