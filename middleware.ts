import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
import authConfig from './app/(auth)/auth.config';
import { IsOwner } from './lib/is-owner';
import { IsTrainer } from './lib/is-trainer';
/**
 * Public routes that are accessible without authentication
 * @type {string[]}
 */
const publicRoutes: string[] = ['/', '/about', '/contact', '/pricing'];

/**
 * Prefix for all authentication-related API routes
 * @type {string}
 */
const ApiRoutesPrefix: string = '/api/auth';

/**
 * Routes used for authentication purposes (login/signup)
 * @type {string[]}
 */
const AuthRoutes: string[] = ['/signin', '/signup'];

/**
 * Protected routes that require authentication and specific roles
 * @type {string[]}
 */
const ProtectedRoutes: string[] = ['/dashboard', '/settings', '/profile'];

/**
 * Main middleware function to handle authentication and authorization
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Check authentication status
  const isLoggedIn = !!session;

  // Check route types
  const isApiRoute = pathname.startsWith(ApiRoutesPrefix);
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isAuthRoute = AuthRoutes.some((route) => pathname === route);
  const isProtectedRoute = ProtectedRoutes.some((route) => pathname.startsWith(route));

  // 1. API Routes - Always pass through
  if (isApiRoute) {
    return NextResponse.next();
  }

  // 2. Authentication Routes (signin/signup)
  if (isAuthRoute) {
    // If user is already logged in, redirect to their role-specific dashboard
    if (isLoggedIn && session?.role) {
      return NextResponse.redirect(
        new URL(`/dashboard/${session.role.toLowerCase()}`, request.url),
      );
    }
    return NextResponse.next();
  }

  // 3. Public Routes - Always accessible
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 4. Protected Routes - Requires authentication
  if (isProtectedRoute) {
    // Not logged in - redirect to signin
    if (!isLoggedIn || !session) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Role selection required
    if (!session.role) {
      return NextResponse.redirect(new URL('/selectrole', request.url));
    }

    // Trainer needs to select a gym
    if (session.role === 'trainer' && !session.gym) {
      return NextResponse.redirect(new URL('/selectgym', request.url));
    }

    // Role-based access control for specific dashboard paths
    if (pathname.startsWith('/dashboard/owner')) {
      if (!IsOwner(session)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } else if (pathname.startsWith('/dashboard/trainer')) {
      if (!IsTrainer(session)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // If accessing general dashboard, redirect to role-specific dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(
        new URL(`/dashboard/${session.role.toLowerCase()}`, request.url),
      );
    }

    return NextResponse.next();
  }

  // 5. Default behavior - allow access to any other routes
  return NextResponse.next();
}

/**
 * Matcher configuration for the middleware
 * Excludes specific paths from middleware processing
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
