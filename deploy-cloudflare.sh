#!/bin/bash
set -e

echo "📦 Building Next.js application for Cloudflare deployment..."
npm run build

echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=gymdominator-admin --commit-dirty=true --branch=main

echo "✅ Deployment complete!" 