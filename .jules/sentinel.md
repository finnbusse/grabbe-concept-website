## 2024-11-06 - Prevented Stack Trace Leak in Diagnostic API
**Vulnerability:** The `/api/diagnostic/route.ts` endpoint was returning the internal server error stack trace (`error.stack`) to the client when a global exception occurred.
**Learning:** Returning stack traces can inadvertently leak sensitive paths, package versions, and internal implementation details.
**Prevention:** Avoid returning `error.stack` in public or even authenticated APIs. Instead, log the detailed error server-side and only return a generic or safe `error.message` to the client.
