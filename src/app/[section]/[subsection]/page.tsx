// import { Metadata } from 'next';

// @ts-ignore
// eslint-disable-next-line
export default function SubPage({ 
  params 
}: { 
  params: { section: string; subsection: string } 
}) {
  const section = params?.section || '';
  const subsection = params?.subsection || '';
  
  const sectionName = section.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const subsectionName = subsection.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <span className="text-sm text-gray-300">
              {sectionName} /
            </span>
            <h1 className="text-3xl font-extrabold text-white mb-4 mt-1">
              {subsectionName}
            </h1>
            <p className="text-gray-200 mb-0 leading-relaxed">
              Explore resources and content related to {subsectionName} within the {sectionName} section.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Overview
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Welcome to the {subsectionName} page. This area contains specialized content and tools to support your teaching needs.
              </p>
              
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Resources</h3>
                  <p className="text-sm text-gray-200">
                    Access teaching materials, lesson plans, and additional documents.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Activities</h3>
                  <p className="text-sm text-gray-200">
                    Browse interactive exercises, worksheets, and student projects.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-3">Helpful Tips</h3>
                <div className="bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                  <p className="text-gray-100 text-sm mb-2">
                    <strong>Pro Tip:</strong> When implementing {subsectionName} in your classroom, consider starting with small group activities before moving to whole-class implementation.
                  </p>
                  <p className="text-gray-100 text-sm">
                    Need more guidance? Check out our <a href="#" className="text-light-blue hover:underline">detailed guide</a> or <a href="#" className="text-light-blue hover:underline">video tutorials</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 