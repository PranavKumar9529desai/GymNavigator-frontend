import type { AdapterUser } from "@auth/core/adapters";
import type { Profile } from "@auth/core/types";
import type { Account, NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import SignupSA from "@/app/(common)/_actions/auth/signup-with-credentials";
import { getUserByEmail } from "../(common)/_actions/auth/get-userinfo";
import SigninSA from "../(common)/_actions/auth/signin-with-credentials";
import { checkUserExists } from "..//(common)/_actions/auth/check-user-exists";
import SigninGoogleSA from "..//(common)/_actions/auth/signin-with-google";
// Add import for Google signup
import SignupWithGoogle from "..//(common)/_actions/auth/signup-with-google";
import type { GymInfo, Rolestype } from "../types/next-auth";

// Import the relevant types from the auth client
import type {
  ApiResult,
  SigninResponseType,
  UserInfoResponse,
} from "@/lib/AxiosInstance/Signin/sign-in-client";

// Extended User interface to include gymInfo property
interface ExtendedUser extends User {
  gymInfo?: GymInfo;
}

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

    const result = await SigninSA(email, password);

    if (!result.success || !result.data) {
      throw createError(
        result.error?.message || "Failed to login",
        result.error?.code || "LOGIN_FAILED"
      );
    }

    const userData = result.data;
    console.log("User data from signin handler", userData);

    return {
      id: userData.user.id,
      name: userData.user.name,
      email: userData.user.email,
      role: userData.user.role as Rolestype,
      gym: userData.user.gym
        ? {
            gym_name: userData.user.gym.name,
            id: String(userData.user.gym.id),
          }
        : undefined,
    };
  },

  // Handle sign-up attempt
  async handleSignUp(
    role: string,
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    console.log("signup handler is called");

    // Use the appropriate method from signup client instead
    const userExistsResult = await checkUserExists(email);
    if (userExistsResult.success && userExistsResult.data === true) {
      throw createError("User already exists", "USER_EXISTS");
    }

    const signupResult = await SignupSA(role, name, email, password);

    // Check if the API call was successful and contains data
    if (!signupResult.success || !signupResult.data) {
      throw createError(
        signupResult.error?.message || "Failed to create user",
        signupResult.error?.code || "SIGNUP_FAILED"
      );
    }

    // Extract the user data from the API result
    const userData = signupResult.data;
    console.log("User data from signup handler:", userData);

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
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
            "INVALID_CREDENTIALS"
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
          email
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
      const { user, account, profile } = params;
      console.log("user is received from the signin callback", user);

      // Only process special cases (like Google)
      if (!account || account.provider !== "google" || !user?.email) {
        return true;
      }

      try {
        // Optimize by fetching user data only once for Google sign-in
        const userFromDb: ApiResult<UserInfoResponse> = await getUserByEmail(
          user.email
        );
        
        console.log("userFromDb is from the signin callback", userFromDb);

        // Handle the case where the user doesn't exist (needs signup)
        if (!userFromDb.success && userFromDb.error?.code === "USER_NOT_FOUND") {
          console.log("New Google user, creating account");
          
          // Get name from profile or user object
          const userName = user.name || 
            (profile?.name || profile?.given_name || "Google User");
          
          // Allow role to be undefined so existing application logic handles role assignment
          const defaultRole: Rolestype | undefined = undefined;
          
          // Create a new user with Google signup
          const signupResult = await SignupWithGoogle(
            userName,
            user.email,
            defaultRole
          );
          
          console.log("Google signup result:", signupResult);
          
          if (!signupResult.success) {
            logger.error("Failed to create Google user:", signupResult.error);
            return false;
          }
          
          // After successful signup, proceed with signin
          const response = await SigninGoogleSA(user.email);
          
          if (response.success && response.data) {
            // Store the user data from the backend in the user object
            user.id = response.data.user.id;
            user.role = response.data.user.role as Rolestype;
            user.name = response.data.user.name;
            user.email = response.data.user.email;

            // Add custom properties for gym info
            (user as ExtendedUser).gymInfo = response.data.user.gym
              ? {
                  gym_name: response.data.user.gym.name,
                  id: String(response.data.user.gym.id),
                }
              : undefined;
            
            return true;
          }
          
          return false;
        } else if (userFromDb?.success) {
          const response: ApiResult<SigninResponseType> = await SigninGoogleSA(
            user.email
          );
          console.log("response is from the signin with google", response);

          if (response.success && response.data) {
            // Store the user data from the backend in the user object
            // This will be available in the JWT callback
            user.id = response.data.user.id;
            user.role = response.data.user.role as Rolestype;
            user.name = response.data.user.name;
            user.email = response.data.user.email;

            // Add custom properties for gym info
            (user as ExtendedUser).gymInfo = response.data.user.gym
              ? {
                  gym_name: response.data.user.gym.name,
                  id: String(response.data.user.gym.id),
                }
              : undefined;
            
            return true;
          }
          
          return false;
        } else {
          // Handle other error cases
          logger.error("User lookup failed:", userFromDb.error);
          return false;
        }
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
