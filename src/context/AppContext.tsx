'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { UserWithRole, Role } from '@/lib/auth';

// Define subscription types
export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  expiresAt: string | null;
  features: string[];
  aiCreditsRemaining: number;
}

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
  showNotification: (message: string) => void;
  clearNotification: () => void;
  
  // Auth helper functions
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  
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
  showNotification: () => {},
  clearNotification: () => {},
  
  logout: async () => {},
  hasRole: () => false,
  
  userSubscription: null,
  getUserSubscription: () => null,
  isSubscriptionActive: () => false,
  hasFeature: () => false,
  getAICreditsRemaining: () => 0,
});

export function AppProvider({ children }: { children: ReactNode }) {
  // Get session from Auth.js
  const { data: session } = useSession();
  
  // Navigation state
  const [currentSection, setCurrentSection] = useState('');
  const [currentSubsection, setCurrentSubsection] = useState('');
  
  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification system
  const [notification, setNotification] = useState<string | null>(null);
  
  // Subscription state
  const [userSubscription, setUserSubscription] = useState<SubscriptionInfo | null>(null);
  
  // Set both section and subsection at once
  const setCurrentPath = (section: string, subsection: string) => {
    setCurrentSection(section);
    setCurrentSubsection(subsection);
  };
  
  // Auth.js logout function
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
    showNotification('You have been logged out');
  };
  
  // Role check helper
  const hasRole = (role: Role): boolean => {
    if (!session?.user) return false;
    
    const userRole = (session.user as UserWithRole).role || 'user';
    
    if (role === 'admin') {
      return userRole === 'admin';
    }
    
    if (role === 'premium') {
      return userRole === 'admin' || userRole === 'premium';
    }
    
    return true; // Everyone is at least a basic user
  };
  
  // Subscription helpers
  useEffect(() => {
    if (session?.user) {
      // In a real app, this would fetch subscription data from your API/database
      // For now, we'll simulate it with some mock data
      const mockSubscriptionInfo: SubscriptionInfo = {
        tier: 'free',
        expiresAt: null,
        features: ['demo_lesson_plans', 'basic_profile'],
        aiCreditsRemaining: 5
      };
      
      // If user is an admin, give them premium features
      if (hasRole('admin')) {
        mockSubscriptionInfo.tier = 'premium';
        mockSubscriptionInfo.features = [
          'unlimited_lesson_plans',
          'advanced_customization',
          'admin_dashboard',
          'export_all_formats',
          'priority_support'
        ];
        mockSubscriptionInfo.aiCreditsRemaining = 999;
      }
      
      setUserSubscription(mockSubscriptionInfo);
    } else {
      setUserSubscription(null);
    }
  }, [session]);
  
  // Get subscription info
  const getUserSubscription = (): SubscriptionInfo | null => {
    return userSubscription;
  };
  
  // Check if user has an active subscription (any tier above free)
  const isSubscriptionActive = (): boolean => {
    if (!userSubscription) return false;
    
    if (userSubscription.tier === 'free') return false;
    
    // Check expiration if there is one
    if (userSubscription.expiresAt) {
      const expirationDate = new Date(userSubscription.expiresAt);
      if (expirationDate < new Date()) return false;
    }
    
    return true;
  };
  
  // Check if user has a specific feature
  const hasFeature = (feature: string): boolean => {
    if (!userSubscription) return false;
    return userSubscription.features.includes(feature);
  };
  
  // Get AI credits remaining
  const getAICreditsRemaining = (): number => {
    if (!userSubscription) return 0;
    return userSubscription.aiCreditsRemaining;
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
      currentSection,
      currentSubsection,
      setCurrentPath,
      
      isMobileMenuOpen,
      toggleMobileMenu,
      
      notification,
      showNotification,
      clearNotification,
      
      logout,
      hasRole,
      
      userSubscription,
      getUserSubscription,
      isSubscriptionActive,
      hasFeature,
      getAICreditsRemaining,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using this context
export function useAppContext() {
  return useContext(AppContext);
} 