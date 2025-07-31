import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrainerAuthForm from './_components/trainer-auth-form';
import { fetchGymById } from './_actions/fetch-gym-by-id';

export const metadata: Metadata = {
	title: 'Trainer Authentication | GymNavigator',
	description: 'Enter your authentication token to join the gym',
};

interface TrainerAuthPageProps {
	params: Promise<{ gymid: string }>;
	searchParams: Promise<{ gymname?: string; hash?: string }>;
}

export default async function TrainerAuthPage({ params, searchParams }: TrainerAuthPageProps) {
	const { gymid } = await params;
	const { gymname, hash } = await searchParams;

	// Fetch gym data to ensure it exists
	const gym = await fetchGymById(gymid);
	if (!gym) {
		notFound();
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
			<div className="w-full max-w-md">
				<div className="flex items-center justify-center gap-2 p-3 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<p className="text-sm font-medium">
						Trainer Authentication for{' '}
						<span className="rounded-md capitalize font-semibold">
							{gymname || gym.name}
						</span>
					</p>
				</div>
				<TrainerAuthForm gym={gym} />
			</div>
		</div>
	);
} 