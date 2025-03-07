export default function SpecialEducationDisabilities() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Special Education & Disabilities
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Comprehensive resources and guides for supporting students with special needs and disabilities.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Support Resources
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore our collection of tools, guides, and resources for supporting diverse learning needs.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">IEP & 504 Guides</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Essential information and templates for Individualized Education Programs and 504 Plans.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>IEP Development</li>
                    <li>504 Plan Templates</li>
                    <li>Accommodation Strategies</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">SPED Tools & Tech</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Technology and tools designed to support special education needs.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Assistive Technology</li>
                    <li>Learning Apps</li>
                    <li>Accessibility Tools</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Learning Disabilities</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Resources for understanding and supporting various learning disabilities.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Autism Support</li>
                    <li>ADHD Strategies</li>
                    <li>Dyslexia Resources</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to access specialized resources for different disability categories and support strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 