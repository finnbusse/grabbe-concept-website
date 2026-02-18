import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client with service role privileges for admin operations.
 * Must only be used in server-side API routes, never in client-side code.
 */
export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ""

  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL in your environment variables."
    )
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY in your environment variables."
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
