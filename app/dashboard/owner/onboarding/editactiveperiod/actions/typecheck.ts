'use server';

import { z } from 'zod';

const UserValiditySchema = z
	.object({
		userId: z.number().int().positive(),
		startDate: z.date(),
		endDate: z.date(),
		shift: z.enum(['morning', 'evening']),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: 'End date must be after start date',
		path: ['endDate'],
	});

type UserValidityInput = z.infer<typeof UserValiditySchema>;

export const validateUserValidity = async (data: UserValidityInput) => {
	const result = UserValiditySchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			errors: result.error.formErrors.fieldErrors,
		};
	}
	return {
		success: true,
		data: result.data,
	};
};

console.log(UserValiditySchema);
