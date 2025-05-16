"use client";
import { useState, useRef } from "react";

// Define subject categories and their subcategories
const SUBJECTS = {
  Math: ["Geometry", "Algebra", "Fractions", "Measurement", "Number Sense"],
  Science: ["Life Science", "Earth Science", "Physical Science", "Scientific Method"],
  ELA: ["Reading", "Writing", "Grammar", "Vocabulary", "Comprehension"],
  "Social Studies": ["History", "Geography", "Civics", "Economics", "Culture"],
  Art: ["Drawing", "Painting", "Sculpture", "Digital Art", "Art History"],
  Music: ["Theory", "Performance", "Composition", "History", "Appreciation"],
  Health: ["Nutrition", "Physical Health", "Mental Health", "Safety", "Wellness"],
  PE: ["Team Sports", "Individual Sports", "Fitness", "Coordination", "Health"],
  Technology: ["Coding", "Digital Literacy", "Robotics", "Design", "Research"]
} as const;

type Subject = keyof typeof SUBJECTS;

// Define US states for standards alignment
const STATES = [
  "National", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function LessonPlanner() {
  const [subject, setSubject] = useState<Subject | "">("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState("");
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customStandards, setCustomStandards] = useState("");
  const [customObjectives, setCustomObjectives] = useState("");
  const [customDifferentiation, setCustomDifferentiation] = useState("");
  const [customExtensions, setCustomExtensions] = useState("");
  // Preview and download
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = e.target.value as Subject;
    setSubject(newSubject);
    setSubcategories([]); // Reset subcategories when subject changes
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSubcategories(prev => 
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPreview(null);
    setDocxBlob(null);
    try {
      const res = await fetch("/api/preview-lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          subcategories,
          grade,
          topic,
          lessonTitle,
          notes,
          state,
          customStandards,
          customObjectives,
          customDifferentiation,
          customExtensions
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate lesson plan.");
      }
      const data = await res.json();
      setPreview(data.lessonText);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          subcategories,
          grade,
          topic,
          lessonTitle,
          notes,
          state,
          customStandards,
          customObjectives,
          customDifferentiation,
          customExtensions
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate lesson plan.");
      }
      const blob = await res.blob();
      setDocxBlob(blob);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = res.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      link.download = filenameMatch?.[1] || "lesson-plan.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setPreview(null);
    setDocxBlob(null);
    setError("");
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-12 font-average">
      <h1 className="text-4xl font-bold text-brand-green mb-6">Lesson Plan Generator</h1>
      <form
        ref={formRef}
        onSubmit={handlePreview}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-6 border border-gray-200"
      >
        {/* Lesson Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="lessonTitle">
            Lesson Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="lessonTitle"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={lessonTitle}
            onChange={e => setLessonTitle(e.target.value)}
            placeholder="e.g. Exploring Plant Life Cycles"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={subject}
            onChange={handleSubjectChange}
            required
          >
            <option value="">Select subject</option>
            {Object.keys(SUBJECTS).map((subj) => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

        {subject && (
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Subcategories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS[subject as Subject].map((subcat) => (
                <label key={subcat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={subcategories.includes(subcat)}
                    onChange={() => handleSubcategoryChange(subcat)}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <span className="text-sm text-gray-700">{subcat}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="grade">
            Grade
          </label>
          <select
            id="grade"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={grade}
            onChange={e => setGrade(e.target.value)}
            required
          >
            <option value="">Select grade</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="topic">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            placeholder="e.g. Plant Life Cycles"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="notes">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any special instructions or requests"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="state">
            State <span className="text-gray-400 font-normal">(optional, for standards alignment)</span>
          </label>
          <select
            id="state"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
            value={state}
            onChange={e => setState(e.target.value)}
          >
            <option value="">Select state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Advanced Options Accordion */}
        <div>
          <button
            type="button"
            className="text-brand-green font-semibold underline mb-2"
            onClick={() => setShowAdvanced(v => !v)}
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>
          {showAdvanced && (
            <div className="space-y-4 border border-gray-200 rounded p-4 bg-gray-50">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="customStandards">
                  Standards <span className="text-gray-400 font-normal">(optional, will override AI)</span>
                </label>
                <textarea
                  id="customStandards"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={customStandards}
                  onChange={e => setCustomStandards(e.target.value)}
                  rows={2}
                  placeholder="Paste or write your own standards here"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="customObjectives">
                  Objectives <span className="text-gray-400 font-normal">(optional, will override AI)</span>
                </label>
                <textarea
                  id="customObjectives"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={customObjectives}
                  onChange={e => setCustomObjectives(e.target.value)}
                  rows={2}
                  placeholder="Paste or write your own objectives here"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="customDifferentiation">
                  Differentiation <span className="text-gray-400 font-normal">(optional, will override AI)</span>
                </label>
                <textarea
                  id="customDifferentiation"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={customDifferentiation}
                  onChange={e => setCustomDifferentiation(e.target.value)}
                  rows={2}
                  placeholder="Paste or write your own differentiation here"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="customExtensions">
                  Extensions <span className="text-gray-400 font-normal">(optional, will override AI)</span>
                </label>
                <textarea
                  id="customExtensions"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={customExtensions}
                  onChange={e => setCustomExtensions(e.target.value)}
                  rows={2}
                  placeholder="Paste or write your own extensions here"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 font-semibold text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Generating..." : preview ? "Regenerate" : "Preview Lesson Plan"}
        </button>
      </form>
      {/* Preview Box and Download Button */}
      {preview && (
        <div className="mt-8">
          <div className="mb-4 flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-brand-green-dark transition-colors"
              disabled={loading}
            >
              Download as .docx
            </button>
            <button
              onClick={handleRegenerate}
              className="bg-gray-200 text-brand-green font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors border border-brand-green"
              disabled={loading}
            >
              Regenerate
            </button>
          </div>
          <pre
            className="whitespace-pre-wrap max-h-[500px] overflow-y-auto bg-white border border-brand-green rounded p-6 font-average text-base leading-relaxed"
            style={{ fontFamily: 'Average, Times New Roman, serif' }}
            dangerouslySetInnerHTML={{ __html: highlightSections(preview) }}
          />
        </div>
      )}
      <p className="text-center text-gray-500 mt-4">
        Your lesson plan will download as a <strong>.docx</strong> file, ready to edit in Word or Google Docs.
      </p>
    </main>
  );

  // Helper to highlight section headers in preview
  function highlightSections(text: string) {
    // Replace section headers (e.g., "Objectives:") with styled span
    return text.replace(/^(w[\w\s()]+:)/gm, match =>
      `<span style="color:#2D4739;font-weight:bold;">${match}</span>`
    );
  }
} 