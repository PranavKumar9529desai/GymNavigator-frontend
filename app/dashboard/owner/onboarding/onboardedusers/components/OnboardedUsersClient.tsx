'use client';

import OnboardedUsers from '../OnbordedUsers';
import type { OnBordingUser } from '../actions/GetOnBoardingUser';
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
	if (!initialData) {
		return <Loading />;
	}

	if (!initialData.users) {
		return (
			<div className="text-center p-6">
				<p className="text-red-500">An error occurred while fetching data.</p>
				<p className="text-gray-500 text-sm mt-2">Please try again later.</p>
			</div>
		);
	}

	const transformedUsers =
		initialData.users?.map((user: OnBordingUser) => ({
			id: user.id,
			name: user.name,
			startDate: user.startDate ? new Date(user.startDate) : null,
			endDate: user.endDate ? new Date(user.endDate) : null,
		})) ?? [];

	return <OnboardedUsers initialUsers={transformedUsers} />;
}
