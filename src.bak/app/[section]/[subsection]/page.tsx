type Props = {
  params: {
    section: string;
    subsection: string;
  }
}

export default function SubPage({ params }: Props) {
  // Remove async and use synchronous string manipulation
  const section = decodeURIComponent(params.section ?? '').replace(/-/g, ' ');
  const subsection = decodeURIComponent(params.subsection ?? '').replace(/-/g, ' ');

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {subsection}
          </h1>
          <p className="text-gray-500 mt-2">
            Part of {section}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Content for {subsection} will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 