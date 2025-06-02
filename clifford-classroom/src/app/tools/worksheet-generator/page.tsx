"use client";

import { useState } from 'react';

export default function WorksheetGenerator() {
  const [mode, setMode] = useState('Simple');
  const [formData, setFormData] = useState({
    title: '',
    paragraphCount: 1,
    generalTopic: '',
  });
  const [preview, setPreview] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setPreview(data.content);
    } catch (error) {
      console.error(error);
      setPreview('An error occurred while generating content.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-screen-md mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Worksheet Generator</h1>
        <div className="flex justify-center mb-6">
          <button onClick={() => setMode('Simple')} className={`mr-4 ${mode === 'Simple' ? 'font-bold' : ''}`}>Simple Mode</button>
          <button onClick={() => setMode('Advanced')} className={mode === 'Advanced' ? 'font-bold' : ''}>Advanced Mode</button>
        </div>
        <form onSubmit={handleSubmit} className="mb-6">
          {mode === 'Simple' && (
            <>
              <label className="block mb-2">Title
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full" />
              </label>
              <label className="block mb-2">Paragraph Count
                <input type="number" name="paragraphCount" value={formData.paragraphCount} onChange={handleChange} className="mt-1 block w-full" />
              </label>
              <label className="block mb-2">General Topic
                <input type="text" name="generalTopic" value={formData.generalTopic} onChange={handleChange} className="mt-1 block w-full" />
              </label>
            </>
          )}
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Generate</button>
        </form>
        {preview && <pre className="mt-4 p-4 bg-gray-200">{preview}</pre>}
        {preview && <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded">Download as .docx</button>}
      </div>
    </main>
  );
} 