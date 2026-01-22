import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { authOptions } from "./nextauth.config";
import { NextResponse } from "next/server";

/**
 * Get the current user session from NextAuth.
 * Wrapper around next-auth's getServerSession with our auth options.
 * 
 * @returns Promise resolving to the session object or null if not authenticated
 */
export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions);
}

/**
 * Require authentication middleware.
 * Returns the session if authenticated, or returns a 401 response if not.
 * 
 * @returns Promise resolving to session or NextResponse with 401 error
 * 
 * @example
 * ```ts
 * export async function GET() {
 *   const session = await requireAuth();
 *   if (session instanceof NextResponse) return session;
 *   // User is authenticated, proceed with logic
 * }
 * ```
 */
export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }
  
  return session;
}

/**
 * Get the current user ID from the session.
 * 
 * @returns Promise resolving to the user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return (session?.user as any)?.id || null;
}
