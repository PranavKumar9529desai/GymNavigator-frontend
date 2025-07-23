module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gymnavigator.in',
	generateRobotsTxt: true,
	exclude: [
		'/dashboard/*',
		'/settings/*',
		'/onboarding/*',
		'/api/*',
		'/auth/*',
		'/_next/*',
		'/static/*',
	],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/dashboard/',
					'/settings/',
					'/onboarding/',
					'/api/',
					'/auth/',
					'/_next/',
					'/static/',
				],
			},
		],
		additionalSitemaps: [
			`${process.env.NEXT_PUBLIC_SITE_URL || 'https://gymnavigator.in'}/sitemap.xml`,
		],
	},
	trailingSlash: true,
};
