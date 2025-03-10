'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our context state
interface UserData {
  id?: string;
  name?: string;
  email?: string;
  isAuthenticated: boolean;
}

interface AppContextType {
  // User data
  user: UserData;
  setUser: (user: UserData) => void;
  logout: () => void;
  
  // Navigation state
  currentSection: string;
  currentSubsection: string;
  setCurrentPath: (section: string, subsection: string) => void;
  
  // UI state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  
  // Global notifications
  notification: string | null;
  showNotification: (message: string) => void;
  clearNotification: () => void;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  user: { isAuthenticated: false },
  setUser: () => {},
  logout: () => {},
  
  currentSection: '',
  currentSubsection: '',
  setCurrentPath: () => {},
  
  isMobileMenuOpen: false,
  toggleMobileMenu: () => {},
  
  notification: null,
  showNotification: () => {},
  clearNotification: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  // User state
  const [user, setUser] = useState<UserData>({ isAuthenticated: false });
  
  // Navigation state
  const [currentSection, setCurrentSection] = useState('');
  const [currentSubsection, setCurrentSubsection] = useState('');
  
  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification system
  const [notification, setNotification] = useState<string | null>(null);
  
  // Set both section and subsection at once
  const setCurrentPath = (section: string, subsection: string) => {
    setCurrentSection(section);
    setCurrentSubsection(subsection);
  };
  
  // Logout function
  const logout = () => {
    setUser({ isAuthenticated: false });
    // You might also want to clear tokens from localStorage here
    localStorage.removeItem('token');
    showNotification('You have been logged out');
  };
  
  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Notification functions
  const showNotification = (message: string) => {
    setNotification(message);
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  
  const clearNotification = () => {
    setNotification(null);
  };
  
  // Provide all values and functions to components
  return (
    <AppContext.Provider value={{
      user,
      setUser,
      logout,
      
      currentSection,
      currentSubsection,
      setCurrentPath,
      
      isMobileMenuOpen,
      toggleMobileMenu,
      
      notification,
      showNotification,
      clearNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using this context
export function useAppContext() {
  return useContext(AppContext);
} 