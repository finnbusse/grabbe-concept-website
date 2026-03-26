import test from "node:test"
import assert from "node:assert/strict"

import {
  canManageUserProfile,
  canAccessTeachers,
  canAccessAnalytics,
  canAccessUserPagePermissions,
} from "./api-permissions.js"

test("user profile: owner can update own profile", () => {
  assert.equal(
    canManageUserProfile({
      currentUserId: "u1",
      targetUserId: "u1",
      roleSlugs: [],
      permissions: {},
    }),
    true
  )
})

test("user profile: non-owner without elevated permissions is denied", () => {
  assert.equal(
    canManageUserProfile({
      currentUserId: "u1",
      targetUserId: "u2",
      roleSlugs: ["editor"],
      permissions: { users: { create: false, delete: false, assignRoles: false } },
    }),
    false
  )
})

test("teachers: GET allowed for content editors, writes denied without organisation", () => {
  const permissions = {
    organisation: false,
    posts: { create: true, edit: false },
    events: { create: false, edit: false },
    parent_letters: { create: false, edit: false },
    presentations: { create: false, edit: false },
  }
  assert.equal(canAccessTeachers({ method: "GET", roleSlugs: [], permissions }), true)
  assert.equal(canAccessTeachers({ method: "POST", roleSlugs: [], permissions }), false)
})

test("analytics: diagnostic permission grants access", () => {
  assert.equal(
    canAccessAnalytics({
      roleSlugs: ["editor"],
      permissions: { diagnostic: true },
    }),
    true
  )
})

test("user page permissions: only admin-like roles allowed", () => {
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["administrator"] }), true)
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["schulleitung"] }), true)
  assert.equal(canAccessUserPagePermissions({ roleSlugs: ["lehrer"] }), false)
})
