import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import ConditionalNav from "@/components/layout/ConditionalNav";


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
          <ConditionalNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
