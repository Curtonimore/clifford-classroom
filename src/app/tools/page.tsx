import Link from "next/link";

const tools = [
  {
    title: "Lesson Plan Generator",
    description: "Create detailed, standards-aligned lesson plans in seconds.",
    href: "/tools/lesson-planner",
  },
  {
    title: "Quiz Builder",
    description: "Generate multiple-choice quizzes with instant answer keys.",
    href: "/tools/quiz-builder",
  },
  {
    title: "Worksheet Maker",
    description: "Printable activities built from your topic or grade.",
    href: "/tools/worksheet-maker",
  },
  {
    title: "Poster Generator",
    description: "Design classroom posters and visual aids in a snap.",
    href: "/tools/poster-generator",
  },
];

export default function Tools() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-average">
      <h1 className="text-4xl font-bold text-brand-green mb-4">Tools for Teaching</h1>
      <p className="text-lg text-gray-700 mb-6">Explore practical tools to support your teaching and planning.</p>
      <div>
        {tools.map((tool) => (
          <div key={tool.title} className="border p-4 rounded mb-4 hover:shadow transition bg-white flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold text-brand-green mb-1">{tool.title}</div>
              <div className="text-gray-700 mb-2 md:mb-0">{tool.description}</div>
            </div>
            <Link href={tool.href} className="bg-brand-green text-white px-4 py-2 rounded hover:bg-brand-green-dark font-semibold text-center md:ml-6 mt-2 md:mt-0 w-full md:w-auto">Preview Tool</Link>
          </div>
        ))}
      </div>
    </main>
  );
} 