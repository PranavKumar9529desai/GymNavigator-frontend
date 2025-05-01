import bundleAnalyzer from "@next/bundle-analyzer";
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Cloudflare Pages deployment
  // output: "standalone",

  // SWC Compiler Configuration

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.muscleandstrength.com",
      },
      {
        protocol: "https",
        hostname: "avatar-placeholder.iran.liara.run",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },


  // Removed experimental.serverActions to satisfy Next.js 15 config requirements

  async headers() {
    return [
      {
        source: "/:path*", // Apply to all routes
        headers: [
          {
            key: "Host",
            value: "admin.gymnavigator.in",
          },
          {
            // Prevent iframe embedding
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Prevent MIME type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Force HTTPS
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            // Broader CSP for React Three Fiber and 3D components
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; connect-src 'self' https://cdn.jsdelivr.net https://*.pmnd.rs https://*.githubusercontent.com https://raw.githack.com; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' https://cdn.jsdelivr.net data:; worker-src 'self' blob:; frame-src 'self' https://*.youtube.com https://youtube.com https://*.youtube-nocookie.com;",
          },
          {
            // Prevent XSS attacks
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  // Alias troika-three-text to its UMD bundle to avoid Babel regex AST errors
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
})(withBundleAnalyzer(nextConfig));
