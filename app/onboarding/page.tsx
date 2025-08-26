import type { Rolestype } from '@/types/next-auth';
import { redirect } from 'next/navigation';
import { auth } from '../(auth)/auth';
import NotOnboarded from '../dashboard/_components/not-onboarded/not-onboarded';

export default async function onboardingPage() {
	const session = await auth();
	if (!session || !session?.role) {
		redirect('/signin');
	}

	const Role: Rolestype = session?.role;
	return <NotOnboarded role={Role} />;
}
