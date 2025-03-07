    # AI Coding Guidelines

**Client/Server Logic Rules:**
- Use bun for development
- Use bun add for dependencies
- ➡️ Use server-side for: Data fetching, auth, sensitive operations
- ➡️ Use client-side for: UI state, real-time updates, interactions
- Prefer Next.js server components for initial page loads
- **Minimize 'use client' directives** to essential interactive components only
- Keep client bundles <15KB per component (mobile performance critical)
- Use server actions for mutations instead of direct API calls
- ⚠️ **NEVER use route handlers (route.ts)** - Always implement server actions instead
- 📍 Create server actions in the same directory level as the component using them
- Name server actions with clear, action-oriented prefixes (e.g., `createUser`, `updatePost`)
- Implement proper error handling and validation within server actions
- SEO-optimized semantic HTML (proper heading hierarchy, ARIA labels, meta tags)

**Always prioritize:**

1. Mobile-first performance (FCP <1.8s, LCP <2.5s)
2. TanStack Query for state management (with persisted cache)
3. PWA core features (offline support, background sync)
4. Security fundamentals (JWT, CSRF, XSS protection)
5. Bundle size optimization (code splitting + tree shaking)
6. SEO-optimized semantic HTML (proper heading hierarchy, ARIA labels, meta tags)


**Avoid:**

- Client-side heavy computations
- Mixing server/client logic in same component
- Large third-party dependencies
- Blocking main thread operations
- Client-side data filtering/sorting of large datasets

**SEO optimization:**

- Use single `<h1>` tag per page for main title
- Follow proper heading hierarchy (h1 → h2 → h3)
- Implement descriptive meta tags (title, description)
- Use semantic HTML elements (nav, main, article, section, aside)
- Include structured data/schema markup when applicable
- Optimize image alt texts and file names ( Always use Next.js Image component)

**Loading UI Patterns:**
- Use loading.tsx for route segment loading states
- Implement skeleton loaders with Tailwind's animate-pulse:
for each page.tsx creation
- Match skeleton dimensions to actual content

