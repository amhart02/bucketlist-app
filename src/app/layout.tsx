import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import AuthNav from "@/components/auth/AuthNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bucket List App - Create & Track Your Life Goals",
  description:
    "A full-stack web application for creating, managing, and tracking personal bucket lists with authentication and a library of ideas.",
  keywords: ["bucket list", "goals", "tracking", "personal development", "life goals"],
  authors: [{ name: "Bucket List Team" }],
  openGraph: {
    title: "Bucket List App - Create & Track Your Life Goals",
    description: "Create, manage, and track your personal bucket lists. Browse 100+ pre-built ideas and mark your progress.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bucket List App",
    description: "Create and track your life goals with ease",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <nav className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    Bucket List
                  </a>
                </div>
                <AuthNav />
              </div>
            </div>
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
