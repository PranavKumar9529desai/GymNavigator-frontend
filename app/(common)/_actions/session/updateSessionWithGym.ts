'use client';

export async function updateSesionWithGym(
	gym: GymInfo,
	update: (data: unknown) => Promise<unknown>,
) {
	try {
		// Update the session using the passed update function
		const updateSession = await update({ gym: gym });
		// we will do a backend call pass down the role
		console.log(
			'updated the sessiion with thes session with the gym is ',
			updateSession,
			gym,
		);
		return { success: true };
	} catch (error) {
		console.error('Error updating session:', error);
		return { error: 'Failed to update session' };
	}
}
