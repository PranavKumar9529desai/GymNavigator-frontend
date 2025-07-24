import { IsOwner } from '@/lib/is-owner'; // Assuming path alias @/lib
import { IsTrainer } from '@/lib/is-trainer'; // Assuming path alias @/lib
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type React from 'react';
import { auth } from '../(auth)/auth';
import DashboardBottomNav from './_components/DashboardBottomNav';
import DashboardTopBar from './_components/DashboardTopBar';
import type { MenuItem } from './_components/menuItems';
import { getDashboardMenuItems } from './_components/use-dashboard-menu';
import Sidebar from './_components/sidebar';
// Import the preload function for performance improvement
import { preloadCommonIcons } from './_components/common-icons';
import { IsClient } from '@/lib/is-client';
import type { Metadata } from 'next';
import PostHogIdentify from './PostHogIdentify';

export async function generateMetadata(): Promise<Metadata> {
	const session = await auth();
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymnavigator.in';
	const role = session?.role || 'user';
	const gym = session?.gym || null;

	console.log('title from the dashboard layout is ', gym, role);
	let title = 'Dashboard | GymNavigator';
	let description = 'Access your personalized dashboard on GymNavigator.';

	if (role === 'owner') {
		title =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `Owner Dashboard  ${gym.gym_name} | GymNavigator`
				: 'Owner Dashboard | GymNavigator';
		description =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `Manage your gym (${gym.gym_name}) operations, trainers, and clients with GymNavigator.`
				: 'Manage your gym operations, trainers, and clients with GymNavigator.';
	} else if (role === 'trainer') {
		title =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `Trainer Dashboard  ${gym.gym_name} | GymNavigator`
				: 'Trainer Dashboard | GymNavigator';
		description =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `View and manage your clients, workouts, and attendance at ${gym.gym_name} with GymNavigator.`
				: 'View and manage your clients, workouts, and attendance with GymNavigator.';
	} else if (role === 'client') {
		title =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `Client Dashboard  ${gym.gym_name} | GymNavigator`
				: 'Client Dashboard | GymNavigator';
		description =
			gym && typeof gym === 'object' && 'gym_name' in gym
				? `Track your workouts, diet, and attendance at ${gym.gym_name} with GymNavigator.`
				: 'Track your workouts, diet, and attendance with GymNavigator.';
	}

	return {
		title,
		description,
		alternates: {
			canonical: `${siteUrl}/dashboard`,
		},
		robots: {
			index: false,
			follow: false,
			googleBot: {
				index: false,
				follow: false,
			},
		},
	};
}

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const headersList = await headers();
	const pathname = headersList.get('x-next-pathname') || ''; // Get pathname

	// 1. Authentication Check (Safeguard)
	if (!session) {
		redirect('/signin');
	}

	// 2. Role Selection Check
	if (!session.role) {
		// Allow access to role selection page itself if needed, otherwise redirect
		if (pathname !== '/selectrole') {
			// Adjust if role selection path is different
			redirect('/selectrole');
		}
		// If on selectrole page, prevent further rendering of dashboard layout
		return null; // Or render a minimal loading/message state
	}

	// 3 The User is not associated with any gym
	if (session.role &&  session.role !== "owner" && !session.gym) {
		console.log('User redirected to the /onboarding', session.role);

		redirect('/onboarding/');
	}
	// 3. Role-based Path Authorization & Base Redirection
	const role = session.role; // Use validated role

	switch (role) {
		case 'owner':
			if (pathname.startsWith('/dashboard/owner') && !IsOwner(session)) {
				redirect('/unauthorized');
			} else if (pathname === '/dashboard') {
				redirect('/dashboard/owner/');
			}
			break;

		case 'trainer':
			if (pathname.startsWith('/dashboard/trainer') && !IsTrainer(session)) {
				redirect('/unauthorized');
			}
			break;

		case 'client':
			if (pathname.startsWith('/dashboard/client') && !IsClient(session)) {
				redirect('/unauthorized');
			}
			break;

		default:
			// Handle other roles or default cases if necessary
			break;
	}
	// Note: Client role access is implicitly allowed if not owner/trainer path

	// Trainer-specific checks (like gym selection) are moved to trainer layout

	// Get menu items efficiently using the optimized function
	const menuItems = getDashboardMenuItems(role);

	// This is a no-op at runtime but helps with bundling optimization
	// It ensures common icons are available immediately for faster rendering
	preloadCommonIcons();

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Identify user for PostHog */}
			{session?.user?.id && (
				<PostHogIdentify
					userId={session.user.id ?? undefined}
					email={session.user.email ?? undefined}
					name={session.user.name ?? undefined}
					role={session.role}
					gym={session.gym}
				/>
			)}
			{/* Server-rendered sidebar - visible only on desktop */}
			<div className="hidden md:block h-screen">
				<Sidebar menuItems={menuItems} />
			</div>

			{/* Removed overflow-hidden to allow sticky positioning below */}
			<div className="w-full flex flex-col">
				{/* Main content area with proper height calculations */}
				<div className="flex-1 overflow-y-auto scroll-container relative pb-16 md:pb-0">
					{/* Original Topbar (conditionally rendered for mobile) */}
					{/* The Topbar component itself now handles the sticky behavior */}
					<DashboardTopBar />

					{/* Original Content */}
					<div className="container mx-auto px-2 py-4 md:py-6 max-w-7xl">
						<ViewTransition >{children}</ViewTransition>
					</div>
				</div>
			</div>

			{/* Bottom navigation - visible only on mobile */}
			<div className="md:hidden">
				<DashboardBottomNav />
			</div>
		</div>
	);
}
