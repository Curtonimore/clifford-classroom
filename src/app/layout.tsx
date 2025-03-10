import { AppProvider } from '@/context/AppContext';
import { Metadata } from 'next';
import { Average } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import NavBar from '@/components/NavBar';
import './globals.css';

const averageFont = Average({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-average',
});

export const metadata: Metadata = {
  title: 'Clifford Classroom',
  description: 'A platform for learning and teaching - AI-powered educational resources for modern educators',
  keywords: "education, AI tools, teaching resources, classroom management, lesson planning",
  icons: {
    icon: '/clifford-logo.svg',
    apple: '/clifford-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={averageFont.variable}>
      <body className={averageFont.className}>
        <AppProvider>
          <div className="app-container">
            <NavBar />
            <main className="content-container">
              {children}
            </main>
            <footer>
              <p>Clifford Classroom &copy; {new Date().getFullYear()} - Educational Resources for Modern Educators</p>
            </footer>
          </div>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
