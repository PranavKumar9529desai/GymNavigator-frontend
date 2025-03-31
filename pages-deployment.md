# GymNavigator Admin - Cloudflare Pages Deployment Guide

This document outlines the step-by-step process for deploying the GymNavigator Admin frontend (Next.js 15.2) to Cloudflare Pages.

## Prerequisites

- [ ] Cloudflare account with access to Pages
- [ ] GitHub repository with your admin code
- [ ] Access to DNS settings for your domain (if using custom domain)
- [ ] Backend already deployed on Cloudflare Workers

## 1. Project Preparation

### 1.1 Optimize Next.js Config

Update your `next.config.mjs` to ensure compatibility with Cloudflare Pages:

```javascript
const nextConfig = {
  // Keep existing configuration
  
  // Update experimental settings
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'admin.gymnavigator.in', '*.pages.dev'],
    },
  },
};
```

### 1.2 Update API Endpoints

Ensure all API calls use environment variables for the backend URL:

```typescript
// Example in lib/api.ts or similar
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.gymnavigator.in';
```

### 1.3 Verify Dependencies

Make sure your `package.json` has the correct build scripts:

```json
"scripts": {
  "build": "next build"
}
```

## 2. Connect to Cloudflare Pages

### 2.1 Log into Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages section

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
- **Build command**: `npm run build` (or `bun run build` if using Bun)
- **Build output directory**: `.next` (Next.js default)
- **Root directory**: `/` (or specify if admin is in a subdirectory)

### 3.2 Environment Variables

Add the following environment variables:

| Variable Name | Production Value | Preview Value |
|---------------|------------------|--------------|
| NEXT_PUBLIC_API_URL | https://api.gymnavigator.in | https://api-staging.gymnavigator.in |
| NEXTAUTH_URL | https://admin.gymnavigator.in | https://preview-{branch}-gymnavigator-admin.pages.dev |
| NEXTAUTH_SECRET | [your-secure-secret] | [your-preview-secret] |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | [your-cloudinary-name] | [your-cloudinary-name] |

*Transfer all other variables from your `.env.production` file*

## 4. Deploy Process

### 4.1 Initial Deployment

1. Click "Save and Deploy"
2. Wait for build and deployment process to complete
3. Cloudflare will provide a temporary *.pages.dev URL

### 4.2 Verify Deployment

1. Visit the provided *.pages.dev URL
2. Check that:
   - Pages load correctly
   - Authentication works
   - API calls succeed
   - Images and assets display properly

## 5. Custom Domain Setup

### 5.1 Add Custom Domain

1. In Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter: `admin.gymnavigator.in`
4. Choose setup method:
   - If domain is on Cloudflare: Direct setup
   - If domain is elsewhere: Add DNS records

### 5.2 Configure DNS

If domain is not on Cloudflare:

1. Add CNAME record:
   - Name: `admin`
   - Target: `[your-project].pages.dev`
   - TTL: Auto or 3600

### 5.3 Verify SSL

1. Wait for SSL certificate to provision (usually automatic)
2. Verify HTTPS works on your custom domain

## 6. Performance Optimization

### 6.1 Enable Caching

Configure caching in `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### 6.2 Image Optimization

Ensure proper Image Optimization settings:

```javascript
images: {
  remotePatterns: [
    // Keep existing patterns
  ],
  minimumCacheTTL: 60,
}
```

## 7. Final Checklist

- [ ] Application loads on custom domain
- [ ] Authentication works properly
- [ ] All API calls connect to backend
- [ ] Images and assets load correctly
- [ ] Forms submit without errors
- [ ] Server actions execute properly
- [ ] Performance is acceptable

## 8. Troubleshooting Common Issues

### 8.1 Build Failures

- Check build logs for specific errors
- Ensure all dependencies are properly installed
- Verify Next.js version compatibility with Cloudflare Pages

### 8.2 API Connection Issues

- Confirm backend Workers are deployed correctly
- Verify CORS settings on backend allow requests from Pages domain
- Check environment variables are set correctly

### 8.3 Authentication Problems

- Ensure NEXTAUTH_URL matches your actual domain
- Verify NEXTAUTH_SECRET is properly set
- Check for any JWT errors in console

## 9. Ongoing Maintenance

### 9.1 Automatic Deployments

Cloudflare Pages will automatically deploy on commits to your main branch.

### 9.2 Preview Deployments

For feature branches, Cloudflare creates preview deployments at:
`https://[branch]-[project].pages.dev`

### 9.3 Monitoring

Set up monitoring through Cloudflare Analytics to track:
- Page views
- API requests
- Error rates
- Performance metrics 