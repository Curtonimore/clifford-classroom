'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function AITeachingTools() {
  const { setCurrentPath } = useAppContext();
  
  useEffect(() => {
    setCurrentPath('ai-teaching-tools', '');
  }, [setCurrentPath]);
  
  // Define the tools
  const tools = [
    {
      id: 'lesson-plan',
      title: 'Lesson Plan Generator',
      description: 'Create comprehensive, customized lesson plans tailored to your curriculum and teaching needs.',
      imageSrc: '/images/lesson-plan-icon.svg',
      imageAlt: 'Lesson plan icon',
      path: '/lesson-plan',
      available: true
    },
    {
      id: 'worksheet',
      title: 'Worksheet Generator',
      description: 'Generate engaging, curriculum-aligned worksheets for any subject and grade level.',
      imageSrc: '/images/worksheet-icon.svg',
      imageAlt: 'Worksheet icon',
      path: '/ai-teaching-tools/worksheet-generator',
      available: false,
      comingSoon: true
    },
    {
      id: 'story',
      title: 'Story Generator',
      description: 'Create customized educational stories and narrative content for your classroom.',
      imageSrc: '/images/story-icon.svg',
      imageAlt: 'Story icon',
      path: '/ai-teaching-tools/story-generator',
      available: false,
      comingSoon: true
    }
  ];
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">AI Teaching Tools</h1>
        <p className="page-description">
          Powerful AI-powered tools to enhance your teaching and save you time
        </p>
      </header>
      
      <section className="content-section">
        <h2>Available Tools</h2>
        <p>
          Leverage the power of artificial intelligence to create high-quality educational content in minutes. 
          Our suite of AI tools is designed to help teachers focus on what matters most - teaching and connecting with students.
        </p>
        
        <div className="tools-grid">
          {tools.map(tool => (
            <div key={tool.id} className={`tool-card ${!tool.available ? 'tool-card-disabled' : ''}`}>
              <div className="tool-icon">
                {tool.imageSrc ? (
                  <Image 
                    src={tool.imageSrc} 
                    alt={tool.imageAlt} 
                    width={64} 
                    height={64} 
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.src = '/images/default-tool-icon.svg';
                    }}
                  />
                ) : (
                  <div className="placeholder-icon">{tool.title.charAt(0)}</div>
                )}
              </div>
              
              <h3 className="tool-title">
                {tool.title}
                {tool.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
              </h3>
              
              <p className="tool-description">{tool.description}</p>
              
              {tool.available ? (
                <Link href={tool.path} className="tool-button">
                  Launch Tool
                </Link>
              ) : (
                <button className="tool-button disabled" disabled>
                  {tool.comingSoon ? 'Coming Soon' : 'Unavailable'}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      
      <section className="content-section">
        <h2>How AI Can Transform Your Teaching</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <h3>Save Time</h3>
            <p>Create in minutes what would normally take hours. Focus your time on interacting with students, not on administrative tasks.</p>
          </div>
          
          <div className="benefit-item">
            <h3>Personalize Learning</h3>
            <p>Easily customize content for different learning styles, levels, and needs. Differentiate instruction without the extra work.</p>
          </div>
          
          <div className="benefit-item">
            <h3>Stay Fresh</h3>
            <p>Generate new, engaging materials whenever you need them. Keep your teaching materials current and exciting.</p>
          </div>
          
          <div className="benefit-item">
            <h3>Extend Your Creativity</h3>
            <p>Use AI as a creative partner to inspire new ideas and approaches to teaching familiar content.</p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .tool-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .tool-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .tool-card-disabled {
          opacity: 0.7;
        }
        
        .tool-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .placeholder-icon {
          width: 64px;
          height: 64px;
          background-color: #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #666;
        }
        
        .tool-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .coming-soon-badge {
          font-size: 0.7rem;
          background-color: #f9a826;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 0.25rem;
          margin-left: 0.5rem;
          vertical-align: middle;
          display: inline-block;
        }
        
        .tool-description {
          color: #666;
          flex-grow: 1;
          margin-bottom: 1.5rem;
        }
        
        .tool-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 0.25rem;
          text-align: center;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          text-decoration: none;
          display: inline-block;
          width: 100%;
        }
        
        .tool-button:hover {
          background-color: #0053b3;
        }
        
        .tool-button.disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .benefits-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .benefit-item {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .benefit-item h3 {
          color: #0070f3;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
} 