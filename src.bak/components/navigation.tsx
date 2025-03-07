'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const menuItems = {
    // Add your menu items here
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="space-y-1">
        {Object.entries(menuItems).map(([title, { path, items }]) => (
          <div key={title} className="w-full">
            <button
              onClick={() => setExpandedItem(expandedItem === title ? null : title)}
              className="w-full text-left text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-between"
            >
              {title}
              <span className="ml-2">{expandedItem === title ? '−' : '+'}</span>
            </button>
            {expandedItem === title && (
              <div className="pl-6">
                {items.map((item) => (
                  <Link
                    key={item}
                    href={`${path}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
} 