import type { AdapterUser } from '@auth/core/adapters';
import type { Profile } from '@auth/core/types';
import type { Account, NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { signInWithCredentials } from '../(common)/_actions/auth/signin-with-credentials';
import { signUpWithCredentials } from '../(common)/_actions/auth/signup-with-credentials';
import { getUserByEmail } from '../(common)/_actions/auth/get-userinfo';
import { getGoogleSignupRole } from '../(common)/_actions/auth/google-role-server-action';
import { signInWithGoogle } from '../(common)/_actions/auth/signin-with-google';
import { checkUserExists } from '../(common)/_actions/auth/check-user-exists';
import { signUpWithGoogle } from '../(common)/_actions/auth/signup-with-google';
import type { Rolestype, GymInfo } from '@/lib/api/types';

// Extended User interface to include gymInfo property
interface ExtendedUser extends User {
	gymInfo?: GymInfo;
}

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// Centralized logger that respects environment
const logger = {
	log: (...args: unknown[]) => !isProduction && console.log(...args),
	error: (...args: unknown[]) => console.error(...args),
};

export default {
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		Credentials({
			credentials: {
				name: {},
				email: {},
				password: {},
				role: {},
			},
			async authorize(credentials): Promise<User | null> {
				if (!credentials?.email || !credentials?.password) {
					// Return null to trigger NextAuth's default error handling
					return null;
				}

				const { email, password, name, role } = credentials as {
					email: string;
					password: string;
					name?: string;
					role?: string;
				};

				// Determine if this is sign-up or sign-in
				const isSignUp = Boolean(role && name);

				try {
					// Route to appropriate server action
					if (isSignUp && role && name) {
						const signupResult = await signUpWithCredentials({ role: role as Rolestype, name, email, password });
						
						if (!signupResult.success || !signupResult.data) {
							// Log the error for debugging
							logger.error('Signup failed:', signupResult.error);
							
							// Return null to trigger NextAuth's default error handling
							return null;
						}

						const userData = signupResult.data;
						return {
							id: userData.user.id,
							name: userData.user.name,
							email: userData.user.email,
							role: userData.user.role as Rolestype,
						};
					}

					// Handle sign-in
					const signinResult = await signInWithCredentials({ email, password });
					console.log('🔐 [AuthConfig] signinResult:', signinResult);
					
					if (!signinResult.success || !signinResult.data) {
						// Log the error for debugging
						logger.error('Sign-in failed:', signinResult.error);
						
						// Return null to trigger NextAuth's default error handling
						return null;
					}

					const userData = signinResult.data;
					return {
						id: userData.user.id,
						name: userData.user.name,
						email: userData.user.email,
						role: userData.user.role as Rolestype,
						gym: userData.user.gym
							? {
									gym_name: userData.user.gym.gym_name,
									id: String(userData.user.gym.id),
								}
							: undefined,
					};
				} catch (error) {
					logger.error('Authentication error:', error);
					// Return null to trigger NextAuth's default error handling
					return null;
				}
			},
		}),

		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		GitHub,
	],

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 7 * 24 * 60 * 60, // 7 days
	},

	cookies: {
		sessionToken: {
			name: 'next-auth.session-token',
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: isProduction,
			},
		},
	},

	callbacks: {
		async redirect({ url, baseUrl }) {
			// First, handle relative URLs properly
			if (url.startsWith('/')) {
				// For relative URLs, check if they contain role parameter in the query string
				if (url.includes('?') && url.includes('role=')) {
					const [path, query] = url.split('?');
					const params = new URLSearchParams(query);
					const role = params.get('role');

					if (role) {
						params.delete('role');
						const newQuery = params.toString();
						return `${baseUrl}${path}${newQuery ? `?${newQuery}` : ''}`;
					}
				}
				// If no processing needed, return the URL joined with baseUrl
				return `${baseUrl}${url}`;
			}

			// For absolute URLs, we can use the URL constructor safely
			try {
				const urlObj = new URL(url);

				// Only process URLs from the same origin
				if (urlObj.origin === baseUrl) {
					const role = urlObj.searchParams.get('role');
					if (role) {
						urlObj.searchParams.delete('role');
						return urlObj.toString();
					}
				}

				// Default: if same origin, return the URL, otherwise return baseUrl
				return urlObj.origin === baseUrl ? url : baseUrl;
			} catch (error) {
				console.error('Error processing redirect URL:', error);
				return baseUrl;
			}
		},

		async signIn(params: {
			user: User | AdapterUser;
			account: Account | null;
			profile?: Profile;
			email?: { verificationRequest?: boolean };
			credentials?: Record<string, unknown>;
		}) {
			const { user, account, profile } = params;
			logger.log('user is received from the signin callback', user);

			// Only process special cases (like Google)
			if (!account || account.provider !== 'google' || !user?.email) {
				return true;
			}

			try {
				// Optimize by fetching user data only once for Google sign-in
				const userFromDb = await getUserByEmail(user.email);
				logger.log('userFromDb is from the signin callback', userFromDb);

				// Handle the case where the user doesn't exist (needs signup)
				if (userFromDb.success && userFromDb.data && !userFromDb.data.exists) {
					logger.log('New Google user, creating account');

					// Get name from profile or user object
					const userName =
						user.name || profile?.name || profile?.given_name || 'Google User';

					// Get the role from the cookie
					const selectedRole = await getGoogleSignupRole();

					// If no role was found in the cookie, redirect to role selection page
					if (!selectedRole) {
						// Return a URL to redirect to role selection
						return '/selectrole';
					}

					logger.log('Signing up with Google:', {
						name: userName,
						email: user.email,
						role: selectedRole,
					});

					// Create a new user with Google signup
					const signupResult = await signUpWithGoogle(
						{ name: userName, email: user.email, role: selectedRole as Rolestype },
						selectedRole
					);

					logger.log('Google signup result:', signupResult);

					if (!signupResult.success) {
						logger.error('Failed to create Google user:', signupResult.error);
						return false;
					}

					// After successful signup, proceed with signin
					const response = await signInWithGoogle(user.email);

					if (response.success && response.data) {
						// Store the user data from the backend in the user object
						user.id = response.data.user.id;
						user.role = response.data.user.role as Rolestype;
						user.name = response.data.user.name;
						user.email = response.data.user.email;

						// Add custom properties for gym info
						(user as ExtendedUser).gymInfo = response.data.user.gym
							? {
									gym_name: response.data.user.gym.gym_name,
									id: String(response.data.user.gym.id),
								}
							: undefined;

						return true;
					}

					return false;
				}

				// Handle the case where the user exists
				if (userFromDb.success && userFromDb.data && userFromDb.data.exists) {
					const response = await signInWithGoogle(user.email);

					if (response.success && response.data) {
						// Store the user data from the backend in the user object
						user.id = response.data.user.id;
						user.role = response.data.user.role as Rolestype;
						user.name = response.data.user.name;
						user.email = response.data.user.email;

						// Add custom properties for gym info
						(user as ExtendedUser).gymInfo = response.data.user.gym
							? {
									gym_name: response.data.user.gym.gym_name,
									id: String(response.data.user.gym.id),
								}
							: undefined;

						return true;
					}

					return false;
				}

				// Handle other error cases
				logger.error('User lookup failed:', userFromDb.error);
				return false;
			} catch (error) {
				logger.error('Google sign-in error:', error);
				return false;
			}
		},

		async jwt({ token, user, trigger, session }) {
			// Add user data to token on first creation
			if (user) {
				token.role = user.role;
				token.id = user.id;
				token.sub = user.id; // Ensure sub is set to our database ID

				// Handle gym info from custom property for Google auth
				if ((user as ExtendedUser).gymInfo) {
					token.gym = (user as ExtendedUser).gymInfo;
				}
				// Regular credential flow
				else if (user.gym) {
					token.gym = {
						gym_name: user.gym.gym_name,
						id: String(user.gym.id),
					};
				}
			}

			// Handle session updates
			if (trigger === 'update' && session) {
				return { ...token, ...session };
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				// Structure session according to the defined type
				session.user.id = token.sub as string;
				session.role = token.role as Rolestype;
				session.gym = token.gym as GymInfo;

				// Only attach access token if it exists
				if (token.accessToken) {
					session.accessToken = token.accessToken as string;
				}
			}
			return session;
		},
	},

	trustHost: true,
	pages: {
		signIn: '/signin',
		error: '/auth/error',
	},
	debug: !isProduction,
} satisfies NextAuthConfig;
