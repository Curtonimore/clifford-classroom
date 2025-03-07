export default function ResourcesRecommendations() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Resources & Recommendations
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Curated resources and recommendations for educators and parents.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Educational Materials
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore our collection of recommended resources, books, and tools to enhance your teaching and learning.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Books & Materials</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Recommended books and educational materials for different age groups.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Children's Books</li>
                    <li>Young Adult Literature</li>
                    <li>Professional Development</li>
                    <li>Teaching Resources</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Technology & Tools</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Educational technology and digital tools for learning.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Educational Apps</li>
                    <li>Learning Platforms</li>
                    <li>Digital Resources</li>
                    <li>Online Tools</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to filter resources by subject area, grade level, or resource type.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 