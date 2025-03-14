import { AppProvider } from '@/context/AppContext';
import { Metadata } from 'next';
import { Average } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import NavBar from '@/components/NavBar';
import SessionProvider from '@/providers/SessionProvider';
import './globals.css';
import './lists.css';

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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${averageFont.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={`${averageFont.className}`}>
        <SessionProvider>
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
        </SessionProvider>
        <Analytics />
        {/* Debug viewport element */}
        <div id="viewport-debug" style={{
          position: 'fixed',
          bottom: '5px',
          left: '5px',
          fontSize: '10px',
          color: '#999',
          background: 'rgba(255,255,255,0.7)',
          padding: '2px 5px',
          zIndex: 9999,
          display: 'none',
        }}>
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Only display in development
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
              const debugElement = document.getElementById('viewport-debug');
              debugElement.style.display = 'block';
              function updateViewportSize() {
                debugElement.innerText = 'viewport: ' + window.innerWidth + 'x' + window.innerHeight;
              }
              window.addEventListener('resize', updateViewportSize);
              updateViewportSize();
            }
          `
        }} />
      </body>
    </html>
  );
}
