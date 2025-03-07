export default function BrainPhysiologyInsights() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Brain & Physiology Insights
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Understanding the science behind learning and development.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Research Areas
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore the latest findings in neuroscience and how they apply to educational practices.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Brain Development</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Explore how the brain develops and learns throughout different stages of life.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Early Childhood Development</li>
                    <li>Adolescent Brain Changes</li>
                    <li>Adult Learning</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Learning Factors</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Key factors that influence learning and cognitive development.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Sleep & Learning</li>
                    <li>Nutrition Impact</li>
                    <li>Exercise Benefits</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Research Insights</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Latest research findings in neuroscience and education.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Recent Studies</li>
                    <li>Educational Implications</li>
                    <li>Future Trends</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to explore detailed research topics and educational applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 