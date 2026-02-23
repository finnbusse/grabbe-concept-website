/**
 * Role-Based Access Control (RBAC) — Permission helpers
 *
 * Provides server-side utilities for checking CMS permissions, fetching user
 * roles and page assignments, and protecting routes.
 */

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

// ============================================================================
// Permission Types
// ============================================================================

export interface ContentPermission {
  create: boolean
  edit: "own" | "all" | false
  delete: "own" | "all" | false
  publish: boolean
}

export interface DocumentPermission {
  upload: boolean
  delete: "own" | "all" | false
}

export interface SettingsPermission {
  basic: boolean
  advanced: boolean
  seo: boolean
}

export interface UserPermission {
  view: boolean
  create: boolean
  delete: boolean
  assignRoles: boolean
}

export interface RolePermission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export interface CmsPermissions {
  posts: ContentPermission
  events: ContentPermission
  pages: { edit: boolean }
  documents: DocumentPermission
  settings: SettingsPermission
  navigation: boolean
  seitenstruktur: boolean
  seitenEditor: boolean
  users: UserPermission
  tags: boolean
  messages: boolean
  anmeldungen: boolean
  diagnostic: boolean
  roles: RolePermission
}

export interface UserPagePermission {
  id: string
  user_id: string
  page_type: "editable" | "cms"
  page_id: string
}

export interface CmsRole {
  id: string
  name: string
  slug: string
  is_system: boolean
  permissions: CmsPermissions
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
}

// ============================================================================
// Default (empty) permissions — zero access
// ============================================================================

export const EMPTY_PERMISSIONS: CmsPermissions = {
  posts: { create: false, edit: false, delete: false, publish: false },
  events: { create: false, edit: false, delete: false, publish: false },
  pages: { edit: false },
  documents: { upload: false, delete: false },
  settings: { basic: false, advanced: false, seo: false },
  navigation: false,
  seitenstruktur: false,
  seitenEditor: false,
  users: { view: false, create: false, delete: false, assignRoles: false },
  tags: false,
  messages: false,
  anmeldungen: false,
  diagnostic: false,
  roles: { view: false, create: false, edit: false, delete: false },
}

// ============================================================================
// Merge two permission objects (OR logic: truest value wins)
// ============================================================================

function mergeEditDelete(a: "own" | "all" | false, b: "own" | "all" | false): "own" | "all" | false {
  if (a === "all" || b === "all") return "all"
  if (a === "own" || b === "own") return "own"
  return false
}

function mergeContentPermission(a: ContentPermission, b: ContentPermission): ContentPermission {
  return {
    create: a.create || b.create,
    edit: mergeEditDelete(a.edit, b.edit),
    delete: mergeEditDelete(a.delete, b.delete),
    publish: a.publish || b.publish,
  }
}

export function mergePermissions(a: CmsPermissions, b: CmsPermissions): CmsPermissions {
  return {
    posts: mergeContentPermission(a.posts, b.posts),
    events: mergeContentPermission(a.events, b.events),
    pages: { edit: a.pages.edit || b.pages.edit },
    documents: {
      upload: a.documents.upload || b.documents.upload,
      delete: mergeEditDelete(a.documents.delete, b.documents.delete),
    },
    settings: {
      basic: a.settings.basic || b.settings.basic,
      advanced: a.settings.advanced || b.settings.advanced,
      seo: a.settings.seo || b.settings.seo,
    },
    navigation: a.navigation || b.navigation,
    seitenstruktur: a.seitenstruktur || b.seitenstruktur,
    seitenEditor: a.seitenEditor || b.seitenEditor,
    users: {
      view: a.users.view || b.users.view,
      create: a.users.create || b.users.create,
      delete: a.users.delete || b.users.delete,
      assignRoles: a.users.assignRoles || b.users.assignRoles,
    },
    tags: a.tags || b.tags,
    messages: a.messages || b.messages,
    anmeldungen: a.anmeldungen || b.anmeldungen,
    diagnostic: a.diagnostic || b.diagnostic,
    roles: {
      view: a.roles.view || b.roles.view,
      create: a.roles.create || b.roles.create,
      edit: a.roles.edit || b.roles.edit,
      delete: a.roles.delete || b.roles.delete,
    },
  }
}

// ============================================================================
// Safely coerce a raw JSONB object into CmsPermissions
// ============================================================================

function coercePermissions(raw: unknown): CmsPermissions {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PERMISSIONS }
  const p = raw as Record<string, unknown>

  function bool(v: unknown): boolean {
    return v === true
  }
  function editDel(v: unknown): "own" | "all" | false {
    if (v === "all") return "all"
    if (v === "own") return "own"
    return false
  }
  function obj(v: unknown): Record<string, unknown> {
    return (v && typeof v === "object" ? v : {}) as Record<string, unknown>
  }

  const posts = obj(p.posts)
  const events = obj(p.events)
  const pages = obj(p.pages)
  const documents = obj(p.documents)
  const settings = obj(p.settings)
  const users = obj(p.users)
  const roles = obj(p.roles)

  return {
    posts: { create: bool(posts.create), edit: editDel(posts.edit), delete: editDel(posts.delete), publish: bool(posts.publish) },
    events: { create: bool(events.create), edit: editDel(events.edit), delete: editDel(events.delete), publish: bool(events.publish) },
    pages: { edit: bool(pages.edit) },
    documents: { upload: bool(documents.upload), delete: editDel(documents.delete) },
    settings: { basic: bool(settings.basic), advanced: bool(settings.advanced), seo: bool(settings.seo) },
    navigation: bool(p.navigation),
    seitenstruktur: bool(p.seitenstruktur),
    seitenEditor: bool(p.seitenEditor),
    users: { view: bool(users.view), create: bool(users.create), delete: bool(users.delete), assignRoles: bool(users.assignRoles) },
    tags: bool(p.tags),
    messages: bool(p.messages),
    anmeldungen: bool(p.anmeldungen),
    diagnostic: bool(p.diagnostic),
    roles: { view: bool(roles.view), create: bool(roles.create), edit: bool(roles.edit), delete: bool(roles.delete) },
  }
}

// ============================================================================
// Fetch user permissions (merges all assigned roles)
// ============================================================================

export async function getUserPermissions(userId: string): Promise<CmsPermissions> {
  const supabase = await createClient()

  // Fetch user role assignments + joined role data
  const { data: userRoles, error } = await supabase
    .from("user_roles")
    .select("role_id, cms_roles(permissions)")
    .eq("user_id", userId)

  if (error || !userRoles || userRoles.length === 0) {
    // No roles assigned — return empty permissions
    return { ...EMPTY_PERMISSIONS }
  }

  let merged = { ...EMPTY_PERMISSIONS }
  for (const ur of userRoles) {
    const roleData = ur.cms_roles as unknown as { permissions: unknown } | null
    if (roleData?.permissions) {
      merged = mergePermissions(merged, coercePermissions(roleData.permissions))
    }
  }

  return merged
}

// ============================================================================
// Fetch user's role slugs (for display purposes)
// ============================================================================

export async function getUserRoleSlugs(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("user_roles")
    .select("cms_roles(slug)")
    .eq("user_id", userId)

  if (!data) return []
  return data
    .map((r) => {
      const role = r.cms_roles as unknown as { slug: string } | null
      return role?.slug
    })
    .filter((s): s is string => !!s)
}

// ============================================================================
// Fetch user page permissions
// ============================================================================

export async function getUserPagePermissions(userId: string): Promise<UserPagePermission[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("user_page_permissions")
    .select("*")
    .eq("user_id", userId)

  if (error || !data) return []
  return data as UserPagePermission[]
}

// ============================================================================
// Route protection helper (server-side redirect)
// ============================================================================

type PermissionCheck =
  | "settings"
  | "settings.basic"
  | "settings.advanced"
  | "navigation"
  | "seitenstruktur"
  | "seitenEditor"
  | "users"
  | "users.view"
  | "tags"
  | "messages"
  | "anmeldungen"
  | "diagnostic"
  | "roles"
  | "roles.view"
  | "posts"
  | "posts.create"
  | "events"
  | "events.create"
  | "documents"
  | "documents.upload"

export function checkPermission(permissions: CmsPermissions, check: PermissionCheck): boolean {
  switch (check) {
    case "settings":
      return permissions.settings.basic || permissions.settings.advanced || permissions.settings.seo
    case "settings.basic":
      return permissions.settings.basic
    case "settings.advanced":
      return permissions.settings.advanced
    case "navigation":
      return permissions.navigation
    case "seitenstruktur":
      return permissions.seitenstruktur
    case "seitenEditor":
      return permissions.seitenEditor
    case "users":
    case "users.view":
      return permissions.users.view
    case "tags":
      return permissions.tags
    case "messages":
      return permissions.messages
    case "anmeldungen":
      return permissions.anmeldungen
    case "diagnostic":
      return permissions.diagnostic
    case "roles":
    case "roles.view":
      return permissions.roles.view
    case "posts":
      return permissions.posts.create || permissions.posts.edit !== false
    case "posts.create":
      return permissions.posts.create
    case "events":
      return permissions.events.create || permissions.events.edit !== false
    case "events.create":
      return permissions.events.create
    case "documents":
      return permissions.documents.upload || permissions.documents.delete !== false
    case "documents.upload":
      return permissions.documents.upload
    default:
      return false
  }
}

/**
 * Server-side permission guard. Redirects to /cms with error if denied.
 */
export async function requirePermission(permissions: CmsPermissions, check: PermissionCheck): Promise<void> {
  if (!checkPermission(permissions, check)) {
    redirect("/cms?error=no_access")
  }
}

// ============================================================================
// Check if user has a specific role slug
// ============================================================================

export function isAdmin(roleSlugs: string[]): boolean {
  return roleSlugs.includes("administrator")
}

export function isSchulleitung(roleSlugs: string[]): boolean {
  return roleSlugs.includes("schulleitung")
}

export function isAdminOrSchulleitung(roleSlugs: string[]): boolean {
  return isAdmin(roleSlugs) || isSchulleitung(roleSlugs)
}

// ============================================================================
// Fetch all roles (for admin UI)
// ============================================================================

export async function getAllRoles(): Promise<CmsRole[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cms_roles")
    .select("*")
    .order("is_system", { ascending: false })
    .order("name")

  if (error || !data) return []
  return data.map((r) => ({
    ...r,
    permissions: coercePermissions(r.permissions),
  })) as CmsRole[]
}

// ============================================================================
// Admin operations (use service role client)
// ============================================================================

export async function assignUserRole(userId: string, roleId: string): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin.from("user_roles").insert({ user_id: userId, role_id: roleId })
  if (error) return { error: error.message }
  return {}
}

export async function removeUserRole(userId: string, roleId: string): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin.from("user_roles").delete().eq("user_id", userId).eq("role_id", roleId)
  if (error) return { error: error.message }
  return {}
}

export async function setUserRoles(userId: string, roleIds: string[]): Promise<{ error?: string }> {
  const admin = createAdminClient()
  // Delete existing roles
  const { error: delError } = await admin.from("user_roles").delete().eq("user_id", userId)
  if (delError) return { error: delError.message }
  // Insert new roles
  if (roleIds.length > 0) {
    const rows = roleIds.map((role_id) => ({ user_id: userId, role_id }))
    const { error: insError } = await admin.from("user_roles").insert(rows)
    if (insError) return { error: insError.message }
  }
  return {}
}

export async function setUserPagePermissions(
  userId: string,
  pages: Array<{ page_type: "editable" | "cms"; page_id: string }>
): Promise<{ error?: string }> {
  const admin = createAdminClient()
  // Delete existing
  const { error: delError } = await admin.from("user_page_permissions").delete().eq("user_id", userId)
  if (delError) return { error: delError.message }
  // Insert new
  if (pages.length > 0) {
    const rows = pages.map((p) => ({ user_id: userId, ...p }))
    const { error: insError } = await admin.from("user_page_permissions").insert(rows)
    if (insError) return { error: insError.message }
  }
  return {}
}

// ============================================================================
// Custom role CRUD (admin only)
// ============================================================================

export async function createCustomRole(
  name: string,
  slug: string,
  permissions: CmsPermissions
): Promise<{ id?: string; error?: string }> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("cms_roles")
    .insert({ name, slug, is_system: false, permissions: permissions as unknown as Record<string, unknown> })
    .select("id")
    .single()
  if (error) return { error: error.message }
  return { id: data?.id }
}

export async function updateCustomRole(
  id: string,
  name: string,
  permissions: CmsPermissions
): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin
    .from("cms_roles")
    .update({ name, permissions: permissions as unknown as Record<string, unknown> })
    .eq("id", id)
    .eq("is_system", false) // prevent editing system roles
  if (error) return { error: error.message }
  return {}
}

export async function deleteCustomRole(id: string): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const { error } = await admin
    .from("cms_roles")
    .delete()
    .eq("id", id)
    .eq("is_system", false)
  if (error) return { error: error.message }
  return {}
}

// ============================================================================
// Export coercePermissions for use in API routes
// ============================================================================
export { coercePermissions }
