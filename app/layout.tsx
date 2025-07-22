import '@/globals.css';
import Providers from '@/providers/provider';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import type { ToasterProps } from 'sonner';
import { OnlineStatusProvider } from '@/providers/OnlineStatusProvider';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import OfflineIndicator from '@/components/common/OfflineIndicator';
import { auth } from '@/app/(auth)/auth'; // Assuming your auth config is in /auth.ts
import localFont from 'next/font/local';
import ClientMotionProvider from '../providers/ClientMotionProvider';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { PostHogProvider } from '@/providers/PostHogProvider';
const siteUrl = 'https://gymnavigator.in';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
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
				url: '/gymnavigator-og.jpg', // Direct path to OG image in public directory
				width: 1200,
				height: 630,
				alt: 'GymNavigator - Modern Gym Management',
				type: 'image/jpeg',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'GymNavigator - Gym Management System',
		description:
			'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
		images: ['/gymnavigator-og.jpg'],
	},
	other: {
		'og:image:secure_url': `${siteUrl}/gymnavigator-og.jpg`,
		'theme-color': '#1e40af',
		'msapplication-TileColor': '#1e40af',
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

	const toasterProps: ToasterProps = {
		richColors: true,
		theme: 'light',
		position: 'top-right',
	};

	return (
		<html lang="en">
			<head />
			<body>
					<Providers session={session}>
						{/* Pass the session as a prop */}
						<OnlineStatusProvider>
							<OfflineIndicator /> {/* Add the indicator here */}
							<ClientMotionProvider>
								{children}
								<RegisterServiceWorker />
								<Toaster {...toasterProps} />
							</ClientMotionProvider>
						</OnlineStatusProvider>
					</Providers>
					<PWAInstallPrompt />
{/* /				</PostHogProvider> */}
			</body>
		</html>
	);
}