'use server';

import { VerifyAuthToken } from '../../_actions/VerifyAuthToken';
import type { gym } from '../../_components/SelectGym';

interface VerificationResult {
	success: boolean;
	message: string;
}

export async function verifyGymToken(
	gym: gym,
	authToken: string,
): Promise<VerificationResult> {
	try {
		const result = await VerifyAuthToken(gym, authToken);

		return {
			success: result.success,
			message: result.msg,
		};
	} catch (error) {
		console.error('Error in verifyGymToken:', error);
		return {
			success: false,
			message: 'Failed to verify authentication token',
		};
	}
}
