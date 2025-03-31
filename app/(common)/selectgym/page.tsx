import SelectGym from '@/app/(common)/selectgym/_components/SelectGym';
import React from 'react';
import FetchallGyms from './_actions/FetchallGyms';

// Prevent static generation
export const dynamic = 'force-dynamic';

export default async function Page() {
	const gyms: gym[] | [] = await FetchallGyms();
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-4">Select Your Gym</h1>
			<SelectGym gyms={gyms} />
		</div>
	);
}
