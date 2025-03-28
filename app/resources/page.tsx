export default function Resources() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-brand mb-8">Teaching Resources</h1>

      <div className="mb-12">
        <p className="text-xl text-gray-600">
          Access our collection of high-quality teaching materials, lesson plans,
          and classroom activities designed to enhance your teaching practice.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-brand mb-6">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Math", count: "124 resources" },
            { name: "Science", count: "98 resources" },
            { name: "Language Arts", count: "156 resources" },
            { name: "Social Studies", count: "87 resources" },
            { name: "Technology", count: "65 resources" },
            { name: "Art & Music", count: "43 resources" },
            { name: "Physical Education", count: "32 resources" },
            { name: "Special Education", count: "76 resources" },
          ].map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-brand mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Digital Learning Toolkit",
              type: "Template Pack",
              downloads: "2.3k downloads"
            },
            {
              title: "Student Assessment Forms",
              type: "Document Pack",
              downloads: "1.8k downloads"
            },
            {
              title: "Project-Based Learning Guide",
              type: "PDF Guide",
              downloads: "3.1k downloads"
            },
          ].map((resource, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.type}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{resource.downloads}</span>
                  <button className="text-brand hover:text-brand-light font-medium">
                    Download →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-brand mb-6">Resource Requests</h2>
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Submit a resource request and our team
            will work on creating the materials you need.
          </p>
          <button className="bg-brand hover:bg-brand-light text-white px-6 py-3 rounded-md transition-colors">
            Submit Request
          </button>
        </div>
      </section>
    </div>
  )
} 