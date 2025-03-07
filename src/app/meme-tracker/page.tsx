export default function MemeTracker() {
  return (
    <div className="bg-tan min-h-screen">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-4">
              Meme Tracker
            </h1>
            
            <p className="text-gray-200 mb-0 leading-relaxed">
              Stay current with educational memes and social media trends in education.
            </p>
          </div>
          
          <div className="bg-dark-gray text-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">
              Social Media Trends
            </h2>
            <div className="prose max-w-none prose-invert">
              <p className="text-gray-200 leading-relaxed">
                Explore the latest memes, viral content, and social media trends in education.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Trending Memes</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Latest educational memes and viral content in the teaching community.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Teacher Memes</li>
                    <li>Student Life</li>
                    <li>Education Humor</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Meme Origins</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Understanding the history and meaning behind popular educational memes.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Meme History</li>
                    <li>Cultural Context</li>
                    <li>Evolution of Trends</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-green-700 rounded-md border border-dark-green-800">
                  <h3 className="font-medium text-white mb-2">Social Media</h3>
                  <p className="text-sm text-gray-200 mb-2">
                    Educational trends and slang from various social media platforms.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm">
                    <li>Twitter Trends</li>
                    <li>Instagram Education</li>
                    <li>TikTok Learning</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-green-800 p-4 rounded-md border border-dark-green-700">
                <p className="text-gray-100 text-sm">
                  <strong>Tip:</strong> Use the sidebar navigation to explore different categories of educational memes and social media content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 