'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  },
  // Add Admin Dashboard directly to the main navigation for admin users
  // It will be conditionally rendered in the map function below
];

export default function NavBar() {
  const { logout, showNotification, hasRole, isAuthenticated, authStatus } = useAppContext();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const handleLogin = () => {
    setLoginInProgress(true);
    signIn('google', { callbackUrl: '/' });
  };
  
  const isAdmin = hasRole('admin');
  
  // Add debugging output
  useEffect(() => {
    console.log('NavBar Auth Status:', authStatus);
    console.log('NavBar Session Status:', status);
    console.log('NavBar Session Data:', session);
    console.log('isAuthenticated:', isAuthenticated);
  }, [authStatus, status, session, isAuthenticated]);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router]);
  
  // Close dropdowns when clicking outside nav
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle dropdown toggle
  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };
  
  // If user is admin, add Admin Dashboard to the navigation items
  const displayNavItems = isAdmin ? [
    ...navItems,
    {
      title: 'Admin Dashboard',
      path: '/admin/dashboard',
      subItems: []
    }
  ] : navItems;
  
  return (
    <nav className="navbar" ref={navRef}>
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
            {displayNavItems.map((item) => (
              <li 
                key={item.path} 
                className={`
                  nav-item 
                  ${item.subItems.length > 0 ? 'dropdown' : ''} 
                  ${activeDropdown === item.title ? 'active' : ''}
                `}
                onMouseEnter={() => item.subItems.length > 0 && setActiveDropdown(item.title)}
                onMouseLeave={() => item.subItems.length > 0 && setActiveDropdown(null)}
              >
                <Link href={item.path} className="nav-link">
                  {item.title}
                </Link>
                {item.subItems.length > 0 && (
                  <div className="dropdown-content">
                    {item.subItems.map((subItem) => (
                      <Link 
                        key={subItem.path} 
                        href={subItem.path} 
                        className="dropdown-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
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
            {status === 'loading' || loginInProgress ? (
              <div className="loading-indicator">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            ) : session?.user ? (
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
        .navbar {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          font-family: var(--font-average, 'Average', serif) !important;
          width: 100%;
        }
        
        .navbar-container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0.75rem 1rem; /* Increased padding */
          max-width: 100%;
          margin: 0;
          height: 70px;
          position: relative; /* Ensure positioned context for dropdowns */
        }
        
        .navbar-logo {
          display: flex;
          align-items: center;
          margin-right: 0.5rem; /* Reduced from 2rem to 0.5rem to close the gap */
          height: 100%;
          min-width: 180px; /* Reduced from 200px */
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          height: 100%;
        }
        
        .logo-image {
          margin-right: 0.5rem;
        }
        
        .logo-text {
          font-weight: 600;
          color: var(--accent, #1B4332);
        }
        
        .navbar-links {
          display: flex;
          align-items: center;
          flex-grow: 1;
          justify-content: space-between;
          height: 100%;
          overflow-x: visible; /* Ensure dropdown menus are visible */
        }
        
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: nowrap; /* Prevent wrapping of nav items */
          height: 100%;
          align-items: center;
          overflow-x: auto; /* Allow horizontal scrolling if needed */
          -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
          scrollbar-width: none; /* Hide scrollbar in Firefox */
          gap: 0.3rem; /* Add gap between nav items for more consistent spacing */
        }
        
        /* Hide scrollbar in WebKit browsers */
        .nav-menu::-webkit-scrollbar {
          display: none;
        }
        
        .nav-item {
          position: relative;
          margin: 0;
          display: flex;
          align-items: center;
          height: 100%;
          white-space: nowrap;
          min-height: 40px;
          height: 40px; /* Fixed height to prevent jittering */
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          color: #000000;
          text-decoration: none;
          white-space: nowrap;
          border: none;
          background: none;
          height: 100%;
          min-height: 40px;
          font-size: 0.9rem;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--accent);
          text-decoration: none;
        }
        
        /* Replace the hover indicator with a stable implementation */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent, #1B4332);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        
        .nav-link:hover::after {
          transform: scaleX(0.7);
        }
        
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
        
        /* Right side items */
        .navbar-right {
          display: flex;
          align-items: center;
          height: 100%;
          margin-left: 0.5rem; /* Reduced from 1rem */
          min-width: fit-content; /* Ensure the user info doesn't shrink too much */
        }
        
        .login-button {
          background: var(--accent);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
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
          height: 100%;
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
          right: 0;
          left: auto;
          width: 240px;
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
        
        /* Mobile menu button - hidden by default */
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          height: 100%;
          align-items: center;
        }
        
        .menu-icon {
          display: block;
          position: relative;
          width: 24px;
          height: 2px;
          background-color: #000000;
        }
        
        .menu-icon::before, .menu-icon::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: #000000;
          transition: all 0.3s ease;
        }
        
        .menu-icon::before {
          top: -6px;
        }
        
        .menu-icon::after {
          bottom: -6px;
        }
        
        /* Responsive styles */
        @media (max-width: 1024px) {
          .navbar-container {
            padding: 0.75rem 0.25rem; /* Further reduced padding */
          }
          
          .navbar-logo {
            min-width: auto; /* Allow logo to shrink on medium screens */
          }
          
          .logo-text {
            font-size: 0.9rem; /* Smaller logo text on medium screens */
          }
          
          .nav-link {
            padding: 0 0.25rem; /* Further reduced padding */
            font-size: 0.85rem; /* Further reduced font size */
          }
        }
        
        @media (max-width: 768px) {
          .navbar-container {
            justify-content: space-between;
          }
          
          .mobile-menu-button {
            display: flex;
          }
          
          .navbar-links {
            position: absolute;
            top: 70px; /* Match height of navbar-container exactly */
            left: 0;
            right: 0;
            background: #ffffff;
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
            display: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 50;
            overflow-y: auto; /* Allow vertical scrolling if needed */
            max-height: calc(100vh - 70px); /* Use calc to ensure not to exceed viewport */
          }
          
          .navbar-links.open {
            display: flex;
          }
          
          .nav-menu {
            flex-direction: column;
            width: 100%;
            margin-bottom: 1rem;
            overflow-x: visible; /* Reset overflow for mobile */
          }
          
          .nav-item {
            width: 100%;
            margin: 0;
          }
          
          .nav-link {
            width: 100%;
            padding: 0.75rem 0;
            font-size: 1rem; /* Reset font size for mobile */
          }
          
          .dropdown-content {
            position: static;
            visibility: visible;
            opacity: 1;
            transform: none;
            display: none;
            border: none;
            box-shadow: none;
            padding-left: 1rem;
            background: transparent;
            width: 100%;
            transition: none;
          }
          
          .dropdown:hover .dropdown-content {
            display: block;
          }
          
          .dropdown-link {
            padding: 0.5rem 0;
          }
          
          .navbar-right {
            width: 100%;
            justify-content: flex-start;
            margin-top: 1rem;
            margin-left: 0;
          }
          
          .user-name {
            display: inline-block;
          }
          
          /* Reset the dropdown padding/margin on mobile */
          .nav-item.dropdown {
            padding-bottom: 0;
            margin-bottom: 0;
          }
          
          /* Explicitly remove the ::before pseudo-element on mobile */
          .dropdown-content::before {
            display: none;
          }
          
          /* Reset hover styles on mobile */
          .nav-link::after {
            display: none;
          }
          
          /* Use display property for dropdown visibility on mobile */
          .dropdown:hover .dropdown-content,
          .dropdown-content:hover {
            display: block;
            visibility: visible;
            opacity: 1;
          }
        }
        
        /* Dropdown styles for desktop - missing previously */
        .dropdown-content {
          position: absolute;
          top: 40px; /* Match the fixed height of nav items */
          left: 0;
          background: #ffffff;
          min-width: 200px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          border-radius: 4px;
          visibility: hidden;
          opacity: 0;
          transform: translateY(0);
          transition: opacity 0.2s ease, visibility 0.2s ease;
          z-index: 10;
          padding: 0.5rem 0;
          pointer-events: none; /* Initially disable pointer events */
          display: block; /* Always keep element in DOM to prevent disappearing */
        }
        
        /* New approach to dropdown hover - use a simpler structure */
        .nav-item.dropdown {
          padding-bottom: 0;
          margin-bottom: 0;
        }
        
        .dropdown-content::before {
          display: none; /* Remove the hover bridge that was causing issues */
        }
        
        /* Improve the nav link hover effect to avoid layout shifts */
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          color: #000000;
          text-decoration: none;
          white-space: nowrap;
          border: none;
          background: none;
          height: 100%;
          min-height: 40px;
          font-size: 0.9rem;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--accent);
          text-decoration: none;
        }
        
        /* Replace the hover indicator with a stable implementation */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent, #1B4332);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        
        .nav-link:hover::after {
          transform: scaleX(0.7);
        }
        
        /* Make dropdown visible on hover without delay */
        .dropdown:hover .dropdown-content,
        .dropdown.active .dropdown-content {
          transform: translateY(0); /* No movement, just visibility/opacity change */
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        
        /* Keep dropdown open when hovering over content */
        .dropdown-content:hover {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        
        /* Add specific styles for active state dropdown */
        .dropdown.active > .nav-link::after {
          transform: scaleX(0.7); /* Match hover state */
        }
        
        /* Force dropdown to remain open when clicking on dropdown content */
        .dropdown.active .dropdown-content,
        .dropdown-content:active {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        
        /* Increase dropdown content z-index to ensure it stays on top */
        .dropdown-content {
          z-index: 60;
        }
        
        /* Add a subtle background color to active dropdown parent for better visual feedback */
        .dropdown.active > .nav-link {
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }

        /* Keep dropdown open when hovering over content */
        .dropdown-content:hover {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Add a stable active state for dropdowns */
        .dropdown.active .dropdown-content {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Remove delay when hiding dropdown */
        .nav-item.dropdown:not(:hover) .dropdown-content {
          transition-delay: 0s;
        }

        /* Make the dropdown links display as block for better touch targets */
        .dropdown-link {
          display: block;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #000000;
          transition: background-color 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          border: none;
          background: none;
          text-align: left;
          width: 100%;
          font-size: 0.9rem;
          border-radius: 2px;
        }

        /* Add specific styles for active state dropdown */
        .dropdown.active > .nav-link::after {
          transform: scaleX(0.7); /* Match hover state using transform instead of width */
        }
      `}</style>
    </nav>
  );
} 