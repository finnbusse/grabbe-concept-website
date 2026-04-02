# Architecture Decision Record: Routing Strategy (Task 139, 248)

**Context:**
The CMS historically used a combination of custom Middleware Rewrites, Fallback Slugs, and hardcoded `KNOWN_ROUTES`.

**Decision:**
- **Removal of Slug-only Fallbacks:** As implemented in Welle 1, `app/seiten/[...slug]/page.tsx` now enforces a strict mapping of `route_path` + `slug`. This guarantees URLs map cleanly to database entries without causing duplicate canonical pages.
- **Dynamic Registry:** The `KNOWN_ROUTES` list in the Next.js `middleware.ts` is now dynamically constructed from `SYSTEM_ROUTES` in `lib/page-content/registry.ts`, making it highly maintainable and reducing the risk of routing drift.
- **Explicit Redirects:** Legacy CMS paths (like `/cms/documents` -> `/cms/dateien`) are explicitly redirected with `301` status codes in the Middleware to ensure bookmark compatibility for administrators.

**Consequences:**
Authors *must* ensure their pages have valid `route_path` values in the database, matching the front-end folder structure. The fallback is no longer forgiving but predictable.
