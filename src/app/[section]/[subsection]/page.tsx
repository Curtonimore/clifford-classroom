'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

// Breadcrumb navigation component
function BreadcrumbNav({ section, subsection }: { section: string, subsection: string }) {
  const formattedSection = section.replace(/-/g, ' ');
  const formattedSubsection = subsection.replace(/-/g, ' ');
  
  return (
    <div className="breadcrumb">
      <Link href="/">Home</Link> / 
      <Link href={`/${section}`}>{formattedSection}</Link> / 
      <span>{formattedSubsection}</span>
    </div>
  );
}

export default function SubPage({ 
  params 
}: { 
  params: { section: string; subsection: string } 
}) {
  const { setCurrentPath, showNotification } = useAppContext();
  
  // Update the global path state when component mounts or params change
  useEffect(() => {
    setCurrentPath(params.section, params.subsection);
  }, [params.section, params.subsection, setCurrentPath]);

  // Format the section and subsection for display
  const formattedSection = params.section.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const formattedSubsection = params.subsection.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <>
      <div className="breadcrumb-container">
        <BreadcrumbNav section={params.section} subsection={params.subsection} />
      </div>
      
      <header className="page-header">
        <h1>{formattedSubsection}</h1>
        <p className="subtitle">{formattedSection} Resources</p>
      </header>
      
      <section className="content-section content-centered">
        <div className="card">
          <h2>Overview</h2>
          <p>
            Welcome to the {formattedSubsection} section. Here you'll find resources, 
            lesson plans, and activities designed to help you teach {formattedSubsection} 
            effectively within the {formattedSection} curriculum.
          </p>
          <button 
            onClick={() => showNotification(`You're exploring ${formattedSubsection}!`)} 
            className="button"
          >
            Explore Resources
          </button>
        </div>
      </section>
      
      <section className="content-section">
        <h2 className="section-title">Available Materials</h2>
        <div className="section-grid">
          <div className="card">
            <h3>Lesson Plans</h3>
            <p>Ready-to-use lesson plans for teaching {formattedSubsection}</p>
            <Link href="#" className="button">View Lesson Plans</Link>
          </div>
          
          <div className="card">
            <h3>Activities</h3>
            <p>Engaging activities and worksheets for student practice</p>
            <Link href="#" className="button">Browse Activities</Link>
          </div>
          
          <div className="card">
            <h3>Assessments</h3>
            <p>Quizzes and assessment tools to measure learning</p>
            <Link href="#" className="button">View Assessments</Link>
          </div>
        </div>
      </section>
      
      <section className="content-section content-centered">
        <div className="card">
          <h2>Teaching Tips</h2>
          <p>
            When teaching {formattedSubsection}, consider these helpful strategies:
          </p>
          <ul className="feature-list">
            <li>Connect concepts to real-world applications</li>
            <li>Use visual aids to reinforce understanding</li>
            <li>Incorporate group activities for collaborative learning</li>
            <li>Provide regular feedback and opportunities for reflection</li>
          </ul>
        </div>
      </section>
      
      <NotificationContainer />
    </>
  );
}

// Component to display notifications
function NotificationContainer() {
  const { notification } = useAppContext();
  
  if (!notification) return null;
  
  return (
    <div className="notification">
      {notification}
    </div>
  );
} 