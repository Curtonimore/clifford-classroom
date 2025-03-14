'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginTestPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [mongoError, setMongoError] = useState<string | null>(null);
  
  // Fetch user from MongoDB when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserFromMongo(session.user.email);
    }
  }, [status, session]);
  
  const fetchUserFromMongo = async (email: string) => {
    try {
      const response = await fetch(`/api/debug/find-user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.found) {
        setMongoUser(data.user);
      } else {
        setMongoUser(null);
      }
    } catch (error) {
      console.error('Error fetching user from MongoDB:', error);
      setMongoError(error instanceof Error ? error.message : 'Failed to fetch user from MongoDB');
    }
  };
  
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/login-test' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/login-test' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Login Test Page</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="p-4 bg-gray-100 rounded-md mb-4">
          <p className="font-medium">Status: <span className={`${status === 'authenticated' ? 'text-green-600' : status === 'loading' ? 'text-yellow-600' : 'text-red-600'}`}>{status}</span></p>
        </div>
        
        {status === 'authenticated' && session ? (
          <div className="session-info">
            <div className="flex items-center mb-4">
              {session.user?.image ? (
                <div className="mr-4">
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    width={60} 
                    height={60} 
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl text-blue-500">
                    {session.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{session.user?.name || 'User'}</h3>
                <p className="text-gray-600">{session.user?.email}</p>
                <p className="text-sm mt-1">Role: <span className="font-medium">{session.user?.role || 'unknown'}</span></p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Session Details:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <button 
              onClick={handleLogout}
              disabled={isLoading}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {isLoading ? 'Logging out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-center">You are not signed in.</p>
            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
      </div>
      
      {/* MongoDB User Info */}
      {status === 'authenticated' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">MongoDB User Record</h2>
          
          {mongoError ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              <p>Error: {mongoError}</p>
            </div>
          ) : mongoUser ? (
            <div>
              <p className="mb-2">User found in MongoDB database:</p>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(mongoUser, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
              <p>No user record found in MongoDB for this email.</p>
              <p className="mt-2">This means your session exists but your user profile hasn't been saved to the database.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
} 