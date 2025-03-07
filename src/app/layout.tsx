import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Average } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const averageFont = Average({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-average',
});

export const metadata: Metadata = {
  title: "Clifford Classroom",
  description: "A platform for learning and teaching - AI-powered educational resources for modern educators",
  keywords: "education, AI tools, teaching resources, classroom management, lesson planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${averageFont.variable} font-sans antialiased text-gray-800 leading-relaxed bg-gray-50`}>
      <body className="bg-tan">
        <div className="min-h-screen flex">
          <Navigation />
          <main className="flex-1 ml-64 min-h-screen relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
