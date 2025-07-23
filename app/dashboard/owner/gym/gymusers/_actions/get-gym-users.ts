'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { GymUsersApiResponse } from '../_components/GymUsersClient';

export async function getGymUsers(): Promise<GymUsersApiResponse> {
	const ownerAxios = await OwnerReqConfig();
	try {
		const response = await ownerAxios.get('/gymusers');
		if (response.status !== 200 || !response.data) {
			return {
				msg: response.data?.msg || 'Failed to fetch gym users',
				counts: { totalUsers: 0, totalTrainers: 0, totalClients: 0 },
				users: [],
				trainers: [],
			};
		}
		// Validate and return the response in the expected format
		const { msg, counts, users, trainers } = response.data;
		return {
			msg: typeof msg === 'string' ? msg : 'success',
			counts: {
				totalUsers:
					typeof counts?.totalUsers === 'number' ? counts.totalUsers : 0,
				totalTrainers:
					typeof counts?.totalTrainers === 'number' ? counts.totalTrainers : 0,
				totalClients:
					typeof counts?.totalClients === 'number' ? counts.totalClients : 0,
			},
			users: Array.isArray(users) ? users : [],
			trainers: Array.isArray(trainers) ? trainers : [],
		};
	} catch (error: unknown) {
		return {
			msg: error instanceof Error ? error.message : 'Unknown error',
			counts: { totalUsers: 0, totalTrainers: 0, totalClients: 0 },
			users: [],
			trainers: [],
		};
	}
}
