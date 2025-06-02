import './globals.css';

export const metadata = {
  title: 'Clifford Classroom',
  description: 'Educational tools and resources',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Clifford Classroom</h1>
          <nav className="flex gap-6">
            <a href="/" className="text-black hover:text-black text-sm font-medium">Home</a>
            <a href="/tools" className="text-black hover:text-black text-sm font-medium">Tools</a>
            <a href="/about" className="text-black hover:text-black text-sm font-medium">About</a>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
