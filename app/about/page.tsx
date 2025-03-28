export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-brand mb-8">About Us</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At Clifford Classroom, we're dedicated to empowering educators with the tools and resources 
            they need to thrive in today's digital learning environment. We believe that by combining 
            traditional teaching wisdom with modern technology, we can create more engaging and 
            effective learning experiences.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace new technologies and methodologies to enhance the teaching experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                We believe quality educational resources should be accessible to all educators.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We foster a supportive environment where educators can share and grow together.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in all our tools and resources.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-brand mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-4">
            Whether you're a veteran teacher or just starting your educational journey, 
            Clifford Classroom is here to support you. Join our community of educators 
            and discover new ways to enhance your teaching practice.
          </p>
        </section>
      </div>
    </div>
  )
} 