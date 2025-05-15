export default function WorksheetGenerator() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20 font-average">
      <h1 className="text-4xl text-darkgreen font-bold mb-4">Worksheet Generator</h1>
      <p className="text-lg text-gray-700 mb-6">Create custom worksheets for any subject or grade.</p>
      <hr className="my-6 border-gray-300" />
      <form className="mb-8 space-y-4">
        <input type="text" placeholder="Subject" className="border rounded px-3 py-2 w-full" />
        <input type="text" placeholder="Grade" className="border rounded px-3 py-2 w-full" />
        <input type="text" placeholder="Topic" className="border rounded px-3 py-2 w-full" />
        <button type="button" className="bg-darkgreen text-white px-6 py-2 rounded hover:bg-green-900 transition">Generate</button>
      </form>
      <div className="border rounded p-4 bg-gray-50 text-gray-600">Generated worksheet will appear here.</div>
    </main>
  );
} 