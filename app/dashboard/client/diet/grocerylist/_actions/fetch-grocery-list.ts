'use server';

import { z } from 'zod';

// Type for grocery items
export type GroceryItem = {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	isPurchased: boolean;
	categoryId: string;
};

// Schema for validating parameters
const FetchParamsSchema = z.object({
	userId: z.string(),
	weekId: z.string().optional(),
});

export async function fetchGroceryList(
	_params: z.infer<typeof FetchParamsSchema>,
) {
	try {
		// Validate input parameters

		// This would be replaced with actual database fetch
		// Mock data for demonstration
		const groceryItems: GroceryItem[] = [
			{
				id: '1',
				name: 'Chicken Breast',
				quantity: 500,
				unit: 'g',
				isPurchased: false,
				categoryId: 'proteins',
			},
			{
				id: '2',
				name: 'Brown Rice',
				quantity: 1,
				unit: 'kg',
				isPurchased: false,
				categoryId: 'carbs',
			},
			{
				id: '3',
				name: 'Broccoli',
				quantity: 2,
				unit: 'bunches',
				isPurchased: false,
				categoryId: 'vegetables',
			},
		];

		return { success: true, data: groceryItems };
	} catch (error) {
		console.error('Error fetching grocery list:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to fetch grocery list',
		};
	}
}
