# GymNavigator Admin - Cloudflare Pages Deployment Guide

This document outlines the step-by-step process for deploying the GymNavigator Admin frontend (Next.js 15.2) to Cloudflare Pages.

## Prerequisites

- [ ] Cloudflare account with access to Pages
- [ ] GitHub repository with your admin code
- [ ] Access to DNS settings for your domain (if using custom domain)
- [ ] Backend already deployed on Cloudflare Workers (currently at `https://gym-navigator-backend.fullstackwebdeveloper123.workers.dev`)

## 1. Project Preparation

### 1.1 Optimize Next.js Config

Your `next.config.mjs` already has the correct configuration for Cloudflare Pages compatibility:

```javascript
experimental: {
  serverActions: {
    allowedOrigins: [
      'localhost:3000',
      'admin.gymnavigator.in',
      '*.pages.dev',
    ],
  },
},
```

This ensures your server actions work properly on the Cloudflare Pages domain.

### 1.2 Update Environment Variables

Create a specific `.env.cloudflare` file at the root of your project with the following content:

```
# Core Auth Variables
NEXTAUTH_URL=https://admin.gymnavigator.in
NEXTAUTH_SECRET=OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw
AUTH_SECRET=OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw

# Environment Detection
NODE_ENV=production

# Domain Configuration
PRODUCTION_DOMAIN=.gymnavigator.in
LOCAL_DOMAIN=admin.gymnavigator.in

# Auth Providers (keep your existing values)
GOOGLE_CLIENT_ID=485120698097-8u1tfjg2t4uogif36fu4515i98osiaje.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=https://gym-navigator-backend.fullstackwebdeveloper123.workers.dev

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=db4bbyw44
NEXT_PUBLIC_UPLOAD_PRESET=ml_default
NEXT_PUBLIC_CLOUDINARY_API_KEY=794263794372317
```

### 1.3 Optimize Build Process

Update `package.json` to ensure compatibility with Cloudflare Pages:

```json
"scripts": {
  "dev": "bun run --bun next dev --turbopack",
  "prebuild": "node fix-axios-imports.mjs",
  "build": "next build",
  "start": "next start"
}
```

Notice we're removing the bun-specific flags for the build command, as Cloudflare Pages uses npm/node by default.

### 1.4 Create a `_routes.json` File

This helps with handling dynamic routes correctly in Cloudflare Pages. Create a file at `public/_routes.json`:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/_next/*",
    "/api/*",
    "/static/*"
  ]
}
```

## 2. Connect to Cloudflare Pages

### 2.1 Log into Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Pages" section

### 2.2 Create New Project

1. Click "Create application"
2. Select "Pages" as the project type
3. Choose "Connect to Git"
4. Authenticate with GitHub/GitLab
5. Select your admin repository

## 3. Configure Build Settings

### 3.1 Basic Build Configuration

Set the following in the Cloudflare Pages setup:

- **Project name**: `gymnavigator-admin`
- **Production branch**: `main` (or your primary branch)
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (since admin is at the root)
- **Node.js version**: 20.x (recommended for Next.js 15.2)

### 3.2 Environment Variables

Add the following environment variables in the Cloudflare Pages dashboard:

| Variable Name | Production Value | Preview Value |
|---------------|------------------|--------------|
| NEXT_PUBLIC_BACKEND_URL | https://gym-navigator-backend.fullstackwebdeveloper123.workers.dev | https://gym-navigator-backend.fullstackwebdeveloper123.workers.dev |
| NEXTAUTH_URL | https://admin.gymnavigator.in | https://preview-{branch}-gymnavigator-admin.pages.dev |
| NEXTAUTH_SECRET | OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw | OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw |
| AUTH_SECRET | OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw | OqrO79gZcr3vUZvBHI048HbRLVFy2zpLkpPld3STccw |
| NODE_ENV | production | production |
| PRODUCTION_DOMAIN | .gymnavigator.in | .pages.dev |
| GOOGLE_CLIENT_ID | 485120698097-8u1tfjg2t4uogif36fu4515i98osiaje.apps.googleusercontent.com | 485120698097-8u1tfjg2t4uogif36fu4515i98osiaje.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | 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 | 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 |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | db4bbyw44 | db4bbyw44 |
| NEXT_PUBLIC_UPLOAD_PRESET | ml_default | ml_default |
| NEXT_PUBLIC_CLOUDINARY_API_KEY | 794263794372317 | 794263794372317 |

### 3.3 Advanced Build Settings

Enable the following options:

- [x] **Automatically build and deploy on commit**: Ensures new code is deployed when merged to main
- [x] **Automatically minify JavaScript**: For better performance
- [x] **Production optimized**: Ensures optimal caching and performance

## 4. Deploy Process

### 4.1 Initial Deployment

1. Click "Save and Deploy"
2. Wait for build and deployment process to complete
3. Cloudflare will provide a temporary *.pages.dev URL

### 4.2 Handle Compatibility Settings

In Cloudflare Pages settings, navigate to "Functions" tab and set:

- **Compatibility flags**: 
  - Set `nodejs_compat` to `true` 
  - Enable `nodejs_apis`

This ensures compatibility with Node.js APIs used by Next.js.

### 4.3 Verify Deployment

1. Visit the provided *.pages.dev URL
2. Check that:
   - Pages load correctly
   - Authentication works
   - API calls succeed (ensure backend CORS allows the Pages domain)
   - Images and assets display properly
   - 3D components render correctly

## 5. Custom Domain Setup

### 5.1 Add Custom Domain

1. In Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter: `admin.gymnavigator.in`
4. Choose setup method:
   - If domain is on Cloudflare: Direct setup
   - If domain is elsewhere: Add DNS records

### 5.2 Configure DNS

If domain is already on Cloudflare:

1. Select "Configure via Cloudflare DNS"
2. Cloudflare will automatically add the CNAME record

If domain is not on Cloudflare:

1. Add CNAME record:
   - Name: `admin`
   - Target: `[your-project].pages.dev`
   - TTL: Auto or 3600

### 5.3 SSL/TLS Configuration

1. In your Cloudflare domain dashboard, go to "SSL/TLS"
2. Set mode to "Full" or "Full (strict)" for enhanced security
3. Enable HTTPS redirects
4. Set minimum TLS version to 1.2

## 6. Performance Optimization

### 6.1 Caching Rules

In your Cloudflare Pages project settings:

1. Go to "Caching" tab
2. Create a custom cache rule:
   - For static assets: Set cache duration to 1 year
   - For API routes: No cache or short cache (30 seconds)

### 6.2 Enable Cloudflare Web Analytics

1. In Cloudflare dashboard, navigate to "Analytics"
2. Enable Web Analytics for your domain
3. Copy the provided JavaScript snippet
4. Add to your application in a custom document or layout component

### 6.3 Configure Cloudflare Workers for Additional Features

If needed, create a Cloudflare Worker for advanced functionality:

```js
// Example: worker for custom headers or additional processing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response)
  
  // Add additional security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  
  return newResponse
}
```

## 7. Cloudflare Pages Specifics

### 7.1 Function Invocation Limits

Be aware of Cloudflare Pages limits:
- 100 subrequests per invocation
- 10 second CPU time limit
- 128MB memory limit
- 1MB response size limit

### 7.2 Edge Middleware Considerations

If using Next.js middleware:

1. Keep middleware logic lightweight
2. Be aware of execution limits at the edge
3. Consider moving complex logic to server components

### 7.3 Optimal Settings for Next.js 15.2

For best performance with Next.js 15.2 on Cloudflare Pages:

1. Enable the App Router's static optimization features
2. Use Server Components where possible
3. Limit Client Components to interactive UI
4. Implement proper ISR patterns where needed

## 8. Troubleshooting Common Issues

### 8.1 Build Failures

- Check build logs for specific errors
- Common issues with Next.js 15.2 on Cloudflare Pages:
  - Incompatible Node.js APIs
  - Missing environment variables
  - Invalid middleware configuration

### 8.2 API Connection Issues

- Ensure backend Workers have CORS configured:
```js
// Example CORS headers for your backend Worker
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://admin.gymnavigator.in",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};
```

### 8.3 Authentication Problems

- Verify that NEXTAUTH_URL matches your actual domain exactly
- For OAuth providers (Google), ensure redirect URIs are added to your OAuth project settings
- Check for JWT-related issues in browser console

## 9. Maintenance and Monitoring

### 9.1 CI/CD with GitHub Actions

Consider implementing GitHub Actions for additional CI/CD steps:

```yaml
name: Test Before Cloudflare Pages

on:
  push:
    branches: [ main, development ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      # Additional testing steps
```

### 9.2 Monitoring

Implement monitoring for your Pages deployment:
- Set up Cloudflare Analytics
- Configure alerts for errors or performance issues
- Use Cloudflare's built-in observability features

### 9.3 Rollback Strategy

In case of deployment issues:
1. In Cloudflare Pages dashboard, go to "Deployments"
2. Find the last working deployment
3. Click "..." and select "Rollback to this deployment"

## 10. Advanced Deployment Strategies

### 10.1 A/B Testing with Preview Deployments

Use Cloudflare Pages preview deployments for A/B testing:
1. Create a branch with your test version
2. Deploy to preview environment
3. Direct a percentage of traffic to the preview URL using Cloudflare Workers

### 10.2 Multi-Region Deployment

For global optimization:
1. Use Cloudflare's global CDN capabilities
2. Consider R2 Storage for larger assets
3. Optimize image delivery with Cloudflare Images

### 10.3 Integration with Backend Workers

For tighter integration with your backend:
1. Use Cloudflare Workers bindings 
2. Consider implementing Service Bindings for direct Worker-to-Worker communication
3. Use Cloudflare KV or D1 for shared state

## Conclusion

This comprehensive guide should help you successfully deploy your GymNavigator Admin frontend to Cloudflare Pages. Following these steps will ensure optimal performance, security, and reliability for your application. 