import { randomUUID } from "node:crypto"

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
  "text/plain",
])

export function normalizeFilename(inputName) {
  const raw = typeof inputName === "string" ? inputName : ""
  const base = raw.split(/[\\/]/).pop() || "upload"
  const cleaned = base.replace(/[\u0000-\u001F\u007F]/g, "")
  const trimmed = cleaned.trim()
  const normalized = trimmed.normalize("NFKC")

  const dotIndex = normalized.lastIndexOf(".")
  const stemRaw = dotIndex > 0 ? normalized.slice(0, dotIndex) : normalized
  const extRaw = dotIndex > 0 ? normalized.slice(dotIndex + 1) : ""

  const stem = stemRaw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "upload"

  const ext = extRaw
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12)

  return ext ? `${stem}.${ext}` : stem
}

export function sanitizeUploadFilename(inputName) {
  const normalized = normalizeFilename(inputName)
  const dotIndex = normalized.lastIndexOf(".")
  const stem = dotIndex > 0 ? normalized.slice(0, dotIndex) : normalized
  const ext = dotIndex > 0 ? normalized.slice(dotIndex + 1) : ""
  const suffix = randomUUID().slice(0, 8)
  return ext ? `${stem}-${suffix}.${ext}` : `${stem}-${suffix}`
}

export function isAllowedBlobUrl(urlValue) {
  if (typeof urlValue !== "string" || !urlValue) return false
  try {
    const parsed = new URL(urlValue)
    if (parsed.protocol !== "https:") return false
    if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) return false
    return parsed.pathname.startsWith("/schulwebsite/")
  } catch {
    return false
  }
}
