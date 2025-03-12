'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  // Redirect to the new auth page
  useEffect(() => {
    redirect('/auth/signin');
  }, []);

  // This renders temporarily before the redirect happens
  return (
    <div className="bg-tan min-h-screen">
      <div className="py-12 px-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Redirecting to Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we redirect you to the new authentication page.
          </p>
        </div>
      </div>
    </div>
  );
} 