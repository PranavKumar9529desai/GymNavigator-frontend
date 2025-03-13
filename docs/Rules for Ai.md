# Development Setup
- Bun for development & dependencies
- Next.js 15.2.1 (canary)

# File Naming
## Server Actions
- Kebab-case: `action-name.ts`
- Verb-noun pattern: `update-user.ts`, `get-posts.ts`
- ✅ Examples: `update-profile.ts`, `delete-comment.ts`, `fetch-orders.ts`
- ❌ Avoid: `userUpdate.ts`, `GetPosts.ts`

# Architecture Rules
## Server/Client Split
- Server-side: Data fetching, auth, sensitive ops
- Client-side: UI state, real-time updates
- Use server components by default
- Minimize 'use client' directives
- Client bundles: <15KB per component
- Use server actions for mutations
- ❌ No route handlers (route.ts)
- Server actions: Same directory as component
- Implement error handling & validation

## Performance
- SEO-optimized semantic HTML
- loading.tsx for route segments
- Skeleton loaders with Tailwind animate-pulse
