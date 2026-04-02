# Deployment Guide: Grabbe-Gymnasium CMS

This guide outlines the complete process to deploy the Grabbe-Gymnasium Homepage and CMS to production, including setting up the database, configuring secrets, and enforcing security policies.

## 1. Prerequisites

- **Node.js**: v22+
- **Package Manager**: `pnpm`
- **Hosting**: Vercel (recommended)
- **Database**: Supabase (PostgreSQL)
- **Blob Storage**: Vercel Blob

## 2. Environment Variables

Before deploying, ensure all required environment variables are set in your deployment platform (e.g., Vercel Project Settings). **Do not commit secrets to Git.**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The canonical URL of the production site (e.g., `https://grabbe.site`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **public** anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **secret** service role key (Never expose to client!) |
| `INVITATION_SECRET` | A secure, long, random string used to hash invitation tokens. |
| `IP_HASH_SALT` | A secure, long, random string used to anonymize IPs in the rate limiter. |
| `BLOB_READ_WRITE_TOKEN` | Generated automatically by Vercel when linking a Blob store. |

*(Note: The CMS will fail-closed and block logins/uploads if `IP_HASH_SALT` or `INVITATION_SECRET` are missing!)*

## 3. Database Setup (Supabase)

### A. Initial Bootstrap
If you are setting up a fresh project:

1. Open the **SQL Editor** in your Supabase Dashboard.
2. Copy the entire contents of `scripts/complete_schema.sql`.
3. Run the script. This will provision all tables, indexes, and strict Row Level Security (RLS) policies.

### B. Incremental Migrations
If you already have a running database, apply migration files manually in chronological order (or use the Supabase CLI).

## 4. Initial CMS Admin Setup

Since the API is protected by Role-Based Access Control (RBAC), you cannot simply log in and manage users without an initial Administrator account.

1. **Create an Auth User:** In the Supabase Dashboard, go to **Authentication** -> **Users** -> **Add User**. Create a user (e.g., `admin@grabbe.site`).
2. **Assign Administrator Role:**
   - Go to the **Table Editor** -> `cms_roles`.
   - Find the ID of the `administrator` role.
   - Go to the `user_roles` table and insert a new row connecting your user's UUID with the `administrator` role UUID.
3. **Create a Profile:** Add a row to `user_profiles` for your user UUID.

## 5. Security & Pre-Flight Checks

Before going live, complete the **Security Hardening Checklist** located at `.jules/security_hardening_checklist.md`. This ensures:
- Admin fallbacks are removed.
- Rate Limiting is active.
- Mediathek/Blob storage paths are secure.

## 6. Vercel Deployment

1. Connect your repository (`finnbusse/grabbe-concept-website`) to Vercel.
2. Ensure the Framework Preset is set to **Next.js**.
3. Verify the Build Command is `pnpm run build` (this includes strict TypeScript checking).
4. Verify the Install Command is `pnpm install`.
5. Link a **Vercel Blob** store in the Storage tab to automatically generate the `BLOB_READ_WRITE_TOKEN`.
6. Deploy!

## 7. Troubleshooting

- **Build Fails with TypeScript Errors:** The build is intentionally strict. Run `pnpm run typecheck` locally to find and fix type mismatches.
- **Cannot Login / Rate Limit Error:** If you get immediate rate-limit errors on a fresh deploy, ensure `IP_HASH_SALT` is set. The system fails closed.
- **Images not uploading:** Verify `BLOB_READ_WRITE_TOKEN` is present in the specific environment (Production/Preview).
