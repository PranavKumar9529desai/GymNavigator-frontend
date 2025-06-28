'use client';

import type { GymInfo } from "@/types/next-auth";

// Correctly named function
export async function updateSessionWithGym(
	gym: GymInfo,
	update: (data: unknown) => Promise<unknown>,
) {
	try {
		// Update the session using the passed update function
		const updateSession = await update({ gym: gym });
		// we will do a backend call pass down the role
		console.log(
			'Session updated with gym:',
			gym,
		);
		return { success: true };
	} catch (error) {
		console.error('Error updating session:', error);
		return { error: 'Failed to update session' };
	}
}

// Keep the misspelled function for backward compatibility, but have it call the correct one
export async function updateSesionWithGym(
	gym: GymInfo,
	update: (data: unknown) => Promise<unknown>,
) {
	// Call the correctly named function
	return updateSessionWithGym(gym, update);
}
