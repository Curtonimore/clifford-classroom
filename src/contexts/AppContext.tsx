'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface AppContextType {
  currentSection: string;
  currentSubsection: string;
  setCurrentPath: (section: string, subsection: string) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  notifications: Array<{ id: number; message: string; type: string }>;
  dismissNotification: (id: number) => void;
  hasRole: (role: string) => boolean;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  currentSection: '',
  currentSubsection: '',
  setCurrentPath: () => {},
  showNotification: () => {},
  notifications: [],
  dismissNotification: () => {},
  hasRole: () => false,
});

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState('');
  const [currentSubsection, setCurrentSubsection] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: string }>>([]);
  const [notificationId, setNotificationId] = useState(0);

  // Update the current path
  const setCurrentPath = (section: string, subsection: string) => {
    setCurrentSection(section);
    setCurrentSubsection(subsection);
  };

  // Show a notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = notificationId;
    setNotificationId(prev => prev + 1);
    
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  // Dismiss a notification
  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Check if the user has a specific role (placeholder implementation)
  const hasRole = (role: string) => {
    // This would normally check the user's role from a session
    return true;
  };

  return (
    <AppContext.Provider 
      value={{ 
        currentSection, 
        currentSubsection, 
        setCurrentPath,
        showNotification,
        notifications,
        dismissNotification,
        hasRole,
      }}
    >
      {children}
      
      {/* Notification display */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 rounded shadow-md flex justify-between items-center ${
                notification.type === 'success' ? 'bg-green-100 text-green-800' :
                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}
            >
              <span>{notification.message}</span>
              <button 
                onClick={() => dismissNotification(notification.id)}
                className="ml-3 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  return useContext(AppContext);
} 