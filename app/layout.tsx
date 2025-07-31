import '@/globals.css';
import Providers from '@/providers/provider';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { OnlineStatusProvider } from '@/providers/OnlineStatusProvider';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { auth } from '@/app/(auth)/auth'; // Assuming your auth config is in /auth.ts
import localFont from 'next/font/local';
import ClientMotionProvider from '../providers/ClientMotionProvider';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { PostHogProvider } from '@/providers/PostHogProvider';

const siteUrl = 'https://gymnavigator.in';

// Default toast configuration
const toastConfig = {
	duration: 4000,
	position: 'top-right' as const,
	richColors: true,
	// closeButton: true,
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
};

// JSON-LD Structured Data for GymNavigator
const generateStructuredData = () => {
	const baseUrl = siteUrl;
	
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'GymNavigator',
			url: baseUrl,
			logo: `${baseUrl}/icon.png`,
			description: 'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
			foundingDate: '2024',
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer service',
				url: baseUrl
			},
			sameAs: [
				'https://twitter.com/gymnavigator'
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: 'GymNavigator',
			url: baseUrl,
			description: 'Multi-tenant, mobile-first PWA for gym management that revolutionizes how gyms operate by focusing on trainer-client relationships.',
			applicationCategory: 'BusinessApplication',
			operatingSystem: 'Web Browser, iOS, Android',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'INR',
				description: 'Free tier available with premium features'
			},
			featureList: [
				'Multi-tenant gym management',
				'Trainer-client relationship management',
				'QR code attendance system',
				'Workout and diet plan management',
				'Mobile-first PWA design',
				'Offline capabilities',
				'Real-time attendance tracking'
			],
			author: {
				'@type': 'Organization',
				name: 'GymNavigator'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'GymNavigator Mobile App',
			applicationCategory: 'BusinessApplication',
			operatingSystem: 'iOS, Android, Web',
			description: 'Mobile-first gym management application with offline capabilities and QR code integration.',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'INR'
			},
			featureList: [
				'QR code scanning for attendance',
				'Offline workout access',
				'Real-time sync',
				'Push notifications',
				'Mobile-optimized interface'
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Service',
			name: 'Gym Management System',
			provider: {
				'@type': 'Organization',
				name: 'GymNavigator'
			},
			description: 'Comprehensive gym management solution including member management, attendance tracking, workout planning, and diet management.',
			serviceType: 'Gym Management Software',
			areaServed: 'Worldwide',
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				name: 'Gym Management Services',
				itemListElement: [
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'Member Management',
							description: 'Comprehensive member onboarding and management system'
						}
					},
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'Attendance Tracking',
							description: 'QR code-based attendance system with real-time tracking'
						}
					},
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'Workout Management',
							description: 'Create and assign workout plans to clients'
						}
					},
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'Diet Management',
							description: 'Comprehensive diet planning and grocery list generation'
						}
					}
				]
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'LocalBusiness',
			name: 'GymNavigator',
			description: 'Digital gym management platform serving gym owners, trainers, and clients worldwide.',
			url: baseUrl,
			telephone: '+91-800-GYM-NAV',
			email: 'support@gymnavigator.in',
			address: {
				'@type': 'PostalAddress',
				addressCountry: 'IN'
			},
			geo: {
				'@type': 'GeoCoordinates',
				latitude: '20.5937',
				longitude: '78.9629'
			},
			openingHours: 'Mo-Su 00:00-23:59',
			priceRange: '₹₹',
			paymentAccepted: 'Credit Card, Debit Card, UPI, Online Payment',
			currenciesAccepted: 'INR, USD, EUR',
			areaServed: 'Worldwide',
			serviceArea: {
				'@type': 'Country',
				name: 'Worldwide'
			}
		}
	];
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: 'GymNavigator - Gym Management System',
	description:
		'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
	applicationName: 'GymNavigator',
	alternates: {
		canonical: '/',
	},
	verification: {
		google: 'LCLleK9nzppdl_Pl1l1Sd00aXJRgLyfl6Xjc6poUDAI',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	appLinks: {
		web: {
			url: siteUrl,
			should_fallback: true,
		},
	},
	openGraph: {
		title: 'GymNavigator - Gym Management System',
		description:
			'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
		url: siteUrl,
		siteName: 'GymNavigator',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: `${siteUrl}/gymnavigator-og-1200x630.png`, // Use properly sized image
				width: 1200,
				height: 630,
				alt: 'GymNavigator - Modern Gym Management',
				type: 'image/png',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'GymNavigator - Gym Management System',
		description:
			'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
		images: [`${siteUrl}/gymnavigator-og-1200x630.png`], // Use properly sized image
	},
	other: {
		'og:image:secure_url': `${siteUrl}/gymnavigator-og-1200x630.png`,
		'theme-color': '#1e40af',
		'msapplication-TileColor': '#1e40af',
		// Additional meta tags for better SEO
		'og:image:width': '1200',
		'og:image:height': '630',
		'og:image:alt': 'GymNavigator - Modern Gym Management',
		'og:image:type': 'image/png',
		'twitter:image:alt': 'GymNavigator - Modern Gym Management',
		// Additional SEO meta tags
		'og:image:url': `${siteUrl}/gymnavigator-og-1200x630.png`,
		'twitter:image:width': '1200',
		'twitter:image:height': '630',
		'twitter:site': '@gymnavigator',
		'twitter:creator': '@gymnavigator',
		// Schema.org structured data hints
		'application-name': 'GymNavigator',
		'mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'default',
		'apple-mobile-web-app-title': 'GymNavigator',
	},
	icons: {
		icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
		apple: [{ url: '/apple-touch-icon.png' }],
		other: [
			{
				rel: 'mask-icon',
				url: '/favicon/safari-pinned-tab.svg',
				color: '#1e40af',
			},
		],
	},
	manifest: '/site.webmanifest',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth(); // Fetch the session on the server
	const structuredData = generateStructuredData();

	return (
		<html lang="en">
			<head>
				{/* JSON-LD Structured Data */}
				{structuredData.map((data, index) => (
					<script
						key={`json-ld-${data['@type']}-${index}`}
						type="application/ld+json"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(data).replace(/</g, '\\u003c'),
						}}
					/>
				))}
			</head>
			<body>
				<PostHogProvider>
					<Providers session={session}>
						{/* Pass the session as a prop */}
						<OnlineStatusProvider>
							<OfflineIndicator /> {/* Add the indicator here */}
							<ClientMotionProvider>
								{children}
								<RegisterServiceWorker />
								<Toaster {...toastConfig} />
							</ClientMotionProvider>
						</OnlineStatusProvider>
					</Providers>
					<PWAInstallPrompt />
				</PostHogProvider>
			</body>
		</html>
	);
}
