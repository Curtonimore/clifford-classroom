import Link from "next/link";

export default function LessonPlanner() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 font-average space-y-6">
      <h1 className="text-4xl font-bold text-darkgreen">Lesson Plan Generator</h1>
      <p className="text-lg text-gray-700 mb-6">This tool is under development.</p>
      <section>
        <h2 className="text-2xl font-semibold text-darkgreen mb-2">What This Tool Will Do</h2>
        <p className="text-gray-700">Teachers spend hours writing lesson plans. This tool will let you generate detailed, standards-aligned lessons instantly — with objectives, procedures, assessments, and more.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-darkgreen mb-2">Why It Matters</h2>
        <p className="text-gray-700">Great lesson plans are the backbone of effective teaching, but they take time. CliffordClassroom will help teachers focus on students, not paperwork.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-darkgreen mb-2">How It'll Work</h2>
        <p className="text-gray-700">You'll enter your grade, subject, and topic. The tool will generate a complete, editable lesson plan you can use right away.</p>
      </section>
      <Link href="/tools" className="inline-block bg-darkgreen text-white px-4 py-2 rounded hover:bg-green-900 font-semibold">&larr; Back to Tools</Link>
    </main>
  );
} 