'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useState } from 'react';

// Define updated navigation structure based on the prompts
const navItems = [
  {
    title: 'Home',
    path: '/',
    subItems: []
  },
  {
    title: 'About',
    path: '/about',
    subItems: []
  },
  {
    title: 'Articles',
    path: '/articles',
    subItems: [
      { title: 'EdTech News', path: '/articles/edtech' },
      { title: 'Legislation', path: '/articles/legislation' },
      { title: 'Mind Matters', path: '/articles/mind-matters' }
    ]
  },
  {
    title: 'Lesson Plan Generator',
    path: '/lesson-plan',
    subItems: []
  },
  {
    title: 'Meme Tracker',
    path: '/meme-tracker',
    subItems: []
  },
  {
    title: 'Resources',
    path: '/resources',
    subItems: []
  },
  {
    title: 'CliffTech Software',
    path: '/clifftech-software',
    subItems: [
      { title: 'Educational Tools', path: '/clifftech-software/educational-tools' },
      { title: 'Assessment Systems', path: '/clifftech-software/assessment-systems' },
      { title: 'Learning Analytics', path: '/clifftech-software/learning-analytics' }
    ]
  },
  {
    title: 'Support',
    path: '/support',
    subItems: []
  }
];

export default function NavBar() {
  const { user, logout, showNotification, setUser } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogin = () => {
    // For demo purposes, we're just setting the user directly
    const demoUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      isAuthenticated: true
    };
    
    setUser(demoUser);
    showNotification('Successfully logged in as Demo User');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/">
            Clifford Classroom
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="menu-icon"></span>
        </button>
        
        {/* Main navigation */}
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.path} className={item.subItems.length > 0 ? 'nav-item dropdown' : 'nav-item'}>
                <Link href={item.path} className="nav-link">
                  {item.title}
                </Link>
                {item.subItems.length > 0 && (
                  <div className="dropdown-content">
                    {item.subItems.map((subItem) => (
                      <Link key={subItem.path} href={subItem.path} className="dropdown-link">
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {/* Right side items */}
          <div className="navbar-right">
            {user.isAuthenticated ? (
              <div className="user-menu dropdown">
                <button className="nav-link user-button">
                  {user.name || 'User'} ▼
                </button>
                <div className="dropdown-content">
                  <Link href="/profile" className="dropdown-link">Profile</Link>
                  <Link href="/settings" className="dropdown-link">Settings</Link>
                  <button onClick={logout} className="dropdown-link">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogin} className="login-button">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 