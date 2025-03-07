export default function Home() {
  return (
    <div className="bg-tan min-h-screen">
      {/* Hero section */}
      <section className="bg-dark-green text-white py-16 px-8 border border-[#402E32]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Welcome to Clifford Classroom
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Your comprehensive platform for educational resources, lesson planning, and AI-powered teaching assistance.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/lesson-planning"
              className="px-5 py-3 bg-tan text-dark-green font-medium rounded-md hover:bg-tan-accent transition-colors"
            >
              Get Started
            </a>
            <a
              href="/about"
              className="px-5 py-3 bg-dark-green-700 text-white font-medium rounded-md border border-dark-green-500 hover:bg-dark-green-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">What We Offer</h2>
            
            {/* AI Teaching Assistant */}
            <div className="bg-dark-gray text-white rounded-lg shadow-md p-8 mb-10 border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">AI-Powered Teaching Assistant</h3>
              <p className="text-gray-200 mb-6">
                Leverage the power of artificial intelligence to enhance your teaching methods,
                create engaging lesson plans, and provide personalized learning experiences for your students.
              </p>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Generate customized lesson plans based on your curriculum</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Access AI-suggested teaching strategies and resources</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Create assessments and quizzes with automated grading features</span>
                </li>
              </ul>
            </div>

            {/* Resource cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Lesson Planning */}
              <div className="bg-dark-gray text-white rounded-lg shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3">Lesson Planning</h3>
                <p className="text-gray-200 mb-4">
                  Access hundreds of ready-to-use lesson plans or create your own with our intuitive tools.
                </p>
                <a href="/lesson-planning" className="text-light-blue hover:underline text-sm inline-flex items-center">
                  Explore Lesson Planning
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Educational News */}
              <div className="bg-dark-gray text-white rounded-lg shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3">Educational News</h3>
                <p className="text-gray-200 mb-4">
                  Stay updated with the latest trends, research, and best practices in education.
                </p>
                <a href="/resources/news" className="text-light-blue hover:underline text-sm inline-flex items-center">
                  Read Latest News
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* AI Tools */}
              <div className="bg-dark-gray text-white rounded-lg shadow-md p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-3">AI Tools</h3>
                <p className="text-gray-200 mb-4">
                  Discover how AI can enhance your teaching methods and provide personalized learning experiences.
                </p>
                <a href="/ai-tools" className="text-light-blue hover:underline text-sm inline-flex items-center">
                  Explore AI Tools
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
