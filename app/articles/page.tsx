export default function Articles() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-brand mb-8">Articles</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-brand mb-6">Featured Article</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              The Future of AI in Education: Opportunities and Challenges
            </h3>
            <p className="text-gray-600 mb-4">
              Explore how artificial intelligence is transforming the educational landscape
              and what it means for teachers and students alike.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>March 20, 2024</span>
              <span className="mx-2">•</span>
              <span>10 min read</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-brand mb-6">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Effective Classroom Management Strategies",
              excerpt: "Discover proven techniques for maintaining an organized and productive learning environment.",
              date: "March 15, 2024",
              readTime: "8 min read"
            },
            {
              title: "Incorporating Technology in Lesson Planning",
              excerpt: "Learn how to seamlessly integrate digital tools into your daily teaching practice.",
              date: "March 10, 2024",
              readTime: "6 min read"
            },
            {
              title: "Building Student Engagement",
              excerpt: "Explore methods to increase student participation and interest in learning.",
              date: "March 5, 2024",
              readTime: "7 min read"
            },
          ].map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
} 