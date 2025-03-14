import type { AdapterUser } from "@auth/core/adapters";
import type { Profile } from "@auth/core/types";
import bcrypt from "bcryptjs";
import type { Account, NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import GetUserAndLogin, {
	type userType,
} from "../(common)/_actions/auth/get-userby-email";
import {
	type GetUserEmailResponse,
	getUserByEmail,
} from "../(common)/_actions/auth/get-userinfo";
import SigninSA, {
	type SigninResponseType,
} from "../(common)/_actions/auth/signin-with-credentials";
import SigninGoogleSA, {
	type SigninGoogleResponseType,
} from "../(common)/_actions/auth/signin-with-google";
import SignupSA, {
	type SignupResponseType,
} from "../(common)/_actions/auth/signup-with-credentials";
import type { GymInfo, Rolestype } from "../types/next-auth";

// Environment configuration
const isProduction = process.env.NODE_ENV === "production";

// Centralized logger that respects environment
const logger = {
	// biome-ignore lint/suspicious/noExplicitAny: Logger needs to accept any argument types
	log: (...args: any[]) => !isProduction && console.log(...args),
	// biome-ignore lint/suspicious/noExplicitAny: Logger needs to accept any argument types
	error: (...args: any[]) => console.error(...args),
};

// Centralized error handler
const createError = (message: string, errorCode: string) => {
	return new Error(JSON.stringify({ message, error: errorCode }));
};

// Auth handlers extracted for better organization
const authHandlers = {
	// Handle sign-in attempt
	async handleSignIn(email: string, password: string): Promise<User> {
		const userFromDB = await getUserByEmail(email);

		if (!userFromDB || !userFromDB.success) {
			throw createError("User not found", "USER_NOT_FOUND");
		}

		const response: SigninResponseType | null = await SigninSA(email, password);
		const NewUser = response?.user;
		if (!NewUser) {
			throw createError("Failed to login", "LOGIN_FAILED");
		}
		console.log("NewUser is from the signin handler", NewUser);
		return {
			id: NewUser?.id,
			name: NewUser?.name,
			email: NewUser?.email,
			role: NewUser?.role as Rolestype,
			gym: NewUser?.gym
				? {
						gym_name: NewUser.gym.name,
						id: String(NewUser.gym.id),
					}
				: undefined,
		};
	},

	// Handle sign-up attempt
	async handleSignUp(
		role: string,
		name: string,
		email: string,
		password: string,
	): Promise<User> {
		console.log("signup handler is called");
		const userExists = await getUserByEmail(email);
		if (userExists.success) {
			throw createError("User already exists", "USER_EXISTS");
		}

		const response: SignupResponseType | null = await SignupSA(
			role,
			name,
			email,
			password,
		);
		if (!response?.name || !response?.email) {
			throw createError("Failed to create account", "SIGNUP_FAILED");
		}
		console.log("response is from the signup handler", response);
		return {
			id: response.id,
			name: response.name,
			email: response.email,
			role: role as Rolestype,
		};
	},
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
					throw createError(
						"Email and password are required",
						"INVALID_CREDENTIALS",
					);
				}

				const { email, password, name, role } = credentials as {
					email: string;
					password: string;
					name?: string;
					role?: string;
				};
				console.log("credentials are", credentials);

				// Determine if this is sign-up or sign-in
				const isSignUp = Boolean(role && name);
				console.log(
					`Attempting ${isSignUp ? "sign-up" : "sign-in"} for email:`,
					email,
				);
				console.log("isSignUp is", isSignUp);
				try {
					// Route to appropriate handler
					if (isSignUp && role && name) {
						return await authHandlers.handleSignUp(role, name, email, password);
					}
					return await authHandlers.handleSignIn(email, password);
				} catch (error) {
					logger.error("Authentication error:", error);
					throw error;
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
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 7 * 24 * 60 * 60, // 7 days
	},

	cookies: {
		sessionToken: {
			name: "next-auth.session-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: isProduction,
			},
		},
	},

	callbacks: {
		async redirect({ url, baseUrl }) {
			// Simplified redirect logic
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},

		async signIn(params: {
			user: User | AdapterUser;
			account: Account | null;
			profile?: Profile;
			email?: { verificationRequest?: boolean };
			credentials?: Record<string, unknown>;
		}) {
			const { user, account } = params;
			console.log("user is received from the signin callback", user);

			// Only process special cases (like Google)
			if (!account || account.provider !== "google" || !user?.email) {
				console.log("the request went from here");
				return true;
			}

			try {
				// Optimize by fetching user data only once for Google sign-in
				const userFromDb: GetUserEmailResponse = await getUserByEmail(
					user.email,
				);
				console.log("userFromDb is from the signin callback", userFromDb);
				if (!userFromDb) {
					throw createError("User not found", "USER_NOT_FOUND");
				}

				if (userFromDb?.success) {
					const response: SigninGoogleResponseType | null =
						await SigninGoogleSA(user.email);
					console.log("response is from the sigin with google", response);

					if (response) {
						// Store the user data from the backend in the user object
						// This will be available in the JWT callback
						user.id = response.user.id;
						user.role = response.user.role as Rolestype;
						user.name = response.user.name;
						user.email = response.user.email;

						// Add custom properties for gym info
						(user as any).gymInfo = response.user.gym
							? {
									gym_name: response.user.gym.name,
									id: String(response.user.gym.id),
								}
							: undefined;
					}
				}

				return true;
			} catch (error) {
				logger.error("Google sign-in error:", error);
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
				if ((user as any).gymInfo) {
					token.gym = (user as any).gymInfo;
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
			if (trigger === "update" && session) {
				return { ...token, ...session };
			}
			console.log("token is from the jwt callback", token);
			return token;
		},

		async session({ session, token }) {
			console.log("token received from the session callback", token);
			if (token) {
				// Structure session according to the defined type
				session.user.id = token.sub as string;
				session.role = token.role as Rolestype;
				session.gym = token.gym as GymInfo;
				// Only attach gym data if it exists

				if (token.accessToken) {
					session.accessToken = token.accessToken as string;
				}
			}
			console.log("session from the sesion callback", session);
			return session;
		},
	},

	trustHost: true,
	pages: {
		signIn: "/signin",
		error: "/auth/error",
	},
	debug: !isProduction,
} satisfies NextAuthConfig;
