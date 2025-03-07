export default function LessonPlansUnitPlans() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Lesson Plans & Unit Plans
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Access a comprehensive collection of lesson plans and unit plans for various subjects and grade levels.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Available Resources
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Browse our collection of lesson plans and unit plans designed to enhance your teaching experience.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Free Lesson Plans</h3>
                  <p className="text-sm text-gray-200">
                    Browse our collection of free, high-quality lesson plans for K-12 education.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2 text-sm">
                    <li>K-5 Lesson Plans</li>
                    <li>Middle School Resources</li>
                    <li>High School Materials</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Premium Plans</h3>
                  <p className="text-sm text-gray-200">
                    Access our premium collection of detailed unit plans and comprehensive teaching resources.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2 text-sm">
                    <li>Complete Unit Plans</li>
                    <li>Assessment Materials</li>
                    <li>Differentiated Instruction Guides</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to explore specific grade levels and subject areas for more tailored resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 