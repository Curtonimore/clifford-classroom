export default function SectionPage({ params }: { params: { section: string } }) {
  const section = params?.section || '';
  const sectionName = section.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              {sectionName}
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Explore resources and content related to {sectionName}. Select a topic from the sidebar to view detailed information.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Overview
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                This section provides comprehensive resources, tools, and guidance related to {sectionName}.
                Browse the categories in the sidebar to explore specific topics within this section.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-6 mb-3">Available Resources</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h4 className="font-medium text-white mb-2">Lesson Materials</h4>
                  <p className="text-sm text-gray-200">
                    Access ready-to-use lesson plans, activities, and teaching resources.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h4 className="font-medium text-white mb-2">Professional Development</h4>
                  <p className="text-sm text-gray-200">
                    Enhance your skills with our training materials and best practice guides.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to explore specific topics within {sectionName}. Each subsection contains specialized resources and guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 