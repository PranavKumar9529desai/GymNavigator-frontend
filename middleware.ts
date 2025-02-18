import NextAuth from "next-auth";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./app/(auth)/auth.config";
import { IsOwner } from "./lib/isGymOwner";
import { IsTrainer } from "./lib/isTrainer";
/**
 * Public routes that are accessible without authentication
 * @type {string[]}
 */
const publicRoutes: string[] = []; // Remove "/" from public routes

/**
 * Prefix for all authentication-related API routes
 * @type {string}
 */
const ApiRoutesPrefix: string = "/api/auth";

/**
 * Routes used for authentication purposes (login/signup)
 * @type {string[]}
 */
const AuthRoutes: string[] = ["/signin", "/signup"];

/**
 * Protected routes that require authentication and specific roles
 * @type {string[]}
 */
const ProtectedRoutes: string[] = ["/owner", "/trainer", "/sales"];

const { auth } = NextAuth(authConfig);

/**
 * Middleware function to handle authentication and authorization
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object with appropriate redirects or access
 */

export default auth(async function middleware(request) {
  const { nextUrl } = request;
  const session = request.auth as Session | null; // Use auth session instead of getToken

  /**
   * Check if the user is currently logged in
   * @type {boolean}
   */
  const isLoggedIn = !!session;

  /**
   * Route type checks
   * @type {boolean}
   */
  const isApiRoute = nextUrl.pathname.startsWith(ApiRoutesPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = ProtectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

  // Allow API routes to pass through
  if (isApiRoute) return NextResponse.next();

  /**
   * Handle authentication routes (signin/signup)
   * Redirect to role-specific dashboard if already authenticated
   */
  if (isAuthRoute) {
    if (isLoggedIn && session?.role) {
      return NextResponse.redirect(
        new URL(`/${session.role}dashboard`, nextUrl)
      );
    }
    return NextResponse.next();
  }

  // Allow access to public routes
  if (isPublicRoute) return NextResponse.next();

  /**
   * Handle protected routes with role-based access control
   */
  if (isProtectedRoute) {
    // Redirect to signin if not authenticated
    if (!isLoggedIn || !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Redirect to role selection only if the role in the token is empty if no role is assigned
    if (!session?.role) {
      return NextResponse.redirect(new URL("/selectrole", request.url));
    }

    // Updated gym check to use the new GymInfo type
    if (session.role === "trainer" && !session.gym) {
      console.log("middleware redirects are this and it trainer", session.gym);
      return NextResponse.redirect(new URL("/selectgym", request.url));
    }

    /**
     * Check role-based access permissions
     * Redirect to unauthorized page if role doesn't match the route
     */
    const path = request.nextUrl.pathname;
    if (
      (path.startsWith("/owner") && !IsOwner(session)) ||
      (path.startsWith("/trainer") && !IsTrainer(session))
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  }
});

/**
 * Matcher configuration for the middleware
 * Excludes specific paths from middleware processing
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
