export default function Support() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-brand mb-8">Support Center</h1>

      <div className="mb-12">
        <p className="text-xl text-gray-600">
          Need help? Find answers to common questions or reach out to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-brand mb-4">Email Support</h3>
          <p className="text-gray-600 mb-4">
            Send us an email and we'll get back to you within 24 hours.
          </p>
          <a href="mailto:support@cliffordclassroom.com" 
             className="text-brand hover:text-brand-light font-medium">
            support@cliffordclassroom.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-brand mb-4">Live Chat</h3>
          <p className="text-gray-600 mb-4">
            Chat with our support team during business hours (9am-5pm EST).
          </p>
          <button className="bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-md">
            Start Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-brand mb-4">Community Forum</h3>
          <p className="text-gray-600 mb-4">
            Connect with other educators and share solutions.
          </p>
          <button className="bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-md">
            Visit Forum
          </button>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-brand mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              question: "How do I reset my password?",
              answer: "Click the 'Forgot Password' link on the login page and follow the instructions sent to your email."
            },
            {
              question: "Can I share resources with other teachers?",
              answer: "Yes! You can share resources by using the share button on any resource page or by copying the direct link."
            },
            {
              question: "How do I request a new feature?",
              answer: "Submit your feature request through our feedback form in the Resource Requests section."
            },
            {
              question: "Is there a limit to resource downloads?",
              answer: "No, all verified educators have unlimited access to our teaching resources."
            },
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-brand mb-6">Still Need Help?</h2>
        <div className="bg-gray-50 p-8 rounded-lg">
          <p className="text-gray-600 mb-4">
            Our support team is here to help you get the most out of Clifford Classroom.
            Don't hesitate to reach out with any questions or concerns.
          </p>
          <button className="bg-brand hover:bg-brand-light text-white px-6 py-3 rounded-md transition-colors">
            Contact Support
          </button>
        </div>
      </section>
    </div>
  )
} 