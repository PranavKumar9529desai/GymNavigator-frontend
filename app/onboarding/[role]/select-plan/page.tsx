import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { getGymPlans } from './_actions/get-gym-plans';
import { PlanSelectionClient } from './_components/PlanSelectionClient';
import { ErrorState } from './_components/ErrorState';

interface PageProps {
	searchParams: {
		gymname?: string;
		gymid?: string;
		hash?: string;
	};
}

export default async function SelectPlanPage({ searchParams }: PageProps) {
	const session = await auth();

	if (!session?.user?.id) {
		redirect('/signin');
	}

	const { gymname, gymid, hash } = searchParams;

	if (!gymid || !hash) {
		return (
			<ErrorState
				errorMessage="Missing required gym information. Please scan a valid QR code."
				gymName={gymname || null}
				gymId={gymid || null}
				hash={hash || null}
			/>
		);
	}

	try {
		const gymPlansData = await getGymPlans(gymid, hash);

		if (!gymPlansData) {
			return (
				<ErrorState
					errorMessage="Failed to fetch gym plans. Please try again."
					gymName={gymname || null}
					gymId={gymid || null}
					hash={hash || null}
				/>
			);
		}

		return (
			<PlanSelectionClient
				gym={gymPlansData.gym}
				plans={gymPlansData.plans}
				gymname={gymname || gymPlansData.gym.name}
				gymid={gymid}
				hash={hash}
			/>
		);
	} catch (error) {
		return (
			<ErrorState
				errorMessage={
					error instanceof Error ? error.message : 'Failed to fetch gym plans'
				}
				gymName={gymname || null}
				gymId={gymid || null}
				hash={hash || null}
			/>
		);
	}
}
