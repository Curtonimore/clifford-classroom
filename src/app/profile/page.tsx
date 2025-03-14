'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';

interface FormData {
  name: string;
  image: string;
  bio: string;
  school: string;
  position: string;
  gradeLevel: string;
  subjects: string[];
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setCurrentPath, showNotification } = useAppContext();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    image: '',
    bio: '',
    school: '',
    position: '',
    gradeLevel: '',
    subjects: [],
    preferences: {
      theme: 'light',
      notifications: true
    }
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Available options for dropdowns
  const gradeLevelOptions = [
    'Pre-K', 'Kindergarten',
    '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade',
    '9th Grade', '10th Grade', '11th Grade', '12th Grade',
    'Higher Education', 'Adult Education', 'Other'
  ];
  
  const subjectOptions = [
    'Mathematics', 'English/Language Arts', 'Science', 'Social Studies/History',
    'Computer Science', 'Foreign Languages', 'Art', 'Music',
    'Physical Education', 'Special Education', 'Other'
  ];
  
  // Load user profile
  useEffect(() => {
    setCurrentPath('account', 'profile');
    
    // Don't attempt to load profile for unauthenticated users
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated' && !profileLoaded) {
      loadUserProfile();
    }
  }, [status, setCurrentPath, router, profileLoaded]);
  
  // Load the user profile from the database
  const loadUserProfile = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/users/profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load profile');
      }
      
      const data = await response.json();
      
      // Update form with user data, keeping defaults for missing fields
      if (data.user) {
        setFormData({
          name: data.user.name || session?.user?.name || '',
          image: data.user.image || session?.user?.image || '',
          bio: data.user.bio || '',
          school: data.user.school || '',
          position: data.user.position || '',
          gradeLevel: data.user.gradeLevel || '',
          subjects: data.user.subjects || [],
          preferences: data.user.preferences || {
            theme: 'light',
            notifications: true
          }
        });
      } else {
        // User not found in database, use session data
        setFormData({
          ...formData,
          name: session?.user?.name || '',
          image: session?.user?.image || ''
        });
      }
      
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
      showNotification('Error loading profile. Using session data instead.', 'error');
      
      // Use session data as fallback
      if (session?.user) {
        setFormData({
          ...formData,
          name: session.user.name || '',
          image: session.user.image || ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., preferences.theme)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle subject selection (multiple)
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    
    setFormData({
      ...formData,
      subjects: selectedOptions
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      setMessage('Profile updated successfully!');
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      showNotification('Error updating profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show login page for unauthenticated users
  if (status === 'unauthenticated') {
    return null; // Router will redirect
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner w-12 h-12"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          {message && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column - Basic info */}
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                {/* Profile picture */}
                <div className="mb-6 flex flex-col items-center">
                  {formData.image ? (
                    <div className="mb-2 relative w-32 h-32 rounded-full overflow-hidden">
                      <Image 
                        src={formData.image}
                        alt={formData.name || 'Profile picture'}
                        fill
                        style={{objectFit: 'cover'}}
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="mb-2 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-500">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-2">Profile image is from your login provider</p>
                </div>
                
                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                {/* Bio */}
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 font-medium mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
              
              {/* Right column - Teaching info */}
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Teaching Information</h2>
                
                {/* School */}
                <div className="mb-4">
                  <label htmlFor="school" className="block text-gray-700 font-medium mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your school or institution"
                  />
                </div>
                
                {/* Position */}
                <div className="mb-4">
                  <label htmlFor="position" className="block text-gray-700 font-medium mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Math Teacher, Principal, etc."
                  />
                </div>
                
                {/* Grade Level */}
                <div className="mb-4">
                  <label htmlFor="gradeLevel" className="block text-gray-700 font-medium mb-1">
                    Grade Level
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a grade level</option>
                    {gradeLevelOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                
                {/* Subjects */}
                <div className="mb-6">
                  <label htmlFor="subjects" className="block text-gray-700 font-medium mb-1">
                    Subjects (hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    id="subjects"
                    name="subjects"
                    multiple
                    value={formData.subjects}
                    onChange={handleSubjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={5}
                  >
                    {subjectOptions.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Selected: {formData.subjects.join(', ') || 'None'}</p>
                </div>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 