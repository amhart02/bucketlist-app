"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50">
      <main className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Create Your Bucket List
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Document your life goals and dreams. Track your progress. Get inspired by our library of ideas.
        </p>
        
        <div className="flex gap-4 items-center justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 text-white px-8 py-3 text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border-2 border-gray-300 text-gray-700 px-8 py-3 text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Create Multiple Lists</h3>
            <p className="text-gray-600">
              Organize your goals by theme - travel, learning, personal growth, and more.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
            <p className="text-gray-600">
              Mark items as complete and watch your completion percentage grow.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Get Inspired</h3>
            <p className="text-gray-600">
              Browse our library of 100+ curated ideas across 5 categories.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
