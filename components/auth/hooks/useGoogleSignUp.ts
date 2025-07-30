import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { storeGoogleSignupRole } from '@/app/(common)/_actions/auth/google-role-server-action';
import type { Rolestype } from '@/lib/api/types';

export function useGoogleSignUp() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleGoogleSignUp = async (selectedRole: Rolestype) => {
		if (!selectedRole) {
			toast.error('Role selection required', {
				description: 'Please select a role before continuing with Google',
			});
			return;
		}

		startTransition(async () => {
			const loadingToast = toast.loading('Connecting to Google...');

			try {
				// Store the role in a server-side cookie
				await storeGoogleSignupRole(selectedRole);

				// Pass the role as a state parameter to Google auth
				const result = await signIn('google', {
					redirect: false,
					callbackUrl: '/dashboard',
				});

				toast.dismiss();

				if (result?.error) {
					// Handle specific error cases
					if (result.error.includes('AccessDenied')) {
						toast.error('Account Already Exists', {
							description: 'This email is already registered. Please sign in instead.',
						});
						// Redirect to signin page after a short delay
						setTimeout(() => {
							router.push('/signin');
						}, 2000);
					} else {
						toast.error('Google sign-in failed', {
							description: 'Could not connect to Google. Please try again.',
						});
					}
				} else if (result?.url) {
					// Successful sign-in, redirect to the callback URL
					router.push(result.url);
				}
			} catch (error) {
				toast.dismiss();
				toast.error('Google sign-in failed', {
					description: 'Could not connect to Google. Please try again.',
				});
				console.error('Google sign-in error:', error);
			}
		});
	};

	return {
		handleGoogleSignUp,
		isPending,
	};
} 