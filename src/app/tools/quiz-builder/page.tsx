import Link from "next/link";

export default function QuizBuilder() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 font-average space-y-6">
      <h1 className="text-4xl font-bold text-brand-green">Quiz Builder</h1>
      <p className="text-lg text-gray-700 mb-6">This tool is under development.</p>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">What This Tool Will Do</h2>
        <p className="text-gray-700">Quickly generate multiple-choice quizzes on any topic, complete with instant answer keys and explanations for each question.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">Why It Matters</h2>
        <p className="text-gray-700">Assessments are essential for learning, but writing good questions takes time. This tool will help teachers check for understanding in minutes, not hours.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">How It&apos;ll Work</h2>
        <p className="text-gray-700">Type in your topic or standards, and the tool will generate a ready-to-use quiz you can print or share digitally.</p>
      </section>
      <Link href="/tools" className="inline-block bg-brand-green text-white px-4 py-2 rounded hover:bg-brand-green-dark font-semibold">&larr; Back to Tools</Link>
    </main>
  );
} 