import type { MetadataRoute } from 'next';
import { generateStaticParams } from './gym/[gymname]/page';

const siteUrl = 'https://admin.gymnavigator.in';

/**
 * Sitemap configuration for Next.js app router
 * Helps search engines better index your site
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes that should be indexed
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/gym`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/trainer`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/client`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Home pages routes (at root level since (home) is a route group)
  const homeRoutes = [
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Static assets that should be indexed
  const staticAssets = [
    {
      url: `${siteUrl}/gymnavigator-og.jpg`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.1,
    },
    {
      url: `${siteUrl}/icon.png`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.1,
    },
    {
      url: `${siteUrl}/apple-touch-icon.png`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.1,
    },
  ];

  // Get gym routes from the same function that generates static paths
  try {
    const gymParams = await generateStaticParams();
    const dynamicRoutes = gymParams.map((param) => ({
      url: `${siteUrl}/gym/${encodeURIComponent(param.gymname)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...homeRoutes, ...staticAssets, ...dynamicRoutes];
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    return [...staticRoutes, ...homeRoutes, ...staticAssets];
  }
}
