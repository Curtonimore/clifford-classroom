export default function PBIS() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">PBIS Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is PBIS?</h2>
            <p className="text-gray-600 mb-4">
              Positive Behavioral Interventions and Supports (PBIS) is an evidence-based framework for supporting students' behavioral, academic, social, emotional, and mental health.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Key Components</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Prevention</li>
                <li>Teaching</li>
                <li>Reinforcement</li>
                <li>Data-based decision making</li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900">For Teachers</h3>
                <p className="text-gray-600">Implementation guides and classroom strategies</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900">For Parents</h3>
                <p className="text-gray-600">Understanding and supporting PBIS at home</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900">Rewards Ideas</h3>
                <p className="text-gray-600">Creative and effective reward systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 