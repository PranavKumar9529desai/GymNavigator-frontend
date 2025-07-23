'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface AssignableUser {
	id: string;
	name: string;
	email: string;
	membershipStatus: 'active' | 'inactive';
	activeWorkoutPlanId: number | null;
	activeWorkoutPlanName: string | null;
	hasActiveWorkoutPlan: boolean;
}

export async function getAssignableUsers(): Promise<AssignableUser[]> {
	try {
		const trainerAxios = await TrainerReqConfig();
		const response = await trainerAxios.get('/client/assignedusers');

		if (response.data.msg === 'success' && Array.isArray(response.data.users)) {
			return response.data.users.map(
				(
					user: Omit<
						AssignableUser,
						'membershipStatus' | 'hasActiveWorkoutPlan'
					> & {
						activeWorkoutPlanId?: number | null;
						activeWorkoutPlanName?: string | null;
					},
				) => ({
					id: user.id,
					name: user.name,
					email: user.email,
					membershipStatus: 'active',
					activeWorkoutPlanId: user.activeWorkoutPlanId || null,
					activeWorkoutPlanName: user.activeWorkoutPlanName || null,
					hasActiveWorkoutPlan: !!user.activeWorkoutPlanId,
				}),
			);
		}

		return [];
	} catch (error) {
		console.error('Error fetching assignable users:', error);
		return [];
	}
}
