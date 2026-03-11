/**
 * Buffer API Client Library
 *
 * Provides a type-safe interface to the Buffer GraphQL API.
 * Used for social media publishing from the CMS.
 *
 * @see https://developers.buffer.com/guides/getting-started.html
 */

// ============================================================================
// Types
// ============================================================================

export interface BufferOrganization {
  id: string
  name: string
  ownerEmail: string
}

export interface BufferChannel {
  id: string
  name: string
  displayName: string
  service: string
  avatar: string
  isQueuePaused: boolean
  organizationId?: string
}

export interface BufferCreatePostParams {
  text: string
  channelId: string
  imageUrl?: string
  dueAt?: string
}

export interface BufferPostResult {
  success: boolean
  message?: string
  post?: {
    id: string
    text: string
  }
}

export interface BufferAccountInfo {
  organizations: BufferOrganization[]
}

// ============================================================================
// Constants
// ============================================================================

const BUFFER_GRAPHQL_ENDPOINT = "https://api.buffer.com"

/** Default timeout for external Buffer API calls (in ms) */
const API_TIMEOUT_MS = 15_000

// ============================================================================
// Internal helpers
// ============================================================================

/**
 * Execute a GraphQL query/mutation against Buffer's API.
 * Uses Bearer token authentication and enforces a timeout.
 */
async function bufferGraphQL<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(BUFFER_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Buffer API HTTP ${res.status}: ${body}`)
    }

    const json = await res.json() as { data?: T; errors?: Array<{ message: string }> }

    if (json.errors && json.errors.length > 0) {
      throw new Error(`Buffer GraphQL Fehler: ${json.errors.map((e) => e.message).join(", ")}`)
    }

    if (!json.data) {
      throw new Error("Buffer API: Keine Daten in der Antwort.")
    }

    return json.data
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`Buffer API Timeout: Keine Antwort innerhalb von ${API_TIMEOUT_MS / 1000}s.`)
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// ============================================================================
// GraphQL Queries
// ============================================================================

const GET_ORGANIZATIONS_QUERY = `
  query GetOrganizations {
    account {
      organizations {
        id
        name
        ownerEmail
      }
    }
  }
`

const GET_CHANNELS_QUERY = `
  query GetChannels($organizationId: String!) {
    channels(input: { organizationId: $organizationId }) {
      id
      name
      displayName
      service
      avatar
      isQueuePaused
    }
  }
`

const CREATE_POST_MUTATION = `
  mutation CreatePost($text: String!, $channelId: String!, $dueAt: String, $imageUrl: String) {
    createPost(input: {
      text: $text
      channelId: $channelId
      schedulingType: automatic
      mode: customSchedule
      dueAt: $dueAt
      assets: {
        images: [{
          url: $imageUrl
        }]
      }
    }) {
      ... on PostActionSuccess {
        post {
          id
          text
        }
      }
      ... on MutationError {
        message
      }
    }
  }
`

const CREATE_POST_TEXT_ONLY_MUTATION = `
  mutation CreateTextPost($text: String!, $channelId: String!, $dueAt: String) {
    createPost(input: {
      text: $text
      channelId: $channelId
      schedulingType: automatic
      mode: customSchedule
      dueAt: $dueAt
    }) {
      ... on PostActionSuccess {
        post {
          id
          text
        }
      }
      ... on MutationError {
        message
      }
    }
  }
`

// ============================================================================
// API Functions
// ============================================================================

/**
 * Validate a Buffer access token by fetching the account's organizations.
 * Returns account info on success, throws on failure (invalid/expired token).
 */
export async function validateBufferToken(accessToken: string): Promise<BufferAccountInfo> {
  const data = await bufferGraphQL<{ account: { organizations: BufferOrganization[] } }>(
    accessToken,
    GET_ORGANIZATIONS_QUERY,
  )

  if (!data.account?.organizations) {
    throw new Error("Ungültiger Token: Keine Kontodaten erhalten.")
  }

  return { organizations: data.account.organizations }
}

/**
 * Fetch all connected channels (social media profiles) across all organizations.
 */
export async function getBufferChannels(accessToken: string): Promise<BufferChannel[]> {
  // Step 1: Get all organizations
  const accountData = await bufferGraphQL<{ account: { organizations: BufferOrganization[] } }>(
    accessToken,
    GET_ORGANIZATIONS_QUERY,
  )

  const orgs = accountData.account?.organizations ?? []
  if (orgs.length === 0) {
    return []
  }

  // Step 2: Get channels for each organization
  const allChannels: BufferChannel[] = []
  for (const org of orgs) {
    const channelData = await bufferGraphQL<{ channels: BufferChannel[] }>(
      accessToken,
      GET_CHANNELS_QUERY,
      { organizationId: org.id },
    )
    const channels = (channelData.channels ?? []).map((ch) => ({
      ...ch,
      organizationId: org.id,
    }))
    allChannels.push(...channels)
  }

  return allChannels
}

/**
 * Create a new post via Buffer's GraphQL API.
 * Posts are created per channel (one at a time).
 */
export async function createBufferPost(
  accessToken: string,
  params: BufferCreatePostParams
): Promise<BufferPostResult> {
  const variables: Record<string, unknown> = {
    text: params.text,
    channelId: params.channelId,
    dueAt: params.dueAt || new Date().toISOString(),
  }

  const hasImage = params.imageUrl && params.imageUrl.trim().length > 0
  let mutation: string

  if (hasImage) {
    variables.imageUrl = params.imageUrl
    mutation = CREATE_POST_MUTATION
  } else {
    mutation = CREATE_POST_TEXT_ONLY_MUTATION
  }

  const data = await bufferGraphQL<{
    createPost: {
      post?: { id: string; text: string }
      message?: string
    }
  }>(accessToken, mutation, variables)

  if (data.createPost.message) {
    // MutationError
    return { success: false, message: data.createPost.message }
  }

  return {
    success: true,
    post: data.createPost.post ?? undefined,
  }
}

// ============================================================================
// Helpers
// ============================================================================

/** Map Buffer service names to human-readable display names */
export function getServiceDisplayName(service: string): string {
  const map: Record<string, string> = {
    facebook: "Facebook",
    twitter: "X (Twitter)",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    threads: "Threads",
    pinterest: "Pinterest",
    googlebusiness: "Google Business",
    mastodon: "Mastodon",
    tiktok: "TikTok",
    youtube: "YouTube",
    shopify: "Shopify",
    bluesky: "Bluesky",
  }
  return map[service.toLowerCase()] ?? service
}

/** Mask an API token for display (show only last 4 characters) */
export function maskToken(token: string): string {
  if (token.length <= 4) return "••••"
  return "••••••••" + token.slice(-4)
}
