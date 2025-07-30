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
				await signIn('google', {
					redirect: true,
					callbackUrl: '/dashboard',
				});
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