# Grabbe-Gymnasium Detmold - Homepage

Modern website for Grabbe-Gymnasium Detmold built with Next.js, TypeScript, and Supabase.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Features

- 📰 News/Blog system (Aktuelles)
- 📅 Event calendar (Termine)
- 📄 Static pages with CMS
- 📥 Download center for documents
- 🧭 Dynamic navigation system
- 📧 Contact form
- 🎓 School enrollment form (Anmeldung)
- ⚙️ Site-wide settings management
- 🔐 Authentication with Supabase Auth
- 🎨 Modern, responsive design
- ♿ Accessibility-focused

## 🗄️ Database Structure

The project uses a PostgreSQL database hosted on Supabase with 8 main tables:

### Core Content Tables

1. **pages** - Static pages (Impressum, Über uns, etc.)
2. **posts** - News articles and blog posts
3. **events** - School calendar and events
4. **documents** - Downloadable files (PDFs, documents)

### System Tables

5. **navigation_items** - Hierarchical navigation (header/footer)
6. **site_settings** - Key-value configuration store

### Submission Tables

7. **contact_submissions** - Contact form entries
8. **anmeldung_submissions** - School enrollment applications

For detailed schema information, see [`scripts/README.md`](./scripts/README.md).

## 🛠️ Development Setup

### Prerequisites

- Node.js 22+ and `pnpm` (required package manager)
- A Supabase account and project
- (Optional) Vercel account for deployment

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/finnbusse/grabbe-concept-website.git
   cd grabbe-concept-website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials and other secrets:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Security / Auth
   INVITATION_SECRET=your-secure-random-string
   IP_HASH_SALT=your-secure-random-salt

   # Storage
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

4. **Set up the database**

   Follow the instructions in [`DEPLOYMENT.md`](./DEPLOYMENT.md) to set up your database schema in Supabase.

5. **Run the development server**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── aktuelles/         # News/blog pages
│   ├── api/               # API routes
│   ├── cms/               # CMS admin interface
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # Utility functions and helpers
│   ├── supabase/         # Supabase client configuration
│   ├── types/            # TypeScript type definitions
│   ├── db-helpers.ts     # Database query helpers
│   └── ...
├── scripts/              # Database migration scripts
│   ├── complete_schema.sql
│   └── README.md
├── public/               # Static assets
└── styles/              # Global styles
```

## 🗃️ Database Usage

### TypeScript Types

All database tables have TypeScript type definitions in `lib/types/database.types.ts`:

```typescript
import type { Page, Post, Event } from '@/lib/types/database.types'
```

### Query Helpers

Use the pre-built query helpers from `lib/db-helpers.ts`:

```typescript
import { 
  getPublishedPosts, 
  getUpcomingEvents,
  getNavigationItems 
} from '@/lib/db-helpers'

// Get latest posts
const posts = await getPublishedPosts(10)

// Get upcoming events
const events = await getUpcomingEvents()

// Get navigation
const nav = await getNavigationItems('header')
```

### Direct Database Access

For custom queries, use the typed Supabase client:

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .limit(5)
```

## 🚢 Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy**

For detailed database deployment instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Database Deployment

The database schema needs to be applied to your Supabase project:

1. Go to Supabase SQL Editor
2. Run the contents of `scripts/complete_schema.sql`
3. Verify all tables are created

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for complete instructions.

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** via Supabase Auth
- **Protected routes** with middleware
- **Form validation** with Zod schemas
- **XSS protection** through React's built-in escaping

## 📝 Scripts

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production (TypeScript errors will fail the build)
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript compiler check
- `pnpm run test` - Run automated tests

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📚 Documentation

- [Database Schema Documentation](./scripts/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License

This project is proprietary software for Grabbe-Gymnasium Detmold.

## 👨‍💻 Developed By

Finn Busse

---

For questions or support, please contact the development team.
