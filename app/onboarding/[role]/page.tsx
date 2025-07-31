import type { Metadata } from 'next';
import WelcomePage from '../_components/welcome-page';
import { getEnrollmentStatus } from './_actions/get-enrollment-status';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Welcome to GymNavigator | Onboarding',
	description: 'Welcome to GymNavigator - Your Ultimate Gym Management Solution',
};

interface RoleProps {
	params: Promise<{ role: string }>;
}

export default async function OnboardingPage({ params }: RoleProps) {
	const { role } = await params;
	const enrollmentStatus = await getEnrollmentStatus(role);
	
	// If user is already enrolled in a gym, redirect to dashboard
	if (enrollmentStatus.isEnrolled) {
		redirect('/dashboard');
	}

	// Validate the role parameter
	const validRoles = ['owner', 'trainer', 'client'];
	if (!validRoles.includes(role)) {
		redirect('/onboarding/client');
	}

	// Show the welcome page
	return <WelcomePage role={role} />;
}
