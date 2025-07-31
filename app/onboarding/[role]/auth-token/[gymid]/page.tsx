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
	} catch (error) {
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
				{/* Gym Information Card */}
				<Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
					<CardHeader className="text-center pb-4">
						<div className="flex items-center justify-center mb-4">
							{gym.img ? (
								<Image
									src={gym.img}
									alt={`${gym.name} logo`}
									width={80}
									height={80}
									className="rounded-lg object-cover"
								/>
							) : (
								<div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
									<Building2 className="h-10 w-10 text-white" />
								</div>
							)}
						</div>
						<div className="space-y-2">
							<h1 className="text-xl font-bold text-slate-800">{gym.name}</h1>
							<Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
								Trainer Onboarding
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-center gap-4 text-xs text-slate-500">
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								<span>Gym ID: {gym.id}</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="h-3 w-3" />
								<span>Trainer Role</span>
							</div>
						</div>
					</CardContent>
				</Card>

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