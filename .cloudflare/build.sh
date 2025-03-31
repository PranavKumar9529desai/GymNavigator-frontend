#!/bin/bash

# Print commands for debugging
set -x

echo "Current Node.js version: $(node -v)"
echo "Current npm version: $(npm -v)"

# Install bun
echo "Installing bun..."
npm install -g bun

# Confirm bun installation
echo "Bun version: $(bun -v)"

# Install dependencies with bun
echo "Installing dependencies with bun..."
bun install

# Build with bun
echo "Building with bun..."
bun run build

# Report success
echo "Build completed successfully" 