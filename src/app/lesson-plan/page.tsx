'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function LessonPlanPage() {
  const { setCurrentPath, showNotification } = useAppContext();
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('lesson-plan', '');
  }, [setCurrentPath]);

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
        
        <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div className="form-group">
            <label htmlFor="standards" className="form-label">Standards</label>
            <input type="text" id="standards" className="form-input" placeholder="e.g., CCSS.ELA-LITERACY.RL.5.1" disabled />
          </div>
          
          <div className="form-group">
            <label htmlFor="audience" className="form-label">Grade Level/Audience</label>
            <input type="text" id="audience" className="form-input" placeholder="e.g., 5th Grade" disabled />
          </div>
          
          <div className="form-group">
            <label htmlFor="time" className="form-label">Lesson Duration</label>
            <input type="text" id="time" className="form-input" placeholder="e.g., 45 minutes" disabled />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject Area</label>
            <input type="text" id="subject" className="form-input" placeholder="e.g., Mathematics, Science, Language Arts" disabled />
          </div>
          
          <div className="form-group">
            <label htmlFor="topic" className="form-label">Topic</label>
            <input type="text" id="topic" className="form-input" placeholder="e.g., Fractions, Solar System, Writing Persuasive Essays" disabled />
          </div>
          
          <button 
            onClick={() => showNotification('Lesson Plan Generator coming soon!')} 
            className="login-button"
            style={{ width: '100%' }}
          >
            Coming Soon
          </button>
        </div>
      </section>
      
      <section className="content-section">
        <h2>How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Enter your lesson criteria, including standards, grade level, and topic</li>
          <li>Our AI analyzes thousands of effective lesson plans and educational resources</li>
          <li>Receive a complete, customized lesson plan in seconds</li>
          <li>Edit and adapt the plan to fit your specific classroom needs</li>
          <li>Save your lesson plans for future use or export them to your preferred format</li>
        </ol>
      </section>
    </>
  );
} 