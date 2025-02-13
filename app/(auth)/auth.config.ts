import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
import type { User } from 'next-auth';
import type { Account } from 'next-auth';
import type { Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import SignupSA from '../(common)/actions/signup/SignUpWithCrendentails';
import getUserByEmail, {
  type userType,
} from '../(common)/actions/signup/getUserByEmail';
import type { Rolestype } from '../types/next-auth';
export default {
  providers: [
    Credentials({
      credentials: {
        name: {},
        email: {},
        password: {},
        role: {},
      },
      async authorize(
        credentials: Partial<
          Record<'name' | 'email' | 'password' | 'role', unknown>
        >
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password, name, role } = credentials as {
          email: string;
          password: string;
          name?: string;
          role?: string;
        };

        console.log(
          'credentials received from the signin are ',
          email,
          password,
          name,
          role
        );

        if (email && password) {
          const userFromDB: userType | false = await getUserByEmail(email);
          console.log('user from the db', userFromDB);

          if (
            userFromDB &&
            userFromDB.name &&
            userFromDB.email &&
            userFromDB.role
          ) {
            const isPasswordMatch = await bcrypt.compare(
              password,
              userFromDB.password
            );
            console.log(
              'user from the backend from the credentails provider',
              userFromDB
            );
            if (isPasswordMatch) {
              return {
                id: email,
                name: userFromDB.name,
                email: userFromDB.email,
                role: userFromDB.role as Rolestype,
                gym: userFromDB.gym, // Using consistent gym type from backend
              };
            }
          } else if (role && name) {
            const response = await SignupSA(role, name, email, password);
            if (response.user && response.user.name && response.user.email) {
              return {
                id: email,
                name: response.user.name,
                email: response.user.email,
                role: role as Rolestype,
              };
            }
          }
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub,
  ],
  // TODO once the gym is created then add the gym details to the sesstion

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      const productionDomain = 'https://admin.gymnavigator.in';

      // Always use the custom domain in production
      if (process.env.NODE_ENV === 'production') {
        // Handle relative paths
        if (url.startsWith('/')) {
          return `${productionDomain}${url}`;
        }

        return productionDomain;
      }

      return url.startsWith('/') ? `${baseUrl}${url}` : url;
    },
    async signIn({ user, account }) {
      if (account && account.provider === 'google') {
        if (user && user.email) {
          console.log('user before the google signin', user);
          const userFromDb: userType | false = await getUserByEmail(user.email);
          console.log('user from the backend', userFromDb);
          if (userFromDb && userFromDb.email) {
            // Modify the user object to include role and gym from DB
            Object.assign(user, {
              role: userFromDb.role as Rolestype,
              gym: userFromDb.gym,
              name: userFromDb.name,
              email: userFromDb.email,
            });
            console.log('the user returned by the google signin', user);
            return true;
          }
          // Allow new Google users to sign up
          return true;
        }
        return false;
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User;
      account?: Account | null;
      profile?: Profile;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: Session;
    }) {
      console.log('user is this from jwt callback', user);
      console.log('JWT Callback - Input:', {
        tokenEmail: token.email,
        userName: user?.name,
        trigger,
        sessionData: session,
      });

      if (account && user) {
        token.accessToken = account.access_token;
      }

      if (trigger === 'update') {
        token.gym = session?.gym;
        if (!token.role) {
          token.role = session?.user?.role || session?.role;
        }
      }

      if (user && user.email && user.name) {
        token.role = user.role;
        token.gym = user.gym;
      }

      console.log('JWT Callback - Output:', token);
      return token;
    },
    async session({ token, session }) {
      console.log('Session Callback - Input:', {
        tokenData: token,
        sessionData: session,
      });

      console.log('token from the session callback ', token);
      if (token && token.email && token.name && token.role) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.gym = token.gym as GymInfo;
        session.role = token.role as Rolestype;
        console.log('updated sesion from the session callback ', session);
        console.log('Session Callback - Output:', session);
        return session;
      }
      console.log('Session Callback - Output:', session);
      return session;
    },
  },
  trustHost: true,
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
