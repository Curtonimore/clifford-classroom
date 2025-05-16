import Link from "next/link";

export default function WorksheetMaker() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 font-average space-y-6">
      <h1 className="text-4xl font-bold text-brand-green">Worksheet Maker</h1>
      <p className="text-lg text-gray-700 mb-6">This tool is under development.</p>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">What This Tool Will Do</h2>
        <p className="text-gray-700">Generate printable worksheets and activities tailored to your topic, grade, or skill focus — ready to use in class or for homework.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">Why It Matters</h2>
        <p className="text-gray-700">Finding or creating quality practice materials is a daily challenge. This tool will help teachers provide targeted practice without the busywork.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-brand-green mb-2">How It&apos;ll Work</h2>
        <p className="text-gray-700">Describe your topic or select a grade, and the tool will instantly create a worksheet you can print or share.</p>
      </section>
      <Link href="/tools" className="inline-block bg-brand-green text-white px-4 py-2 rounded hover:bg-brand-green-dark font-semibold">&larr; Back to Tools</Link>
    </main>
  );
} 