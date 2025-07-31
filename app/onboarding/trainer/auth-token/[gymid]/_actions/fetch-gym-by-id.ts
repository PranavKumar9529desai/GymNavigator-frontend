'use server';

import { auth } from '@/app/(auth)/auth';

interface Gym {
	id: string;
	name: string;
	img: string;
	description?: string;
}

export async function fetchGymById(gymId: string): Promise<Gym | null> {
	try {
		const session = await auth();
		if (!session?.accessToken) {
			return null;
		}

		const response = await fetch(`${process.env.BACKEND_URL}/api/gym/${gymId}`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.gym || null;
	} catch (error) {
		console.error('Error fetching gym:', error);
		return null;
	}
} 