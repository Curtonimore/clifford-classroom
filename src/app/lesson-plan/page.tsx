'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import ReactMarkdown from 'react-markdown';
import { generateLessonPlanPDF } from '@/utils/pdfGenerator';

export default function LessonPlanPage() {
  const { setCurrentPath, showNotification } = useAppContext();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    standards: '',
    audience: '',
    time: '',
    subject: '',
    topic: '',
    objectives: ''
  });
  
  // State for lesson plan generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [lessonPlanMetadata, setLessonPlanMetadata] = useState(null);
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('lesson-plan', '');
  }, [setCurrentPath]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.topic || !formData.subject || !formData.audience) {
      showNotification('Please fill in the required fields: Topic, Subject, and Grade Level');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }
      
      const data = await response.json();
      setLessonPlan(data.lessonPlan);
      setLessonPlanMetadata(data.metadata);
      showNotification('Lesson plan generated successfully!');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      showNotification(`Error: ${error.message || 'Failed to generate lesson plan. Please try again.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (!lessonPlan || !lessonPlanMetadata) {
      showNotification('No lesson plan to download. Please generate one first.');
      return;
    }
    
    try {
      const filename = generateLessonPlanPDF(lessonPlan, lessonPlanMetadata);
      showNotification(`Lesson plan downloaded as ${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Error generating PDF. Please try again.');
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Lesson Plan Generator</h1>
        <p className="page-description">
          Create customized lesson plans in seconds with our AI-powered tool
        </p>
      </header>
      
      <section className="content-section">
        <h2>Generate Your Lesson Plan</h2>
        <p>
          Our AI-powered tool helps you create comprehensive lesson plans tailored to your specific needs.
          Simply enter your criteria below and our AI will generate a customized plan for you.
        </p>
        
        <form 
          onSubmit={handleSubmit}
          className="form-container" 
          style={{ maxWidth: '600px', margin: '2rem auto' }}
        >
          <div className="form-group">
            <label htmlFor="standards" className="form-label">Standards</label>
            <input 
              type="text" 
              id="standards" 
              className="form-input" 
              placeholder="e.g., CCSS.ELA-LITERACY.RL.5.1" 
              value={formData.standards}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="audience" className="form-label">Grade Level/Audience<span style={{ color: 'red' }}>*</span></label>
            <input 
              type="text" 
              id="audience" 
              className="form-input" 
              placeholder="e.g., 5th Grade" 
              value={formData.audience}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time" className="form-label">Lesson Duration</label>
            <input 
              type="text" 
              id="time" 
              className="form-input" 
              placeholder="e.g., 45 minutes" 
              value={formData.time}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject Area<span style={{ color: 'red' }}>*</span></label>
            <input 
              type="text" 
              id="subject" 
              className="form-input" 
              placeholder="e.g., Mathematics, Science, Language Arts" 
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="topic" className="form-label">Topic<span style={{ color: 'red' }}>*</span></label>
            <input 
              type="text" 
              id="topic" 
              className="form-input" 
              placeholder="e.g., Fractions, Solar System, Writing Persuasive Essays" 
              value={formData.topic}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="objectives" className="form-label">Learning Objectives</label>
            <textarea 
              id="objectives" 
              className="form-input" 
              placeholder="e.g., Students will be able to identify and compare fractions..." 
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <button 
            type="submit"
            className="login-button"
            style={{ width: '100%' }}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Lesson Plan'}
          </button>
          
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
            <span style={{ color: 'red' }}>*</span> Required fields
          </p>
        </form>
      </section>
      
      {lessonPlan && (
        <section id="results-section" className="content-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Lesson Plan</h2>
            <button 
              onClick={handleDownloadPDF}
              className="home-button primary"
              style={{ marginLeft: '1rem' }}
            >
              Download PDF
            </button>
          </div>
          
          <div 
            className="lesson-plan-container"
            style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              marginTop: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <ReactMarkdown>{lessonPlan}</ReactMarkdown>
          </div>
        </section>
      )}
      
      <section className="content-section">
        <h2>How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Enter your lesson criteria, including standards, grade level, and topic</li>
          <li>Our AI analyzes thousands of effective lesson plans and educational resources</li>
          <li>Receive a complete, customized lesson plan in seconds</li>
          <li>Edit and adapt the plan to fit your specific classroom needs</li>
          <li>Download the lesson plan as a PDF for easy printing and sharing</li>
        </ol>
      </section>
    </>
  );
} 