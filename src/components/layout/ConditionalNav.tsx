"use client";

import { usePathname } from "next/navigation";
import AuthNav from "@/components/auth/AuthNav";

export default function ConditionalNav() {
  const pathname = usePathname();
  
  // Hide nav on landing, login, and register pages
  const hideNav = pathname === "/" || pathname === "/login" || pathname === "/register";

  if (hideNav) {
    return null;
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <span>Bucket List</span>
            </a>
          </div>
          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
