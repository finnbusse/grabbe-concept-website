# Database Quick Reference

Quick reference guide for common database operations in the School CMS.

## 📋 Table of Contents

- [Connection](#connection)
- [Common Queries](#common-queries)
- [CRUD Operations](#crud-operations)
- [RLS Policies](#rls-policies)
- [Useful SQL Snippets](#useful-sql-snippets)

## 🔌 Connection

### Server-Side (Server Components, API Routes)

```typescript
import { createClient } from '@/lib/supabase/server'

export async function MyServerComponent() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('posts')
    .select('*')
  
  // ...
}
```

### Client-Side (Client Components)

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function MyClientComponent() {
  const [posts, setPosts] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
      setPosts(data || [])
    }
    fetchPosts()
  }, [])
  
  // ...
}
```

## 🔍 Common Queries

### Get Published Posts

```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10)
```

### Get Featured Posts

```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .eq('featured', true)
  .order('created_at', { ascending: false })
  .limit(3)
```

### Get Upcoming Events

```typescript
const today = new Date().toISOString().split('T')[0]

const { data } = await supabase
  .from('events')
  .select('*')
  .eq('published', true)
  .gte('event_date', today)
  .order('event_date', { ascending: true })
```

### Get Navigation Items

```typescript
const { data } = await supabase
  .from('navigation_items')
  .select('*')
  .eq('location', 'header')
  .eq('visible', true)
  .order('sort_order', { ascending: true })
```

### Get Page by Slug

```typescript
const { data } = await supabase
  .from('pages')
  .select('*')
  .eq('slug', 'impressum')
  .eq('published', true)
  .single()
```

### Get Site Setting

```typescript
const { data } = await supabase
  .from('site_settings')
  .select('value')
  .eq('key', 'site_title')
  .single()
```

### Search Posts by Title

```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .ilike('title', '%search term%')
  .eq('published', true)
```

## ✏️ CRUD Operations

### Create a Post

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: 'My New Post',
    slug: 'my-new-post',
    content: 'Post content here...',
    excerpt: 'Short summary',
    category: 'aktuelles',
    published: true,
    featured: false,
    user_id: userId, // Current user's ID
  })
  .select()
  .single()
```

### Update a Post

```typescript
const { data, error } = await supabase
  .from('posts')
  .update({
    title: 'Updated Title',
    content: 'Updated content',
  })
  .eq('id', postId)
  .select()
  .single()
```

### Delete a Post

```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
```

### Create a Contact Submission

```typescript
const { data, error } = await supabase
  .from('contact_submissions')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question',
    message: 'Hello, I have a question...',
  })
```

### Create an Event

```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'School Open House',
    description: 'Join us for our annual open house',
    event_date: '2026-03-15',
    event_time: '14:00 Uhr',
    location: 'Hauptgebäude',
    category: 'termin',
    published: true,
    user_id: userId,
  })
```

## 🔐 RLS Policies

Row Level Security is enabled on all tables. Here's what each role can do:

### Anonymous Users (Not Logged In)

- **Read**: Published pages, posts, events, documents
- **Read**: Visible navigation items, all site settings
- **Write**: Contact and anmeldung submissions

### Authenticated Users (Logged In)

- **Read**: Everything (including unpublished content)
- **Write**: Create their own content (posts, events, etc.)
- **Update**: Only their own content
- **Delete**: Only their own content

### Special Cases

- **pages.user_id** is nullable (system pages have no owner)
- **site_settings.protected** prevents deletion of critical settings
- **navigation_items** can be edited by any authenticated user
- **Submissions** can be created by anyone, read by authenticated users only

## 🛠️ Useful SQL Snippets

### Count Posts by Category

```sql
SELECT category, COUNT(*) as count
FROM public.posts
WHERE published = true
GROUP BY category
ORDER BY count DESC;
```

### Get Most Recent Submissions

```sql
SELECT *
FROM public.contact_submissions
WHERE read = false
ORDER BY created_at DESC
LIMIT 10;
```

### Find Orphaned Navigation Items

```sql
SELECT *
FROM public.navigation_items
WHERE parent_id IS NOT NULL
AND parent_id NOT IN (SELECT id FROM public.navigation_items);
```

### Get Content Statistics

```sql
SELECT
  (SELECT COUNT(*) FROM public.pages WHERE published = true) as pages_count,
  (SELECT COUNT(*) FROM public.posts WHERE published = true) as posts_count,
  (SELECT COUNT(*) FROM public.events WHERE published = true) as events_count,
  (SELECT COUNT(*) FROM public.documents WHERE published = true) as documents_count;
```

### Update All Posts in Category

```sql
UPDATE public.posts
SET category = 'news'
WHERE category = 'aktuelles';
```

### Bulk Update Sort Order

```sql
-- Reset sort order for pages in a section
WITH ordered_pages AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY title) - 1 as new_order
  FROM public.pages
  WHERE section = 'allgemein'
)
UPDATE public.pages
SET sort_order = ordered_pages.new_order
FROM ordered_pages
WHERE pages.id = ordered_pages.id;
```

## 🎯 Helper Functions

Use the pre-built helper functions for common operations:

```typescript
import {
  getPublishedPosts,
  getFeaturedPosts,
  getPostBySlug,
  getUpcomingEvents,
  getNavigationItems,
  getSiteSettingValue,
} from '@/lib/db-helpers'

// Simple and type-safe
const posts = await getPublishedPosts(10)
const events = await getUpcomingEvents()
const siteTitle = await getSiteSettingValue('site_title')
```

## 📊 Performance Tips

1. **Use indexes**: All common query fields are already indexed
2. **Limit results**: Always use `.limit()` for lists
3. **Select specific columns**: Use `.select('id, title')` instead of `.select('*')`
4. **Use single()**: When expecting one result, use `.single()` for better typing
5. **Avoid N+1 queries**: Use joins or batch queries when possible

## 🐛 Debugging

### Check RLS Policies

```sql
-- See all policies on a table
SELECT *
FROM pg_policies
WHERE tablename = 'posts';
```

### Test as Different User

```typescript
// In Supabase SQL Editor
SET ROLE authenticated;
SET request.jwt.claim.sub = 'user-uuid-here';

-- Now test your query
SELECT * FROM posts;

-- Reset
RESET ROLE;
```

### Enable Query Logging

```typescript
const supabase = await createClient()

// Log all queries in development
if (process.env.NODE_ENV === 'development') {
  supabase.from('posts')
    .select('*')
    .then(({ data, error }) => {
      console.log('Query result:', { data, error })
    })
}
```

## 📚 Additional Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/functions.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
