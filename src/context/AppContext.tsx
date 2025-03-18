'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Role } from '@/lib/auth';

// Interface for user with role
interface UserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
}

// Define subscription types
export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  expiresAt: string | null;
  features: string[];
  aiCreditsRemaining: number;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Define types for our context state
interface AppContextType {
  // Navigation state
  currentSection: string;
  currentSubsection: string;
  setCurrentPath: (section: string, subsection: string) => void;
  
  // UI state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  
  // Global notifications
  notification: string | null;
  notificationType: NotificationType;
  showNotification: (message: string, type?: NotificationType) => void;
  clearNotification: () => void;
  
  // Auth helper functions
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  isAuthenticated: boolean;
  authStatus: string;
  
  // Subscription related functions
  userSubscription: SubscriptionInfo | null;
  getUserSubscription: () => SubscriptionInfo | null;
  isSubscriptionActive: () => boolean;
  hasFeature: (feature: string) => boolean;
  getAICreditsRemaining: () => number;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  currentSection: '',
  currentSubsection: '',
  setCurrentPath: () => {},
  
  isMobileMenuOpen: false,
  toggleMobileMenu: () => {},
  
  notification: null,
  notificationType: 'info',
  showNotification: () => {},
  clearNotification: () => {},
  
  logout: async () => {},
  hasRole: () => false,
  isAuthenticated: false,
  authStatus: '',
  
  userSubscription: null,
  getUserSubscription: () => null,
  isSubscriptionActive: () => false,
  hasFeature: () => false,
  getAICreditsRemaining: () => 0,
});

export function AppProvider({ children }: { children: ReactNode }) {
  // Get session from Auth.js
  const { data: session, status: authStatus } = useSession();
  
  // Navigation state
  const [currentSection, setCurrentSection] = useState('');
  const [currentSubsection, setCurrentSubsection] = useState('');
  
  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification system
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>('info');
  
  // Subscription state - always provide full access
  const [userSubscription, setUserSubscription] = useState<SubscriptionInfo>({
    tier: 'premium',
    expiresAt: null,
    features: [
      'unlimited_lesson_plans',
      'save_lesson_plans',
      'export_lesson_plans',
      'ai_generation',
      'advanced_customization'
    ],
    aiCreditsRemaining: Infinity
  });
  
  // Authentication state for UI
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  
  // Update authentication state when session changes
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user) {
      setIsAuthenticated(true);
      // Also show a notification when user logs in successfully
      showNotification(`Welcome back, ${session.user.name || 'User'}!`);
    } else {
      // Still consider user authenticated for feature access
      setIsAuthenticated(true);
    }
  }, [authStatus, session]);
  
  // Set both section and subsection at once
  const setCurrentPath = (section: string, subsection: string) => {
    setCurrentSection(section);
    setCurrentSubsection(subsection);
  };
  
  // Auth.js logout function
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
    showNotification('You have been logged out');
    // Explicitly update our local state - but keep subscription active
    setIsAuthenticated(true);
    // Don't set userSubscription to null
  };
  
  // Role check helper - improved version
  const hasRole = (role: Role): boolean => {
    if (!session?.user || authStatus !== 'authenticated') return false;
    
    // First check session role (from MongoDB)
    const userRole = (session.user as UserWithRole).role || 'user';
    
    // If that fails, check localStorage (development workaround)
    const isLocalAdmin = typeof window !== 'undefined' && 
      localStorage.getItem('user_role') === 'admin' && 
      localStorage.getItem('admin_email') === session.user.email;
    
    // Log status for debugging
    console.log('Auth status:', authStatus);
    console.log('User role:', userRole);
    console.log('Session:', session?.user);
    
    if (role === 'admin') {
      return userRole === 'admin' || isLocalAdmin;
    }
    
    if (role === 'premium') {
      return userRole === 'admin' || userRole === 'premium' || isLocalAdmin;
    }
    
    return true; // Everyone is at least a basic user
  };
  
  // User subscription & storage usage - always return full access
  useEffect(() => {
    // No need to fetch subscription - we're using the default full access
  }, []);
  
  // Get user subscription
  const getUserSubscription = (): SubscriptionInfo => {
    return userSubscription;
  };
  
  // Check if user has an active subscription (always true)
  const isSubscriptionActive = (): boolean => {
    return true;
  };
  
  // Check if user has a specific feature (always true)
  const hasFeature = (feature: string): boolean => {
    return true;
  };
  
  // Get AI credits remaining (always infinite)
  const getAICreditsRemaining = (): number => {
    return Infinity;
  };
  
  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Notification functions
  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification(message);
    setNotificationType(type);
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
      currentSection,
      currentSubsection,
      setCurrentPath,
      
      isMobileMenuOpen,
      toggleMobileMenu,
      
      notification,
      notificationType,
      showNotification,
      clearNotification,
      
      logout,
      hasRole,
      isAuthenticated,
      authStatus,
      
      userSubscription,
      getUserSubscription,
      isSubscriptionActive,
      hasFeature,
      getAICreditsRemaining,
    }}>
      {children}
      
      {/* Add global notification display */}
      {notification && (
        <div className="notification-container">
          <div className="notification">
            {notification}
            <button onClick={clearNotification} className="notification-close">×</button>
          </div>
          <style jsx>{`
            .notification-container {
              position: fixed;
              bottom: 20px;
              right: 20px;
              z-index: 1000;
            }
            .notification {
              background-color: var(--accent, #1B4332);
              color: white;
              padding: 12px 20px;
              border-radius: 4px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              max-width: 400px;
            }
            .notification-close {
              background: none;
              border: none;
              color: white;
              font-size: 20px;
              margin-left: 15px;
              cursor: pointer;
            }
          `}</style>
        </div>
      )}
    </AppContext.Provider>
  );
}

// Custom hook for using this context
export function useAppContext() {
  return useContext(AppContext);
} 