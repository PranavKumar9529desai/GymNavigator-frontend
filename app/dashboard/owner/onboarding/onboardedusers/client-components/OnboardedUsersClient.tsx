'use client';

import { useQuery } from '@tanstack/react-query';
import OnboardedUsers from '../OnbordedUsers';
import type { OnBordingUser } from '../actions/GetOnBoardingUser';
import { getOnboardingUsersServer } from '../actions/GetOnBoardingUser';
import Loading from '../loading';

interface OnboardedUsersClientProps {
	initialData?: {
		msg: string;
		users: OnBordingUser[];
	};
}

export default function OnboardedUsersClient({
	initialData,
}: OnboardedUsersClientProps) {
	// Use the query with initialData from the server
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['onboardedUsers'],
		queryFn: getOnboardingUsersServer,
		initialData,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 5, // 5 minutes
	});

	// Handle loading state
	if (isLoading) {
		return <Loading />;
	}

	// Handle error state
	if (isError) {
		console.error('Error fetching onboarding users:', error);
		return (
			<div className="text-center p-6">
				<p className="text-red-500">An error occurred while fetching data.</p>
				<p className="text-gray-500 text-sm mt-2">Please try again later.</p>
			</div>
		);
	}

	// Transform the data
	const transformedUsers =
		data?.users?.map((user: OnBordingUser) => ({
			id: user.id,
			name: user.name,
			startDate: user.startDate ? new Date(user.startDate) : null,
			endDate: user.endDate ? new Date(user.endDate) : null,
		})) ?? [];

	return <OnboardedUsers initialUsers={transformedUsers} />;
}
