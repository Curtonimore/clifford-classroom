'use client'

import Link from 'next/link'

export default function AITools() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-brand mb-8">AI Teaching Tools</h1>
      
      <div className="mb-12">
        <p className="text-xl text-gray-600">
          Enhance your teaching with our suite of AI-powered tools designed to save time
          and improve student engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link 
          href="/ai-tools/lesson-planner"
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-brand mb-3">
            Lesson Plan Generator
          </h3>
          <p className="text-gray-600 mb-4">
            Create comprehensive lesson plans tailored to your grade level and subject area.
            Includes learning objectives, activities, and assessments.
          </p>
          <span className="text-brand hover:text-brand-light font-medium">
            Create a lesson plan →
          </span>
        </Link>

        {/* Placeholder for future tools */}
        <div className="bg-white p-6 rounded-lg shadow-md opacity-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Assignment Creator
          </h3>
          <p className="text-gray-500 mb-4">
            Generate customized assignments and worksheets based on your curriculum.
            Coming soon.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md opacity-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Quiz Generator
          </h3>
          <p className="text-gray-500 mb-4">
            Create quizzes and assessments with automatic grading capabilities.
            Coming soon.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-brand mb-6">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Rubric Builder",
              description: "Design comprehensive assessment rubrics for any subject."
            },
            {
              title: "Discussion Prompts",
              description: "Generate thought-provoking discussion topics for your class."
            }
          ].map((tool, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{tool.title}</h3>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-brand mb-6">Getting Started</h2>
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-600 mb-4">
            New to our AI tools? Watch our quick tutorial to learn how to make the most
            of these resources in your classroom.
          </p>
          <button className="text-brand hover:text-brand-light font-medium">
            Watch Tutorial →
          </button>
        </div>
      </section>
    </div>
  )
} 