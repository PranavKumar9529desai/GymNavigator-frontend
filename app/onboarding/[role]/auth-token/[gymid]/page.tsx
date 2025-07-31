import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users } from 'lucide-react';
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

	// Try to fetch gym data, but don't fail if it doesn't work
	let gym = null;
	try {
		gym = await fetchGymById(gymid);
	} catch (_error) {
		console.log('Could not fetch gym details, using query parameters');
	}

	// Create fallback gym object if API call failed
	if (!gym) {
		gym = {
			id: gymid,
			name: gymname || 'Gym',
			img: '',
			phone: undefined,
			email: undefined
		};
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Gym Information Card - Improved Layout */}
				<div className="text-center space-y-4">
					{/* Gym Logo/Icon */}
					<div className="flex items-center justify-center">
						{gym.img ? (
							<Image
								src={gym.img}
								alt={`${gym.name} logo`}
								width={80}
								height={80}
								className="rounded-xl object-cover shadow-sm"
							/>
						) : (
							<div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
								<Building2 className="h-10 w-10 text-white" />
							</div>
						)}
					</div>
					
					{/* Gym Name and Badge */}
					<div className="space-y-3">
						<h1 className="text-2xl font-bold text-slate-800">{gym.name}</h1>
						<Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1">
							Trainer Onboarding
						</Badge>
					</div>
					
					{/* Gym Details */}
					<div className="flex items-center justify-center gap-6 text-sm text-slate-600">
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
								<MapPin className="h-3 w-3 text-slate-500" />
							</div>
							<span>Gym ID: {gym.id}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
								<Users className="h-3 w-3 text-slate-500" />
							</div>
							<span>Trainer Role</span>
						</div>
					</div>
				</div>

				{/* Authentication Form */}
				<Card>
					<CardHeader className="text-center pb-4">
						<div className="flex items-center justify-center gap-2 p-3 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
							<p className="text-sm font-medium">
								Enter your authentication token to join{' '}
								<span className="rounded-md capitalize font-semibold text-blue-600">
									{gym.name}
								</span>
							</p>
						</div>
					</CardHeader>
					<CardContent>
						<TrainerAuthForm gym={gym} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 