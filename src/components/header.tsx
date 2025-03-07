'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine the title based on pathname
  const getTitle = () => {
    if (isHomePage) return 'Clifford Classroom';
    
    // Extract section and subsection from pathname
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Clifford Classroom';
    
    if (parts.length === 1) {
      // Capitalize each word in the section
      return parts[0].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    if (parts.length >= 2) {
      // Capitalize each word in both section and subsection
      const section = parts[0].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const subsection = parts[1].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return `${section} - ${subsection}`;
    }
    
    return 'Clifford Classroom';
  };

  const title = getTitle();

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 ml-64 border border-[#402E32]
        ${scrolled || !isHomePage 
          ? 'bg-dark-green text-white shadow-md' 
          : 'bg-transparent text-white'}`
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          {title}
        </Link>
        <div className="flex gap-4 items-center">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-md text-sm font-medium hover:bg-dark-green-700 transition-all duration-200"
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 bg-light-blue text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
} 