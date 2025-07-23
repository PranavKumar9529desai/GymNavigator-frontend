import { Suspense } from 'react';
import { getOnboardingUsersServer } from './_actions/GetOnBoardingUser';
import OnboardedUsersClient from './_components/OnboardedUsersClient';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export default async function Page() {
	const initialData = await getOnboardingUsersServer();

	return (
		<>
			<h1 className="text-3xl font-bold text-center pt-4">Onboarding Users</h1>
			<OnboardedUsersClient initialData={initialData} />
		</>
	);
}
