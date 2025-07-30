import { z } from 'zod';

export const registerSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name must be less than 50 characters'),
	email: z
		.string()
		.email('Please enter a valid email address')
		.min(1, 'Email is required'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
			message: 'Password must contain uppercase, lowercase, number, and special character',
		}),
	role: z.enum(['owner', 'trainer', 'client'], {
		required_error: 'Please select a role',
	}),
});

export type RegisterFormValues = z.infer<typeof registerSchema>; 