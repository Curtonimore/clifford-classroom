'use client';

import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-700">Page Not Found</h2>
        
        <p className="mt-6 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-white transition duration-150 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
        
        <div className="mt-10 space-y-2 text-left">
          <h3 className="text-lg font-medium text-gray-800">Looking for something specific?</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/lesson-plan" className="text-blue-600 hover:underline">
                Create a Lesson Plan
              </Link>
            </li>
            <li>
              <Link href="/resources" className="text-blue-600 hover:underline">
                Browse Resources
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-blue-600 hover:underline">
                Your Profile
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 