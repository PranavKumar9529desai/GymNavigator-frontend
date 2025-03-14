import * as z from 'zod';

/**
 * Registration form schema with validation rules
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .max(40, { message: 'Email must be at most 40 characters.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .max(40, { message: 'Password must be at most 40 characters.' }),
  name: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters.' })
    .max(40, { message: 'Username must be at most 40 characters.' }),
  role: z.enum(['owner', 'trainer', 'client'], {
    required_error: 'Please select a role',
  }),
});

// Type for use with useForm
export type RegisterFormValues = z.infer<typeof registerSchema>;
