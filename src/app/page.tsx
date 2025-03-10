'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function HomePage() {
  const { showNotification } = useAppContext();

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Welcome to Clifford Classroom</h1>
        <p className="page-description">
          Helping educators navigate teaching in the digital age
        </p>
      </header>

      <section className="content-section">
        <h2>About Clifford Classroom</h2>
        <p>
          Clifford Classroom is a comprehensive resource platform for educators. We provide tools, 
          articles, and insights to help teachers adapt to an ever-changing educational landscape.
        </p>
        <p>
          As education continues to evolve alongside technology and society, we're committed to 
          supporting teachers with practical resources, timely information, and innovative tools.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/about" className="home-button primary">
            Learn More About Us
          </Link>
          <Link href="/support" className="home-button secondary">
            Support Our Mission
          </Link>
        </div>
      </section>

      <section className="content-section">
        <h2>Explore Our Resources</h2>
        <div className="card-grid">
          <div>
            <h3>AI-Powered Tools</h3>
            <p>Our lesson plan generator and other AI tools help streamline your teaching preparation.</p>
            <Link href="/lesson-plan">
              Explore Lesson Planner
            </Link>
          </div>

          <div>
            <h3>Stay Informed</h3>
            <p>Keep up with the latest in EdTech, legislation, and educational research.</p>
            <Link href="/articles">
              Browse Articles
            </Link>
          </div>

          <div>
            <h3>Teacher Resources</h3>
            <p>Access curated teaching materials and resources for your classroom.</p>
            <Link href="/resources">
              View Resources
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Education in the Digital Age</h2>
        <p>
          Today's educators face unique challenges as technology reshapes how we teach and learn. 
          From AI tools to changing educational policies, staying current has never been more important.
        </p>
        <p>
          At Clifford Classroom, we monitor trends, research the latest teaching approaches, and 
          provide timely updates to help you navigate this evolving landscape with confidence.
        </p>
        <ul className="feature-list">
          <li>Adapting to technology-driven educational changes</li>
          <li>Understanding new learning modalities and student needs</li>
          <li>Keeping current with educational research and best practices</li>
          <li>Balancing traditional teaching wisdom with innovative approaches</li>
        </ul>
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
