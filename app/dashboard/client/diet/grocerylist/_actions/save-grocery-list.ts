'use server';

import { auth } from '@/app/(auth)/auth';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { z } from 'zod';

// Schema for validating parameters
const SaveGroceryListParamsSchema = z.object({
	timeFrame: z.enum(['weekly', 'monthly']),
	groceryList: z.custom<GroceryListResponse>(
		(val) => val && typeof val === 'object' && 'categories' in val,
		{ message: 'Invalid grocery list format' },
	),
});

export type SaveGroceryListResult = {
	success: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: Type definition will be added later
	savedList?: any;
	error?: string;
};

/**
 * Save a generated grocery list to the database
 */
export async function saveGroceryList(
	params: z.infer<typeof SaveGroceryListParamsSchema>,
): Promise<SaveGroceryListResult> {
	try {
		const { timeFrame, groceryList } =
			SaveGroceryListParamsSchema.parse(params);
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: 'User not authenticated' };
		}

		// Save the grocery list to the backend
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.post('/diet/grocerylist', {
			timeFrame,
			groceryList,
		});
		console.log('response from save grocery list', response);
		if (!response.data?.success) {
			return {
				success: false,
				error: response.data?.error || 'Failed to save grocery list',
			};
		}

		return {
			success: true,
			savedList: response.data.data,
		};
	} catch (error) {
		console.error('Error in saveGroceryList:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}
