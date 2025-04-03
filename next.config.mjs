import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	// Configure for Cloudflare Pages deployment
	// output: "standalone",

	// SWC Compiler Configuration
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
		styledComponents: true,
	},

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
		],
	},

	// Add webpack configuration to handle troika-three-text
	webpack: (config, { isServer: _isServer }) => {
		// Handle the troika-three-text module with regex issues
		config.module.rules.push({
			test: /troika-three-text.*\.js$/,
			loader: 'string-replace-loader',
			options: {
				search: /\/\\p\{Script=Hangul\}\/u\.test\([^)]+\)/g,
				replace: 'false',
				flags: 'g',
			},
		});

		return config;
	},

	// Configure experimental features
	experimental: {
		serverActions: {
			allowedOrigins: [
				'localhost:3000',
				'admin.gymnavigator.in',
				'*.pages.dev',
			],
		},
		// Add proper Turbopack configuration
	},

	async headers() {
		return [
			{
				source: '/:path*', // Apply to all routes
				headers: [
					{
						key: 'Host',
						value: 'admin.gymnavigator.in',
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
							"default-src 'self'; connect-src 'self' https://cdn.jsdelivr.net https://*.pmnd.rs https://*.githubusercontent.com https://raw.githack.com; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' https://cdn.jsdelivr.net data:; worker-src 'self' blob:; frame-src 'self' https://*.youtube.com https://youtube.com https://*.youtube-nocookie.com;",
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
};

export default withBundleAnalyzer(nextConfig);
