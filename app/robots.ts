import type { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for Next.js app router
 * Controls search engine crawling behavior
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://admin.gymnavigator.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/home', '/gym', '/dashboard'],
        disallow: ['/api/*', '/_next/*', '/static/*', '/auth/*', '/*.json', '/*.xml'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/dashboard'],
        disallow: ['/api/', '/_next/', '/static/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
