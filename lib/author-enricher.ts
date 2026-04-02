import { createStaticClient } from "@/lib/supabase/static"

/**
 * Task 97: Extract a shared author profile enricher.
 * Tasks 98 & 99: Used by `app/page.tsx` and `app/aktuelles/page.tsx` to deduplicate
 * the lookup logic for post authors.
 */
export async function enrichPostsWithAuthors<T extends { user_id?: string | null; author_name?: string | null }>(
  posts: T[]
) {
  if (!posts || posts.length === 0) {
    return []
  }

  const supabase = createStaticClient()

  // Extract unique user IDs
  const userIds = [...new Set(posts.map((p) => p.user_id).filter(Boolean))] as string[]

  let authorProfiles: Record<string, {
    first_name?: string
    last_name?: string
    title?: string
    avatar_url?: string | null
  }> = {}

  if (userIds.length > 0) {
    // Attempt to fetch profiles including the avatar_url (which might not exist in early DB states)
    let { data: profiles, error } = await supabase
      .from("user_profiles")
      .select("user_id, first_name, last_name, title, avatar_url")
      .in("user_id", userIds)

    if (error && error.message?.includes("avatar_url")) {
      // Fallback if avatar_url is missing
      const fallback = await supabase
        .from("user_profiles")
        .select("user_id, first_name, last_name, title")
        .in("user_id", userIds)
      profiles = fallback.data
    }

    if (profiles) {
      authorProfiles = Object.fromEntries(
        profiles.map((p) => [p.user_id, p])
      )
    }
  }

  // Combine original post data with resolved profile information
  return posts.map((post) => {
    const profile = post.user_id ? authorProfiles[post.user_id] : null

    return {
      ...post,
      author_profile: profile ? {
        first_name: profile.first_name,
        last_name: profile.last_name,
        title: profile.title,
        avatar_url: profile.avatar_url,
      } : null,
    }
  })
}
