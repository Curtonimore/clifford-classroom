'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the new LessonPlanViewer to avoid SSR issues
const LessonPlanViewer = dynamic(() => import('./LessonPlanViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-[800px] w-full flex items-center justify-center bg-white">
      <div className="text-gray-600">Loading lesson plan viewer...</div>
    </div>
  )
})

const subjects = {
  "Math": [
    "Algebra", "Geometry", "Statistics", "Calculus", "Number Sense", "Measurement",
    "Probability", "Trigonometry", "Pre-Algebra", "Financial Math"
  ],
  "Science": [
    "Biology", "Chemistry", "Physics", "Earth Science", "Environmental Science",
    "Astronomy", "Human Anatomy", "Botany", "Zoology", "Weather & Climate"
  ],
  "English": [
    "Literature", "Writing", "Grammar", "Vocabulary", "Reading Comprehension",
    "Poetry", "Creative Writing", "Public Speaking", "Journalism", "Research Skills"
  ],
  "History": [
    "World History", "American History", "Ancient Civilizations", "Geography", "Civics",
    "Economics", "World Cultures", "Government", "Social Studies", "Current Events"
  ],
  "Art": [
    "Drawing", "Painting", "Sculpture", "Art History", "Digital Art",
    "Photography", "Ceramics", "Printmaking", "Textile Arts", "Mixed Media"
  ],
  "Music": [
    "Theory", "Performance", "History", "Composition",
    "Instrumental", "Vocal", "Music Technology", "World Music", "Band", "Orchestra"
  ],
  "Physical Education": [
    "Team Sports", "Individual Sports", "Fitness", "Health",
    "Nutrition", "Dance", "Yoga", "Swimming", "Track & Field", "Outdoor Education"
  ]
} as const

export default function LessonPlanner() {
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])
  const [lessonTitle, setLessonTitle] = useState<string>('')
  const [generatedDate, setGeneratedDate] = useState<string>('')
  const [formFields, setFormFields] = useState({
    grade: '',
    duration: '',
    objectives: ''
  })

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subject = e.target.value
    setSelectedSubject(subject)
    setSelectedSubtopics([])
  }

  const handleSubtopicChange = (subtopic: string) => {
    setSelectedSubtopics(prev => 
      prev.includes(subtopic) 
        ? prev.filter(t => t !== subtopic)
        : [...prev, subtopic]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedContent('')
    setLessonTitle('')
    setGeneratedDate('')

    const formData = new FormData(e.currentTarget)
    
    // Update form fields state
    setFormFields({
      grade: formData.get('grade') as string,
      duration: formData.get('duration') as string,
      objectives: formData.get('objectives') as string
    })

    const data = {
      grade: formData.get('grade'),
      duration: formData.get('duration'),
      subject: selectedSubject,
      subtopics: selectedSubtopics,
      objectives: formData.get('objectives'),
      standards: formData.get('standards'),
      materials: formData.get('materials'),
      extensions: formData.get('extensions'),
      customization: formData.get('customization'),
    }

    try {
      // Check required fields
      if (!data.grade || !data.duration || !data.subject) {
        throw new Error('Please fill in all required fields')
      }

      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(err => {
        throw new Error('Network error. Please check your connection and try again.')
      })

      if (!response) {
        throw new Error('Failed to connect to the server. Please try again.')
      }

      const result = await response.json().catch(err => {
        throw new Error('Invalid response from server. Please try again.')
      })

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate lesson plan. Please try again.')
      }

      if (!result.lessonPlan) {
        throw new Error('No lesson plan was generated. Please try again.')
      }

      setGeneratedContent(result.lessonPlan)
      setLessonTitle(result.title || 'Lesson Plan')
      setGeneratedDate(result.date || new Date().toLocaleDateString())
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
      console.error('Error generating lesson plan:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand mb-8 text-center">AI Lesson Plan Generator</h1>
      <p className="text-lg mb-8 text-center">
        Create a comprehensive lesson plan by filling out the form below. Our AI will generate a detailed plan tailored to your needs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="grade" className="block text-lg font-medium text-gray-700 mb-2">
            Grade Level
          </label>
          <select
            id="grade"
            name="grade"
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand rounded-md"
          >
            <option value="">Select a grade</option>
            <option value="K">Kindergarten</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-2">
            Lesson Duration
          </label>
          <select
            id="duration"
            name="duration"
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand rounded-md"
          >
            <option value="">Select duration</option>
            <option value="30 minutes">30 minutes</option>
            <option value="45 minutes">45 minutes</option>
            <option value="60 minutes">60 minutes</option>
            <option value="75 minutes">75 minutes</option>
            <option value="90 minutes">90 minutes</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand focus:border-brand rounded-md"
          >
            <option value="">Select a subject</option>
            {Object.keys(subjects).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {selectedSubject && (
          <div className="transition-all duration-300 ease-in-out">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Subtopics (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg">
              {subjects[selectedSubject as keyof typeof subjects].map((subtopic) => (
                <div key={subtopic} className="flex items-center space-x-3 p-2 hover:bg-white rounded transition-colors">
                  <input
                    type="checkbox"
                    id={subtopic}
                    checked={selectedSubtopics.includes(subtopic)}
                    onChange={() => handleSubtopicChange(subtopic)}
                    className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={subtopic} 
                    className="text-gray-700 cursor-pointer select-none"
                  >
                    {subtopic}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedSubtopics.length} of {subjects[selectedSubject as keyof typeof subjects].length}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="objectives" className="block text-lg font-medium text-gray-700 mb-2">
            Learning Objectives
          </label>
          <textarea
            id="objectives"
            name="objectives"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
            placeholder="Enter the learning objectives for this lesson (will be converted into measurable goals)..."
          />
        </div>

        <div>
          <label htmlFor="standards" className="block text-lg font-medium text-gray-700 mb-2">
            Teaching Standards (Optional)
          </label>
          <textarea
            id="standards"
            name="standards"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
            placeholder="Enter specific teaching standards (if left empty, relevant Common Core standards will be recommended)..."
          />
          <p className="mt-2 text-sm text-gray-500">
            If not specified, appropriate Common Core standards will be recommended based on the grade and subject.
          </p>
        </div>

        <div>
          <label htmlFor="materials" className="block text-lg font-medium text-gray-700 mb-2">
            Materials Needed (Optional)
          </label>
          <textarea
            id="materials"
            name="materials"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
            placeholder="List any specific materials needed for this lesson (if left empty, materials will be suggested)..."
          />
        </div>

        <div>
          <label htmlFor="extensions" className="block text-lg font-medium text-gray-700 mb-2">
            Extensions and Modifications (Optional)
          </label>
          <textarea
            id="extensions"
            name="extensions"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
            placeholder="Specify any extensions or modifications for different learners (if left empty, suggestions will be provided)..."
          />
        </div>

        <div>
          <label htmlFor="customization" className="block text-lg font-medium text-gray-700 mb-2">
            Customization Options (Optional)
          </label>
          <textarea
            id="customization"
            name="customization"
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
            placeholder="Add any specific customization requests (e.g., 'Make it space-themed', 'Include more hands-on activities', etc.)"
          />
          <p className="mt-2 text-sm text-gray-500">
            Use this space to add any special requests or themes for your lesson plan.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-brand hover:bg-brand-light text-white font-medium py-3 px-6 rounded-md transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating...' : 'Generate Lesson Plan'}
        </button>
      </form>

      {loading && (
        <div className="mt-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 text-red-600 text-center">
          {error}
        </div>
      )}

      {generatedContent && !loading && (
        <div className="mt-8">
          <LessonPlanViewer 
            content={generatedContent} 
            title={lessonTitle}
            date={generatedDate}
            grade={formFields.grade}
            duration={formFields.duration}
            objectives={formFields.objectives}
            subject={selectedSubject}
          />
        </div>
      )}
    </div>
  )
} 