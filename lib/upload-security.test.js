import test from "node:test"
import assert from "node:assert/strict"

import {
  ALLOWED_UPLOAD_MIME_TYPES,
  normalizeFilename,
  sanitizeUploadFilename,
  isAllowedBlobUrl,
} from "./upload-security.js"

test("sanitizeUploadFilename removes path traversal and keeps extension", () => {
  const result = sanitizeUploadFilename("../evil/..\\payload.png")
  assert.match(result, /^[a-z0-9_-]+-[a-f0-9]{8}\.png$/)
  assert.equal(result.includes(".."), false)
  assert.equal(result.includes("/"), false)
  assert.equal(result.includes("\\"), false)
})

test("allowed mime list includes common safe media types", () => {
  assert.equal(ALLOWED_UPLOAD_MIME_TYPES.has("image/png"), true)
  assert.equal(ALLOWED_UPLOAD_MIME_TYPES.has("application/x-msdownload"), false)
})

test("normalizeFilename strips unsafe path segments deterministically", () => {
  assert.equal(normalizeFilename("../A B C!!.pdf"), "a-b-c.pdf")
})

test("blob delete URL must be in /schulwebsite/ namespace", () => {
  assert.equal(
    isAllowedBlobUrl("https://abc123.public.blob.vercel-storage.com/schulwebsite/test.png"),
    true
  )
  assert.equal(isAllowedBlobUrl("https://example.com/schulwebsite/test.png"), false)
  assert.equal(isAllowedBlobUrl("https://example.com/private/test.png"), false)
  assert.equal(isAllowedBlobUrl("javascript:alert(1)"), false)
})
