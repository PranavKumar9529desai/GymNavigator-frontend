import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';
// We will define custom runtimeCaching below

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure for Cloudflare Pages deployment
	// output: "standalone",

	// SWC Compiler Configuration

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'source.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.muscleandstrength.com',
			},
			{
				protocol: 'https',
				hostname: 'avatar-placeholder.iran.liara.run',
			},
			{
				protocol: 'https',
				hostname: 'avatar.iran.liara.run',
			},
		],
	},

	// Removed experimental.serverActions to satisfy Next.js 15 config requirements

	async headers() {
		return [
			{
				source: '/:path*', // Apply to all routes
				headers: [
					{
						key: 'Host',
						value: 'gymnavigator.in',
					},
					{
						// Prevent iframe embedding
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						// Prevent MIME type sniffing
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						// Force HTTPS
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains',
					},
					{
						// Broader CSP for React Three Fiber and 3D components
						key: 'Content-Security-Policy',
						value:
							"default-src 'self'; connect-src 'self' https://cdn.jsdelivr.net https://*.pmnd.rs https://*.githubusercontent.com https://raw.githack.com https://nominatim.openstreetmap.org; img-src 'self' https: data:; object-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' https://cdn.jsdelivr.net data:; worker-src 'self' blob:; frame-src 'self' https://*.youtube.com https://youtube.com https://*.youtube-nocookie.com;",
					},
					{
						// Prevent XSS attacks
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
				],
			},
		];
	},
	// Fix for invalid regex in troika-three-text
	webpack: (config) => {
		// Create a custom rule to exclude troika-three-text from normal processing
		config.module.rules.unshift({
			test: /troika-three-text\.esm\.js$/,
			loader: require.resolve('string-replace-loader'),
			options: {
				search: /\\p\{Script=Hangul\}/u,
				replace: '\\uAC00-\\uD7A3', // Hangul Unicode range
				flags: 'g',
			},
		});

		return config;
	},
};

export default withPWA({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true, // Ensure service worker is registered
	skipWaiting: true, // Ensure new service worker activates immediately
})(withBundleAnalyzer(nextConfig));
