export function getUsersRouteAuthorization({
  method,
  isAuthenticated,
  roleSlugs,
}) {
  if (!isAuthenticated) {
    return { allowed: false, status: 401, error: "Nicht angemeldet" }
  }

  const allowedMethods = new Set(["GET", "POST", "DELETE"])
  if (!allowedMethods.has(method)) {
    return { allowed: false, status: 405, error: "Methode nicht erlaubt" }
  }

  const isAdministrator = Array.isArray(roleSlugs) && roleSlugs.includes("administrator")
  if (!isAdministrator) {
    return { allowed: false, status: 403, error: "Keine Berechtigung" }
  }

  return { allowed: true, status: 200 }
}
