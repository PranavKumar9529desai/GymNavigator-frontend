#!/bin/bash

# Print commands for debugging
set -x

echo "Setting up for Cloudflare Pages deployment..."

# Copy the Cloudflare-specific package.json to root
cp package.cloudflare.json package.json

# Install dependencies with npm legacy-peer-deps flag
npm install --legacy-peer-deps

# Run the build
npm run build

# Report success
echo "Setup and build completed successfully" 