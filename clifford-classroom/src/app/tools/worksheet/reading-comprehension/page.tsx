'use client';

import { useState } from 'react';

export default function ReadingComprehension() {
  const [mode, setMode] = useState('Advanced');
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    paragraphCount: 1,
    readingLevel: '',
    genre: '',
    questionTypes: [],
    questionCount: 1,
    includeWordBank: false,
    wordBankPosition: 'top',
    boldVocabulary: false,
    includeImagePlaceholder: false,
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = '/api/generate-reading';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResponse(data.message);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Reading Comprehension Tool</h1>
          <nav className="mt-4">
            <button onClick={() => setMode('Simple')} className={`mr-4 ${mode === 'Simple' ? 'font-bold' : ''}`}>Simple</button>
            <button onClick={() => setMode('Advanced')} className={mode === 'Advanced' ? 'font-bold' : ''}>Advanced</button>
          </nav>
        </div>
      </header>
      <section className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold">{mode} Mode</h2>
          <div className="mt-4">
            <label className="block">Title
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full" />
            </label>
            <label className="block mt-4">Topic/Theme
              <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="mt-1 block w-full" />
            </label>
            <label className="block mt-4">Paragraph Count
              <input type="number" name="paragraphCount" value={formData.paragraphCount} onChange={handleChange} className="mt-1 block w-full" />
            </label>
            {mode === 'Advanced' && (
              <>
                <label className="block mt-4">Reading Level
                  <select name="readingLevel" value={formData.readingLevel} onChange={handleChange} className="mt-1 block w-full">
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
                <label className="block mt-4">Genre
                  <select name="genre" value={formData.genre} onChange={handleChange} className="mt-1 block w-full">
                    <option value="">Select Genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                  </select>
                </label>
                <label className="block mt-4">Question Types
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="questionTypes" value="multiple-choice" onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">Multiple Choice</span>
                    </label>
                    <label className="inline-flex items-center ml-4">
                      <input type="checkbox" name="questionTypes" value="short-answer" onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">Short Answer</span>
                    </label>
                  </div>
                </label>
                <label className="block mt-4">Question Count
                  <input type="number" name="questionCount" value={formData.questionCount} onChange={handleChange} className="mt-1 block w-full" />
                </label>
                <label className="block mt-4">Include Word Bank?
                  <input type="checkbox" name="includeWordBank" checked={formData.includeWordBank} onChange={handleChange} className="form-checkbox mt-1" />
                </label>
                <label className="block mt-4">Word Bank Position
                  <select name="wordBankPosition" value={formData.wordBankPosition} onChange={handleChange} className="mt-1 block w-full">
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </label>
                <label className="block mt-4">Bold Vocabulary?
                  <input type="checkbox" name="boldVocabulary" checked={formData.boldVocabulary} onChange={handleChange} className="form-checkbox mt-1" />
                </label>
                <label className="block mt-4">Include Image Placeholder?
                  <input type="checkbox" name="includeImagePlaceholder" checked={formData.includeImagePlaceholder} onChange={handleChange} className="form-checkbox mt-1" />
                </label>
                <label className="block mt-4">Generator Instructions
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="mt-1 block w-full"></textarea>
                </label>
              </>
            )}
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">{loading ? 'Generating…' : 'Generate'}</button>
        </form>
        {response && <pre className="mt-4 p-4 bg-gray-200">{response}</pre>}
        {response && <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded">Download as .docx</button>}
      </section>
    </main>
  );
} 