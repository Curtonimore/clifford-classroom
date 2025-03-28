import './globals.css'
import { average } from './fonts'
import Link from 'next/link'

export const metadata = {
  title: 'Clifford Classroom',
  description: 'Helping educators navigate teaching in the digital age',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${average.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Average&display=swap" rel="stylesheet" />
      </head>
      <body className={`${average.className} min-h-full flex flex-col`}>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Clifford Classroom" className="h-10 w-10" />
              <span className="ml-3 text-xl font-semibold text-brand">Clifford Classroom</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-brand hover:text-brand-light">Home</Link>
              <Link href="/about" className="text-brand hover:text-brand-light">About</Link>
              <Link href="/articles" className="text-brand hover:text-brand-light">Articles</Link>
              <Link href="/ai-tools" className="text-brand hover:text-brand-light">AI Teaching Tools</Link>
              <Link href="/resources" className="text-brand hover:text-brand-light">Resources</Link>
              <Link href="/support" className="text-brand hover:text-brand-light">Support</Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="bg-brand text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center">&copy; {new Date().getFullYear()} Clifford Classroom. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
