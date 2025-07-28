'use server';

import { auth } from '@/app/(auth)/auth';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface Plan {
	id: number;
	name: string;
	description?: string;
	price: string;
	duration: string;
	features: Array<{ id: number; description: string }>;
	planTimeSlots: Array<{ id: number; startTime: string; endTime: string }>;
	isFeatured?: boolean;
	color?: string;
	icon?: string;
	maxMembers?: number;
	currentMembers?: number;
	genderCategory: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
	minAge?: number;
	maxAge?: number;
}

interface GymData {
	id: number;
	name: string;
	logo: string;
}

interface GymPlansResponse {
	gym: GymData;
	plans: Plan[];
}

export async function getGymPlans(
	gymid: string,
	hash: string,
): Promise<GymPlansResponse | null> {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			throw new Error('Unauthorized');
		}

		if (!gymid || !hash) {
			throw new Error('Missing required parameters');
		}

		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.post('/gym/plans', { gymid, hash });
		console.log('plans are form the server ', response.data);

		if (response.status === 200 && response.data.success) {
			return response.data.data;
		}

		throw new Error(response.data.error || 'Failed to fetch gym plans');
	} catch (error) {
		console.error('Error fetching gym plans:', error);
		throw error;
	}
}
