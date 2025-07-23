import React from 'react';
import FetchGymData from './FetchGymData';
import Gym from './Gym';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { GymData } from '@/app/dashboard/owner/gym/(gymdetails)/viewgymdetails/types/gym-types';

// Reintroduce generateStaticParams for static generation
interface GymNameResponse {
	msg: 'success' | 'unexpected error';
	gyms?: { name: string }[];
}

export async function generateStaticParams() {
	// Fetch all gym names to pre-render their pages at build time
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/public/gym/allgymnames`,
			{
				next: { revalidate: 3600 }, // Revalidate gym list every hour
			},
		);
		const data: GymNameResponse = await response.json();
		if (data.msg === 'success' && data.gyms) {
			return data.gyms.map((gym) => ({
				gymname: gym.name,
			}));
		}
		return [];
	} catch (error) {
		console.error('Error fetching gyms for static params:', error);
		return [];
	}
}

interface PageProps {
	params: Promise<{
		gymname: string;
	}>;
}

// Inject JSON-LD structured data for LocalBusiness
function GymStructuredData({ gymData }: { gymData: GymData }) {
	if (!gymData) return null;
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: gymData.name,
		image: gymData.gym_logo,
		address: gymData.address,
		url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gymnavigator.in'}/gym/${encodeURIComponent(gymData.gym_name)}`,
		// Add more fields as available
	};
	return (
		<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
	);
}

const GymPage = async (props: PageProps) => {
	const params = await props.params;
	const { gymname } = params;
	console.log('gymname received:', gymname);

	const gymData = await FetchGymData(gymname);

	if (!gymData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<h1 className="text-2xl font-bold text-red-500">Gym not found</h1>
			</div>
		);
	}

	return (
		<>
			<GymStructuredData gymData={gymData as unknown as GymData} />
			<div>
				<Gym gymData={gymData} />
			</div>
		</>
	);
};

// Add global revalidation
export const revalidate = 3600; // Revalidate all pages every hour

// Add metadata for SEO
export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const gymData = await FetchGymData(params.gymname);
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymnavigator.in';
	const gymUrl = `${siteUrl}/gym/${encodeURIComponent(params.gymname)}`;
	const ogImage = gymData?.img || '/gymnavigator-og.jpg';
	const title = gymData?.name
		? `${gymData.name} – Modern Gym Management | GymNavigator`
		: 'Gym – Modern Gym Management | GymNavigator';
	const description = gymData?.address
		? `Visit ${gymData.name} at ${gymData.address}. Join the best fitness experience with GymNavigator.`
		: 'Professional fitness center powered by GymNavigator.';

	return {
		title,
		description,
		alternates: {
			canonical: gymUrl,
		},
		openGraph: {
			title,
			description,
			url: gymUrl,
			siteName: 'GymNavigator',
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: gymData?.name || 'GymNavigator - Modern Gym Management',
					type: 'image/jpeg',
				},
			],
			locale: 'en_US',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
			},
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
		other: {
			'og:image:secure_url': `${siteUrl}/gymnavigator-og.jpg`,
			'theme-color': '#1e40af',
			'msapplication-TileColor': '#1e40af',
		},
	};
}

export default GymPage;
