import test from "node:test"
import assert from "node:assert/strict"

import {
  canAccessUserPagePermissions,
  canAccessAnalytics,
  canAccessTeachers,
} from "./api-permissions.js"
import { getUsersRouteAuthorization } from "./users-route-rbac.js"

test("users route: non-admin still gets 403 on supported methods", () => {
  for (const method of ["GET", "POST", "DELETE"]) {
    const result = getUsersRouteAuthorization({
      method,
      isAuthenticated: true,
      roleSlugs: ["lehrer"],
    })
    assert.equal(result.allowed, false)
    assert.equal(result.status, 403)
  }
})

test("analytics route: teacher without diagnostic permission is denied", () => {
  assert.equal(
    canAccessAnalytics({ roleSlugs: ["lehrer"], permissions: { diagnostic: false } }),
    false
  )
})

test("teachers route: write requires organisation or admin-like role", () => {
  const permissions = {
    organisation: false,
    posts: { create: true, edit: false },
  }
  assert.equal(canAccessTeachers({ method: "POST", roleSlugs: ["lehrer"], permissions }), false)
  assert.equal(canAccessTeachers({ method: "DELETE", roleSlugs: ["administrator"], permissions }), true)
})

test("user-page-permissions read/write requires admin-like role", () => {
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["administrator"] }), true)
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["schulleitung"] }), true)
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["redakteur"] }), false)
})
