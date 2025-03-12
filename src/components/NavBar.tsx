'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

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
    title: 'AI Teaching Tools',
    path: '/ai-teaching-tools',
    subItems: [
      { title: 'Lesson Plan Generator', path: '/lesson-plan' },
      { title: 'Worksheet Generator', path: '/ai-teaching-tools/worksheet-generator' },
      { title: 'Story Generator', path: '/ai-teaching-tools/story-generator' }
    ]
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
    title: 'CliffTech',
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
  const { logout, showNotification, hasRole } = useAppContext();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };
  
  const isAdmin = hasRole('admin');
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/" className="logo-link">
            <Image 
              src="/clifford-logo.svg" 
              alt="Clifford Classroom Logo" 
              width={48} 
              height={48} 
              className="logo-image"
            />
            <span className="logo-text">Clifford Classroom</span>
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
            {status === 'loading' ? (
              <div className="loading-indicator">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            ) : session ? (
              <div className="user-menu dropdown">
                <button className="nav-link user-button">
                  <div className="user-info">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user?.name || 'User'} 
                        width={32} 
                        height={32}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="user-name">
                      {session.user?.name || 'User'} {isAdmin && <span className="admin-badge">Admin</span>}
                    </span>
                  </div>
                </button>
                <div className="dropdown-content user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-username">{session.user?.name || 'User'}</div>
                    <div className="dropdown-email">{session.user?.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link href="/profile" className="dropdown-link">
                    <span className="dropdown-icon">👤</span> Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="dropdown-link">
                      <span className="dropdown-icon">⚙️</span> Admin Dashboard
                    </Link>
                  )}
                  <Link href="/settings" className="dropdown-link">
                    <span className="dropdown-icon">🔧</span> Settings
                  </Link>
                  <Link href="/subscription" className="dropdown-link">
                    <span className="dropdown-icon">⭐</span> Subscription
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={logout} className="dropdown-link logout-link">
                    <span className="dropdown-icon">🚪</span> Logout
                  </button>
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
      
      <style jsx>{`
        .loading-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem;
        }
        
        .loading-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #0070f3;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        .user-button {
          display: flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 9999px;
          transition: background-color 0.2s;
        }
        
        .user-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }
        
        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #0070f3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .admin-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
          background-color: #9333ea;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          margin-left: 0.25rem;
          text-transform: uppercase;
        }
        
        .user-dropdown {
          width: 240px;
          padding: 0;
          overflow: hidden;
        }
        
        .dropdown-header {
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .dropdown-username {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.875rem;
        }
        
        .dropdown-email {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 0.25rem 0;
        }
        
        .dropdown-icon {
          display: inline-block;
          width: 20px;
          text-align: center;
          margin-right: 0.5rem;
        }
        
        .logout-link {
          color: #ef4444;
        }
        
        .logout-link:hover {
          background-color: #fee2e2;
        }
        
        @media (max-width: 768px) {
          .user-name {
            display: none;
          }
          
          .user-info {
            gap: 0;
          }
        }
      `}</style>
    </nav>
  );
} 