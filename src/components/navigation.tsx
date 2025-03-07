'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: Record<string, { path: string; items: { title: string; path: string; }[] }> = {
    'AI Tools': {
      path: '/ai-tools',
      items: [
        { title: 'Lesson Planner', path: '/ai-tools/lesson-planner' },
        { title: 'Text to Worksheet', path: '/ai-tools/text-to-worksheet' },
        { title: 'Behavior Analysis', path: '/ai-tools/behavior-analysis' },
      ],
    },
    'Lesson & Unit Plans': {
      path: '/lesson-plans-unit-plans',
      items: [
        { title: 'Elementary', path: '/lesson-plans-unit-plans/elementary' },
        { title: 'Middle School', path: '/lesson-plans-unit-plans/middle-school' },
        { title: 'High School', path: '/lesson-plans-unit-plans/high-school' },
      ],
    },
    'Classroom Management': {
      path: '/classroom-management',
      items: [
        { title: 'PBIS', path: '/classroom-management/pbis' },
        { title: 'Behavior Strategies', path: '/classroom-management/behavior-strategies' },
        { title: 'Digital Management', path: '/classroom-management/digital-management' },
      ],
    },
    'Educational Research': {
      path: '/educational-research',
      items: [
        { title: 'Brain & Learning', path: '/educational-research/brain-learning' },
        { title: 'Teaching Methods', path: '/educational-research/teaching-methods' },
        { title: 'Assessment', path: '/educational-research/assessment' },
      ],
    },
    'Global News & Policy': {
      path: '/global-news-legislation',
      items: [
        { title: 'Policy Updates', path: '/global-news-legislation/policy-updates' },
        { title: 'International', path: '/global-news-legislation/international' },
        { title: 'Research Findings', path: '/global-news-legislation/research-findings' },
      ],
    },
    'Cliffboard': {
      path: '/cliffboard',
      items: [
        { title: 'Dashboard', path: '/cliffboard/dashboard' },
        { title: 'Student Data', path: '/cliffboard/student-data' },
        { title: 'Reports', path: '/cliffboard/reports' },
      ],
    },
  };

  useEffect(() => {
    setMounted(true);
    
    // Auto-expand section based on current path
    Object.entries(menuItems).forEach(([title, { path }]) => {
      if (pathname.startsWith(path)) {
        setExpandedItem(title);
      }
    });
  }, [pathname, menuItems]);

  const toggleExpand = (title: string, path: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (expandedItem === title) {
      setExpandedItem(null);
    } else {
      setExpandedItem(title);
    }
  };

  const navigateToSection = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="w-64 bg-dark-green text-white fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 border-r border-[#402E32]">
      <div className="p-4 border-b border-dark-green-800">
        <Link 
          href="/"
          className="text-xl font-bold block py-1"
        >
          Clifford Classroom
        </Link>
      </div>

      {mounted && (
        <>
          {/* Search input - currently not functional */}
          {/* 
          <div className="p-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full p-2 bg-dark-green-700 text-white border border-dark-green-800 rounded-md focus:outline-none focus:ring-1 focus:ring-dark-green-500"
            />
          </div>
          */}
          
          <div className="pt-2 pb-16 px-2">
            {Object.entries(menuItems).map(([title, { path, items }]) => (
              <div key={title} className="mb-2">
                <div className="flex justify-between items-center">
                  <Link
                    href={path}
                    className={`flex-grow p-2 rounded-md cursor-pointer ${pathname.startsWith(path) ? 'bg-dark-green-700 text-white' : 'hover:bg-dark-green-800'}`}
                    onClick={() => navigateToSection(path)}
                  >
                    <span>{title}</span>
                  </Link>
                  <button
                    className={`p-2 rounded-md ${pathname.startsWith(path) ? 'bg-dark-green-700 text-white' : 'hover:bg-dark-green-800'}`}
                    onClick={(e) => toggleExpand(title, path, e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-4 h-4 transition-transform duration-200 ${expandedItem === title ? 'rotate-90' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
                
                {expandedItem === title && (
                  <div className="mt-1 ml-2 pl-2 border-l border-dark-green-600">
                    {items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.path}
                        className={`block p-2 rounded-md text-sm ${pathname === item.path ? 'bg-dark-green-700 text-white' : 'text-gray-200 hover:bg-dark-green-800'}`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-green-800 bg-dark-green-700">
            <div className="flex justify-between items-center">
              <Link href="/login" className="text-sm text-white hover:text-gray-200">
                Log In
              </Link>
              <Link href="/signup" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white">
                Sign Up
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
} 