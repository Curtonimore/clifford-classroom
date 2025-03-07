export default function CliffBoard() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              CliffBoard
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Your all-in-one dashboard for classroom management, student data tracking, and educational analytics.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Platform Overview
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore the features and plans available in our comprehensive classroom dashboard system.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Features</h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm mt-2">
                    <li>Drag-and-drop interface</li>
                    <li>Customizable templates</li>
                    <li>Collaboration tools</li>
                    <li>Cloud-based saving</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Pricing</h3>
                  <div className="space-y-2 mt-2">
                    <div className="border border-dark-green-600 rounded p-2 bg-dark-green-800">
                      <h4 className="text-sm font-semibold text-white">Free</h4>
                      <p className="text-xs text-gray-200">Basic features and templates</p>
                    </div>
                    <div className="border border-dark-green-600 rounded p-2 bg-dark-green-600">
                      <h4 className="text-sm font-semibold text-white">Premium</h4>
                      <p className="text-xs text-gray-200">All features and advanced templates</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to access the dashboard, student data tools, and reporting features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 