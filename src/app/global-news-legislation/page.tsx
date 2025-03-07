export default function GlobalNewsLegislation() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Global News & Legislation
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Stay informed about the latest educational news, policy changes, and legislative updates from around the world.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Available Resources
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore our collection of news, analysis, and policy breakdowns to stay current on educational developments.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">U.S. Education Updates</h3>
                  <p className="text-sm text-gray-200">
                    The latest news and policy changes in American education.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">International Trends</h3>
                  <p className="text-sm text-gray-200">
                    Educational developments and innovations from around the world.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Legislation Breakdown</h3>
                  <p className="text-sm text-gray-200">
                    Analysis and summaries of important educational legislation.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to explore specific topics and regions for more detailed information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 