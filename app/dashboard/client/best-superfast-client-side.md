# Mobile-First Client-Side Performance Optimization Guide

## 1. TanStack Query Implementation

### Core Setup
```typescript
// lib/tanstack-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      networkMode: 'offlineFirst'
    }
  }
})
```

### Best Practices
- Use `suspense: true` for automatic loading states
- Implement `prefetchQuery` for critical data paths
- Use `placeholderData` for instant loading states
- Setup proper error boundaries

## 2. Mobile Performance Optimizations

### Critical Considerations
1. Minimize JavaScript bundle size
2. Implement code splitting
3. Use lightweight alternatives to heavy libraries
4. Avoid unnecessary animations
5. Implement touch-friendly UI (44x44px targets)

### Data Management
1. Use server components for data fetching
2. Implement proper caching strategies
3. Use optimistic updates for better UX
4. Implement infinite scroll instead of pagination

## 3. Security Implementation

1. Authentication
   - JWT with HTTP-only cookies
   - Refresh token rotation
   - Rate limiting

2. Data Protection
   - Input validation
   - XSS protection
   - CSRF protection

## 4. Performance Metrics

### Key Metrics to Monitor
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- First Input Delay (FID) < 100ms

### Implementation Checklist
- [ ] Setup TanStack Query
- [ ] Implement SSR/SSG where possible
- [ ] Setup proper caching
- [ ] Implement security measures
- [ ] Setup performance monitoring
- [ ] Mobile-first UI implementation
- [ ] Error handling
- [ ] Offline support



### Use virtual scroll for large lists ( all workouts)
@tanstack/react-virtual - Modern, hooks-based approach (used in example)