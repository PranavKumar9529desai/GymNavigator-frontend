import type { Rolestype } from '@/types/next-auth';
import { auth } from '../(auth)/auth';
import NotOnboarded from '../dashboard/_components/not-onboarded/not-onboarded';
import { redirect } from 'next/navigation';

export default async function onboardingPage() {
	const session = await auth();
	if (!session || !session?.role) {
		redirect('/signin');
	}

	const Role: Rolestype = session?.role;
	return <NotOnboarded role={Role} />;
}
