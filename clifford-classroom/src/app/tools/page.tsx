import Link from 'next/link';

export default function Tools() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Tools</h1>
          <nav className="mt-4">
            <Link href="/" className="text-blue-500 hover:underline">Home</Link>
          </nav>
        </div>
      </header>
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold">Tool Categories</h2>
        <ul className="mt-4">
          <li><Link href="/tools/worksheet/reading-comprehension" className="text-blue-500 hover:underline">Reading Comprehension</Link></li>
        </ul>
      </section>
    </main>
  );
} 