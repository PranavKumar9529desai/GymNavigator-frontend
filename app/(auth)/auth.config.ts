import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import type { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import SignupSA from '../(common)/_actions/signup/SignUpWithCrendentails';
import getUserByEmail, { type userType } from '../(common)/_actions/signup/getUserByEmail';
import type { GymInfo, Rolestype } from '../types/next-auth';

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

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

    if (!userFromDB || !('password' in userFromDB)) {
      throw createError('User not found', 'USER_NOT_FOUND');
    }

    const isPasswordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!isPasswordMatch) {
      throw createError('Invalid password', 'INVALID_PASSWORD');
    }

    return {
      id: userFromDB.id,
      name: userFromDB.name,
      email: userFromDB.email,
      role: userFromDB.role as Rolestype,
      gym: userFromDB.gym
        ? {
            gym_name: userFromDB.gym.gym_name,
            id: String(userFromDB.gym.id),
          }
        : undefined,
    };
  },

  // Handle sign-up attempt
  async handleSignUp(role: string, name: string, email: string, password: string): Promise<User> {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      throw createError('User already exists', 'USER_EXISTS');
    }

    const response = await SignupSA(role, name, email, password);
    if (!response?.user?.id) {
      throw createError('Failed to create account', 'SIGNUP_FAILED');
    }

    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
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
          throw createError('Email and password are required', 'INVALID_CREDENTIALS');
        }

        const { email, password, name, role } = credentials as {
          email: string;
          password: string;
          name?: string;
          role?: string;
        };

        // Determine if this is sign-up or sign-in
        const isSignUp = Boolean(role && name);
        logger.log(`Attempting ${isSignUp ? 'sign-up' : 'sign-in'} for email:`, email);

        try {
          // Route to appropriate handler
          if (isSignUp && role && name) {
            return await authHandlers.handleSignUp(role, name, email, password);
          }
          return await authHandlers.handleSignIn(email, password);
        } catch (error) {
          logger.error('Authentication error:', error);
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
      // Simplified redirect logic
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async signIn({ user, account }) {
      // Only process special cases (like Google)
      if (account?.provider !== 'google' || !user?.email) {
        return true;
      }

      // Optimize by fetching user data only once for Google sign-in
      const userFromDb = await getUserByEmail(user.email);

      if (userFromDb && 'email' in userFromDb) {
        // Merge DB data with user profile
        Object.assign(user, {
          role: userFromDb.role as Rolestype,
          gym: userFromDb.gym
            ? {
                gym_name: userFromDb.gym.gym_name,
                id: String(userFromDb.gym.id),
              }
            : undefined,
          name: userFromDb.name,
          email: userFromDb.email,
        });
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Add user data to token on first creation
      if (user) {
        token.role = user.role;
        token.id = user.id;

        // Only include necessary data in token
        if (user.gym) {
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
        // Only attach gym data if it exists

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
