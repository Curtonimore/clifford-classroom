import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-average">
      <h1 className="text-4xl font-bold text-darkgreen mb-4">Real Tools for Real Teaching</h1>
      <p className="text-lg text-gray-700 mb-10">CliffordClassroom.com is a growing library of AI-powered tools for lesson planning, quiz creation, and classroom support — built by a teacher, for teachers.</p>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lesson Plan Generator Card */}
        <div className="flex-1 bg-white border p-6 rounded shadow hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">📘 Lesson Plan Generator</div>
            <div className="text-gray-700 mb-4">Create detailed, standards-aligned lesson plans in seconds.</div>
          </div>
          <Link href="/tools/lesson-planner" className="mt-auto bg-darkgreen text-white px-4 py-2 rounded hover:bg-green-900 text-center font-semibold">Preview Tool</Link>
        </div>
        {/* Quiz Builder Card */}
        <div className="flex-1 bg-white border p-6 rounded shadow hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">📝 Quiz Builder</div>
            <div className="text-gray-700 mb-4">Generate multiple-choice quizzes with instant answer keys.</div>
          </div>
          <Link href="/tools/quiz-builder" className="mt-auto bg-darkgreen text-white px-4 py-2 rounded hover:bg-green-900 text-center font-semibold">Preview Tool</Link>
        </div>
        {/* Worksheet Maker Card */}
        <div className="flex-1 bg-white border p-6 rounded shadow hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="text-3xl mb-2">📄 Worksheet Maker</div>
            <div className="text-gray-700 mb-4">Printable activities built from your topic or grade.</div>
          </div>
          <Link href="/tools/worksheet-maker" className="mt-auto bg-darkgreen text-white px-4 py-2 rounded hover:bg-green-900 text-center font-semibold">Preview Tool</Link>
        </div>
      </div>
    </main>
  );
}
