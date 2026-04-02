# Architecture Decision Record: Caching & Revalidation (Tasks 194, 195)

**Context:**
The home page (`app/page.tsx`) currently uses `export const revalidate = 300` (5 minutes). Dynamic CMS pages (`app/seiten/[...slug]/page.tsx`, etc.) use `export const revalidate = 3600` (1 hour). The review asks to evaluate if this balances data volatility versus performance effectively.

**Decision:**
- **Home Page (`revalidate = 300`):** We keep this at 5 minutes (300s). The homepage aggregates highly volatile data like active campaigns, upcoming events, and the latest news articles. While `300s` is a short TTL, Next.js implements *stale-while-revalidate*. The cache returns instantly, and the 5-minute window ensures the hero/news section doesn't stay out of sync when editors make changes without triggering a manual revalidation via the webhook.
- **Dynamic Pages (`revalidate = 3600`):** We keep this at 1 hour (3600s). Standard text pages (e.g. Imprint, About Us, Classes) do not change frequently. 1 hour is a solid baseline. Furthermore, we already implemented a Webhook (`app/api/revalidate/route.ts`) which the CMS explicitly calls upon saving pages, purging the cache on-demand. Therefore, the 3600s cache will almost never be the bottleneck for editors seeing their changes, but it shields the database massively during traffic spikes.

**Status:** Documented and verified as appropriate.
