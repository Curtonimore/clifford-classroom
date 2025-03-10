'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function MathematicsPage() {
  const { setCurrentPath } = useAppContext();
  
  // Set the current section without a subsection
  useEffect(() => {
    setCurrentPath('mathematics', '');
  }, [setCurrentPath]);

  const topics = [
    {
      title: 'Algebra',
      path: '/mathematics/algebra',
      description: 'Explore algebraic concepts, equations, and problem-solving strategies.',
      icon: '📊'
    },
    {
      title: 'Geometry',
      path: '/mathematics/geometry',
      description: 'Discover geometric principles, shapes, and spatial relationships.',
      icon: '📐'
    },
    {
      title: 'Calculus',
      path: '/mathematics/calculus',
      description: 'Learn about differentiation, integration, and their applications.',
      icon: '📈'
    }
  ];

  return (
    <>
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / 
          <span>Mathematics</span>
        </div>
      </div>
      
      <header className="page-header">
        <h1>Mathematics</h1>
        <p className="subtitle">
          Discover resources, lesson plans, and teaching materials for various mathematics topics
        </p>
      </header>
      
      <section className="content-section content-centered">
        <div className="card">
          <h2>Teaching Mathematics</h2>
          <p>
            Mathematics is a fundamental subject that develops critical thinking, 
            problem-solving skills, and logical reasoning. Our resources help make 
            complex concepts accessible and engaging for students of all levels.
          </p>
        </div>
      </section>
      
      <section className="content-section">
        <h2 className="section-title">Explore Mathematics Topics</h2>
        <div className="topic-grid">
          {topics.map((topic) => (
            <Link href={topic.path} key={topic.path} className="topic-card">
              <div className="topic-icon">{topic.icon}</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="content-section content-centered">
        <div className="card">
          <h2>Mathematics Teaching Tips</h2>
          <ul className="feature-list">
            <li>Start with concrete examples before moving to abstract concepts</li>
            <li>Use visual representations to reinforce understanding</li>
            <li>Connect mathematics to real-world applications</li>
            <li>Encourage multiple approaches to problem-solving</li>
          </ul>
        </div>
      </section>
    </>
  );
} 