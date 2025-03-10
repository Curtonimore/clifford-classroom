'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function AIToolsPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current path
  useEffect(() => {
    setCurrentPath('digital-tech-resources', 'ai-tools');
  }, [setCurrentPath]);

  return (
    <>
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <Link href="/digital-tech-resources">Digital/Tech Resources</Link> / 
          <span>AI Tools</span>
        </div>
      </div>
      
      <header className="page-header">
        <h1 className="page-title">AI Tools for Education</h1>
        <p className="page-description">
          Discover how artificial intelligence can transform your teaching practice
        </p>
      </header>
      
      <section className="content-section">
        <h2>Enhancing Education with AI</h2>
        <p>
          Artificial intelligence is revolutionizing how teachers plan lessons, assess student work, 
          and personalize learning. These tools can save time on routine tasks while providing deeper 
          insights into student progress and needs.
        </p>
      </section>
      
      <section className="content-section">
        <h2>Popular AI Tools</h2>
        <div className="card-grid">
          <div>
            <h3>Lesson Plan Generator</h3>
            <p>Create customized lesson plans aligned with curriculum standards in minutes</p>
            <p>Our AI-powered lesson plan generator helps you create comprehensive, 
            engaging lessons while saving hours of preparation time.</p>
          </div>
          
          <div>
            <h3>Automated Grading Assistant</h3>
            <p>Grade assignments and provide feedback more efficiently</p>
            <p>Process student submissions quickly with AI that can evaluate answers, 
            provide constructive feedback, and identify knowledge gaps.</p>
          </div>
          
          <div>
            <h3>Personalized Learning Path Creator</h3>
            <p>Develop customized learning journeys for each student</p>
            <p>Use AI to analyze student performance and automatically generate
            personalized learning paths that address their specific needs.</p>
          </div>
        </div>
      </section>
      
      <section className="content-section">
        <h2>Getting Started with AI</h2>
        <p>
          New to using AI in your classroom? Start small with one tool that addresses
          your most pressing need. Many AI tools offer free tiers that allow you to
          experiment before committing to a paid plan.
        </p>
        <p>
          Remember that AI tools are meant to complement your expertise, not replace it.
          The best results come from combining AI efficiency with your professional judgment.
        </p>
      </section>
    </>
  );
} 