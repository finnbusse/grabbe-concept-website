export function hasPrivilegedUserManagementAccess({ roleSlugs, permissions }) {
  const isAdminLike = Array.isArray(roleSlugs) && (
    roleSlugs.includes("administrator") || roleSlugs.includes("schulleitung")
  )
  if (isAdminLike) return true

  return Boolean(
    permissions?.users?.create ||
    permissions?.users?.delete ||
    permissions?.users?.assignRoles
  )
}

export function canManageUserProfile({
  currentUserId,
  targetUserId,
  roleSlugs,
  permissions,
}) {
  if (!currentUserId || !targetUserId) return false
  if (currentUserId === targetUserId) return true
  return hasPrivilegedUserManagementAccess({ roleSlugs, permissions })
}

export function canAccessTeachers({ method, roleSlugs, permissions }) {
  const isAdminLike = Array.isArray(roleSlugs) && (
    roleSlugs.includes("administrator") || roleSlugs.includes("schulleitung")
  )
  if (isAdminLike) return true

  if (method === "GET") {
    return Boolean(
      permissions?.organisation ||
      permissions?.posts?.create ||
      permissions?.posts?.edit !== false ||
      permissions?.events?.create ||
      permissions?.events?.edit !== false ||
      permissions?.parent_letters?.create ||
      permissions?.parent_letters?.edit !== false ||
      permissions?.presentations?.create ||
      permissions?.presentations?.edit !== false
    )
  }

  return Boolean(permissions?.organisation)
}

export function canAccessAnalytics({ roleSlugs, permissions }) {
  const isAdminLike = Array.isArray(roleSlugs) && (
    roleSlugs.includes("administrator") || roleSlugs.includes("schulleitung")
  )
  return isAdminLike || Boolean(permissions?.diagnostic)
}

export function canAccessUserPagePermissions({ roleSlugs }) {
  const isAdminLike = Array.isArray(roleSlugs) && (
    roleSlugs.includes("administrator") || roleSlugs.includes("schulleitung")
  )
  return isAdminLike
}
