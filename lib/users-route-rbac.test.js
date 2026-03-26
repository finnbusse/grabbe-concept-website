import test from "node:test"
import assert from "node:assert/strict"

import { getUsersRouteAuthorization } from "./users-route-rbac.js"

const METHODS = ["GET", "POST", "DELETE"]

test("returns 401 for unauthenticated users on all supported methods", () => {
  for (const method of METHODS) {
    const result = getUsersRouteAuthorization({
      method,
      isAuthenticated: false,
      roleSlugs: [],
    })

    assert.equal(result.allowed, false)
    assert.equal(result.status, 401)
    assert.equal(result.error, "Nicht angemeldet")
  }
})

test("returns 403 for authenticated non-admin users on all supported methods", () => {
  for (const method of METHODS) {
    const result = getUsersRouteAuthorization({
      method,
      isAuthenticated: true,
      roleSlugs: ["editor"],
    })

    assert.equal(result.allowed, false)
    assert.equal(result.status, 403)
    assert.equal(result.error, "Keine Berechtigung")
  }
})

test("allows administrators on all supported methods", () => {
  for (const method of METHODS) {
    const result = getUsersRouteAuthorization({
      method,
      isAuthenticated: true,
      roleSlugs: ["administrator"],
    })

    assert.equal(result.allowed, true)
    assert.equal(result.status, 200)
  }
})

test("rejects unsupported methods", () => {
  const result = getUsersRouteAuthorization({
    method: "PATCH",
    isAuthenticated: true,
    roleSlugs: ["administrator"],
  })

  assert.equal(result.allowed, false)
  assert.equal(result.status, 405)
  assert.equal(result.error, "Methode nicht erlaubt")
})
