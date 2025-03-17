'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  
  useEffect(() => {
    // Check for error in URL
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'AccessDenied':
          setError('Access denied. You may not have permission to sign in.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Email already exists with a different provider.');
          break;
        default:
          setError(`An error occurred during sign in: ${errorParam}`);
      }
    }
  }, [searchParams]);
  
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Use direct redirect mode with callbackUrl
    signIn('google', { callbackUrl });
  };
  
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.203-2.701-6.735-2.701-5.522 0-9.999 4.477-9.999 9.999s4.477 9.999 9.999 9.999c8.396 0 10.089-7.931 9.278-11.662l-9.278-0.003z" fill="#4285F4"/>
        </svg>
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
          Privacy Policy
        </Link>
      </p>
      
      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
          Return to Home
        </Link>
      </div>
    </div>
  );
} 