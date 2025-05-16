import Link from "next/link";

export default function PosterGenerator() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 font-average space-y-6">
      <h1 className="text-4xl font-bold text-brand-green">Poster Generator</h1>
      <p className="text-lg text-gray-700 mb-6">This tool is under development.</p>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">What This Tool Will Do</h2>
        <p className="text-gray-700">Design eye-catching classroom posters and visual aids in minutes, using your own text or templates for common classroom needs.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">Why It Matters</h2>
        <p className="text-gray-700">Visuals help reinforce learning and brighten up any classroom. This tool will make it easy for teachers to create professional posters without graphic design skills.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">How It&apos;ll Work</h2>
        <p className="text-gray-700">Choose a template or start from scratch, enter your content, and download a print-ready poster in seconds.</p>
      </section>
      <Link href="/tools" className="inline-block bg-brand-green text-white px-4 py-2 rounded hover:bg-brand-green-dark font-semibold">&larr; Back to Tools</Link>
    </main>
  );
} 