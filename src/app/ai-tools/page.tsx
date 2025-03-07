export default function AITools() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              AI Tools
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Leverage artificial intelligence to enhance your teaching and learning experience.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Available Tools
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore our suite of AI-powered tools designed to enhance your teaching capabilities.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Lesson Planning</h3>
                  <p className="text-sm text-gray-200">
                    AI-powered tools for creating and organizing lesson plans.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2 text-sm">
                    <li>Lesson Plan Generator</li>
                    <li>Unit Plan Creator</li>
                    <li>Curriculum Designer</li>
                    <li>Activity Planner</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Assessment Tools</h3>
                  <p className="text-sm text-gray-200">
                    AI tools for creating and managing assessments.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2 text-sm">
                    <li>Rubric Generator</li>
                    <li>Quiz Creator</li>
                    <li>Assessment Analyzer</li>
                    <li>Progress Tracker</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Select a specific tool from the sidebar to explore its features and capabilities in more detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 