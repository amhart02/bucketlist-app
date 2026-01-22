"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AuthNav() {
  const { data: session, status } = useSession();

  // Show loading skeleton while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // Show user menu only when authenticated with valid session
  if (status === "authenticated" && session && session.user && session.user.email) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">{session.user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-gray-700 hover:text-gray-900 font-medium"
        >
          Log Out
        </button>
      </div>
    );
  }

  // Default: show login/signup buttons
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-sm text-gray-700 hover:text-gray-900 font-medium"
      >
        Log In
      </Link>
      <Link
        href="/register"
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
}
