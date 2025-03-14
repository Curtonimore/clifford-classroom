'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Define user type
interface User {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'user' | 'premium' | 'admin';
  subscription: {
    tier: 'free' | 'basic' | 'premium';
    aiCreditsRemaining: number;
    features: string[];
    expiresAt: string | null;
  };
  createdAt: string;
}

// Define storage limits per subscription tier - keep in sync with the API endpoints
const STORAGE_LIMITS = {
  free: 25,      // Free users can store up to 25 lesson plans
  basic: 100,    // Basic users can store up to 100 lesson plans
  premium: 500,  // Premium users can store up to 500 lesson plans
  admin: Infinity // Admins have unlimited storage
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const { setCurrentPath, showNotification, hasRole } = useAppContext();
  
  // State for users and UI
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for user editing
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Track debugging status
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    mongoStatus: 'unknown' | 'connected' | 'error';
    mongoError: string | null;
    apiResponses: Array<{
      endpoint: string;
      status: number;
      data: any;
      timestamp: string;
    }>;
    vercelEnv: string | null;
    nodeEnv: string | null;
  }>({
    mongoStatus: 'unknown',
    mongoError: null,
    apiResponses: [],
    vercelEnv: null,
    nodeEnv: null
  });
  
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  
  useEffect(() => {
    setCurrentPath('admin', 'dashboard');
    
    // Fetch users when component mounts
    if (status === 'authenticated') {
      fetchUsers();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, setCurrentPath]);
  
  // Check if user is admin and redirect if not
  useEffect(() => {
    if (status !== 'loading' && !hasRole('admin')) {
      redirect('/');
    }
  }, [status, hasRole]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Admin Dashboard: Fetching users...');
      const response = await fetch('/api/admin/users');
      
      console.log('Admin Dashboard: Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Admin Dashboard: Error response:', errorData);
        throw new Error(errorData.error || `Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Admin Dashboard: Fetched ${data.users?.length || 0} users`);
      
      if (!data.users || !Array.isArray(data.users)) {
        console.error('Admin Dashboard: Invalid users data format:', data);
        throw new Error('Invalid response format - users data is missing or not an array');
      }
      
      setUsers(data.users);
    } catch (error) {
      console.error('Admin Dashboard: Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Error loading users. Please try again.');
      showNotification('Error loading users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, newRole: 'user' | 'premium' | 'admin') => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      showNotification('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      showNotification('Error updating user role. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const updateSubscription = async (userId: string, subscriptionData: {
    tier: 'free' | 'basic' | 'premium',
    aiCreditsRemaining?: number,
    features?: string[]
  }) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/admin/users/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription: subscriptionData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { 
              ...user, 
              subscription: { 
                // Create a default subscription object if it doesn't exist
                ...(user.subscription || {
                  tier: 'free',
                  aiCreditsRemaining: 0,
                  features: [],
                  expiresAt: null
                }), 
                ...subscriptionData 
              } 
            } 
          : user
      ));
      
      showNotification('User subscription updated successfully');
    } catch (error) {
      console.error('Error updating subscription:', error);
      showNotification('Error updating subscription. Please try again.');
    } finally {
      setIsUpdating(false);
      setEditingUser(null);
    }
  };
  
  const addCredits = async (userId: string, credits: number) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/admin/users/add-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          credits,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add credits');
      }
      
      const data = await response.json();
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { 
              ...user, 
              subscription: { 
                // Create a default subscription object if it doesn't exist
                ...(user.subscription || {
                  tier: 'free',
                  aiCreditsRemaining: 0,
                  features: [],
                  expiresAt: null
                }), 
                aiCreditsRemaining: data.newCredits
              } 
            } 
          : user
      ));
      
      showNotification(`Added ${credits} credits successfully`);
    } catch (error) {
      console.error('Error adding credits:', error);
      showNotification('Error adding credits. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.subscription?.tier.toLowerCase().includes(searchLower)
    );
  });
  
  // Function to check MongoDB connection status
  const checkMongoConnection = async () => {
    try {
      const response = await fetch('/api/debug/mongo-status');
      const data = await response.json();
      
      // Log the raw response for diagnosis
      console.log('Debug: MongoDB status check response:', data);
      
      setDebugInfo(prev => ({
        ...prev,
        mongoStatus: data.connected ? 'connected' : 'error',
        mongoError: data.error || null,
        apiResponses: [
          {
            endpoint: '/api/debug/mongo-status',
            status: response.status,
            data,
            timestamp: new Date().toISOString()
          },
          ...prev.apiResponses
        ],
        vercelEnv: data.vercelEnv || null,
        nodeEnv: data.nodeEnv || null
      }));
      
      return data.connected;
    } catch (error) {
      console.error('Debug: Error checking MongoDB connection:', error);
      
      setDebugInfo(prev => ({
        ...prev,
        mongoStatus: 'error',
        mongoError: error instanceof Error ? error.message : 'Unknown error',
        apiResponses: [
          {
            endpoint: '/api/debug/mongo-status',
            status: 500,
            data: { error: error instanceof Error ? error.message : 'Unknown error' },
            timestamp: new Date().toISOString()
          },
          ...prev.apiResponses
        ]
      }));
      
      return false;
    }
  };
  
  const checkDatabaseConnection = async () => {
    setIsCheckingDb(true);
    setDbStatus(null);
    
    try {
      const response = await fetch('/api/debug/mongodb');
      console.log('DB check response status:', response.status);
      
      const data = await response.json();
      console.log('DB check data:', data);
      setDbStatus(data);
    } catch (err) {
      console.error('Error checking database:', err);
      setDbStatus({ status: 'error', error: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsCheckingDb(false);
    }
  };
  
  if (error) {
    return (
      <div className="admin-error">
        <h1>Error Loading Admin Dashboard</h1>
        <p className="error-message">{error}</p>
        <button onClick={fetchUsers} className="retry-button">
          Retry Loading Users
        </button>
        <style jsx>{`
          .admin-error {
            padding: 2rem;
            text-align: center;
          }
          .error-message {
            color: #e53e3e;
            margin: 1rem 0;
          }
          .retry-button {
            background-color: var(--accent);
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }
  
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-description">
          Manage users, content, and application settings
        </p>
      </header>
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button 
              className={`admin-nav-button ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content Management
            </button>
            <button 
              className={`admin-nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Application Settings
            </button>
          </nav>
        </div>
        
        <div className="admin-content">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-2">
              <button
                onClick={checkDatabaseConnection}
                disabled={isCheckingDb}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isCheckingDb ? 'Checking DB...' : 'Check Database'}
              </button>
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Users'}
              </button>
            </div>
          </div>
          
          {/* Database status section */}
          {dbStatus && (
            <div className={`mb-6 p-4 rounded border ${dbStatus.status === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <h2 className="font-bold mb-2">Database Diagnostics</h2>
              <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                {JSON.stringify(dbStatus, null, 2)}
              </pre>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="user-management">
              <div className="panel-header">
                <h2>User Management</h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="user-list">
                <div className="user-list-header">
                  <div className="user-header-cell user-avatar">Profile</div>
                  <div className="user-header-cell user-name">Name</div>
                  <div className="user-header-cell user-email">Email</div>
                  <div className="user-header-cell user-role">Role</div>
                  <div className="user-header-cell user-subscription">Subscription</div>
                  <div className="user-header-cell user-credits">AI Credits</div>
                  <div className="user-header-cell user-actions">Actions</div>
                </div>
                
                {isLoading ? (
                  <div className="users-loading">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="no-users-found">
                    <p>No users found matching your search.</p>
                    {users.length === 0 && (
                      <div className="empty-state">
                        <p>There are no users in the database yet.</p>
                        <p>You may need to check your MongoDB connection in the .env file.</p>
                        <button onClick={fetchUsers} className="retry-button">Refresh</button>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user._id} className="user-row">
                      <div className="user-cell user-avatar">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            width={40}
                            height={40}
                            className="user-avatar-img"
                          />
                        ) : (
                          <div className="user-avatar-placeholder">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div className="user-cell user-name">{user.name || 'No name'}</div>
                      <div className="user-cell user-email">{user.email}</div>
                      <div className="user-cell user-role">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value as 'user' | 'premium' | 'admin')}
                          disabled={isUpdating}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="user-cell user-subscription">
                        <select
                          value={user.subscription?.tier || 'free'}
                          onChange={(e) => updateSubscription(user._id, { 
                            tier: e.target.value as 'free' | 'basic' | 'premium' 
                          })}
                          disabled={isUpdating}
                          className="subscription-select"
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                      <div className="user-cell user-credits">
                        <div className="credits-container">
                          <span>{user.subscription?.aiCreditsRemaining === Infinity ? '∞' : user.subscription?.aiCreditsRemaining || 0}</span>
                          <button
                            onClick={() => addCredits(user._id, 5)}
                            disabled={isUpdating}
                            className="add-credits-button"
                            title="Add 5 credits"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                      <div className="user-cell user-actions">
                        <Link href={`/admin/users/${user._id}`} className="view-user-button">
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'content' && (
            <div className="content-management">
              <h2>Content Management</h2>
              <p>Content management features will be added in a future update.</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="app-settings">
              <h2>Application Settings</h2>
              
              <div className="settings-section">
                <h3>Storage Limits</h3>
                <p>The following storage limits are configured for lesson plans:</p>
                
                <div className="settings-table">
                  <div className="settings-row header">
                    <div className="settings-cell">Subscription Tier</div>
                    <div className="settings-cell">Lesson Plan Limit</div>
                    <div className="settings-cell">Notes</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Free</div>
                    <div className="settings-cell">{STORAGE_LIMITS.free}</div>
                    <div className="settings-cell">Basic tier for all users</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Basic</div>
                    <div className="settings-cell">{STORAGE_LIMITS.basic}</div>
                    <div className="settings-cell">Paid tier with moderate usage</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Premium</div>
                    <div className="settings-cell">{STORAGE_LIMITS.premium}</div>
                    <div className="settings-cell">Premium tier for power users</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Admin</div>
                    <div className="settings-cell">Unlimited</div>
                    <div className="settings-cell">Administrators have no storage limits</div>
                  </div>
                </div>
                
                <p className="settings-note">
                  <strong>Note:</strong> To change these limits, you'll need to update the constants in the codebase:
                  <ul>
                    <li>src/app/api/lesson-plans/save/route.ts</li>
                    <li>src/app/api/lesson-plans/storage-usage/route.ts</li>
                    <li>src/app/admin/dashboard/page.tsx</li>
                  </ul>
                </p>
              </div>
              
              <div className="settings-section">
                <h3>Feature Availability</h3>
                <p>The following features are available to users based on their subscription tier:</p>
                
                <div className="settings-table">
                  <div className="settings-row header">
                    <div className="settings-cell">Feature</div>
                    <div className="settings-cell">Free</div>
                    <div className="settings-cell">Basic</div>
                    <div className="settings-cell">Premium</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Save Lesson Plans</div>
                    <div className="settings-cell">✓ (Limited to {STORAGE_LIMITS.free})</div>
                    <div className="settings-cell">✓ (Limited to {STORAGE_LIMITS.basic})</div>
                    <div className="settings-cell">✓ (Limited to {STORAGE_LIMITS.premium})</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">AI Generation</div>
                    <div className="settings-cell">✓ (5 credits)</div>
                    <div className="settings-cell">✓ (50 credits)</div>
                    <div className="settings-cell">✓ (Unlimited)</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Advanced Customization</div>
                    <div className="settings-cell">✗</div>
                    <div className="settings-cell">✓</div>
                    <div className="settings-cell">✓</div>
                  </div>
                  <div className="settings-row">
                    <div className="settings-cell">Export Formats</div>
                    <div className="settings-cell">PDF only</div>
                    <div className="settings-cell">PDF, Word</div>
                    <div className="settings-cell">All formats</div>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>MongoDB Connection</h3>
                <div className="debug-actions">
                  <button 
                    onClick={checkMongoConnection}
                    className="debug-button"
                  >
                    Check MongoDB Connection
                  </button>
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="debug-toggle"
                  >
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                  </button>
                </div>
                
                {showDebug && (
                  <div className="debug-panel">
                    <h4>Debug Information</h4>
                    <div className="debug-info">
                      <div className="debug-item">
                        <span className="debug-label">MongoDB Status:</span>
                        <span className={`debug-value status-${debugInfo.mongoStatus}`}>
                          {debugInfo.mongoStatus === 'connected' ? 'Connected ✓' : 
                           debugInfo.mongoStatus === 'error' ? 'Error ✗' : 'Unknown ?'}
                        </span>
                      </div>
                      
                      {debugInfo.mongoError && (
                        <div className="debug-item">
                          <span className="debug-label">Error:</span>
                          <span className="debug-value error">{debugInfo.mongoError}</span>
                        </div>
                      )}
                      
                      <div className="debug-item">
                        <span className="debug-label">Vercel Environment:</span>
                        <span className="debug-value">{debugInfo.vercelEnv || 'Not running in Vercel'}</span>
                      </div>
                      
                      <div className="debug-item">
                        <span className="debug-label">Node Environment:</span>
                        <span className="debug-value">{debugInfo.nodeEnv || 'Unknown'}</span>
                      </div>
                      
                      <div className="debug-item">
                        <span className="debug-label">Session Status:</span>
                        <span className="debug-value">{status}</span>
                      </div>
                      
                      <div className="debug-item">
                        <span className="debug-label">User Role:</span>
                        <span className="debug-value">{session?.user?.role || 'None'}</span>
                      </div>
                      
                      <div className="debug-item">
                        <span className="debug-label">Users Count:</span>
                        <span className="debug-value">{users.length}</span>
                      </div>
                      
                      <h4>API Call History</h4>
                      {debugInfo.apiResponses.length > 0 ? (
                        <div className="api-calls">
                          {debugInfo.apiResponses.map((call, index) => (
                            <div key={index} className="api-call">
                              <div className="api-call-header">
                                <div className="api-endpoint">{call.endpoint}</div>
                                <div className={`api-status status-${call.status < 400 ? 'success' : 'error'}`}>
                                  {call.status}
                                </div>
                                <div className="api-timestamp">{new Date(call.timestamp).toLocaleTimeString()}</div>
                              </div>
                              <pre className="api-data">{JSON.stringify(call.data, null, 2)}</pre>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No API calls recorded yet.</p>
                      )}
                      
                      <div className="debug-actions">
                        <button 
                          onClick={fetchUsers} 
                          className="debug-button"
                        >
                          Retry Fetch Users
                        </button>
                        <button 
                          onClick={() => {
                            setDebugInfo({
                              mongoStatus: 'unknown',
                              mongoError: null,
                              apiResponses: [],
                              vercelEnv: null,
                              nodeEnv: null
                            });
                          }} 
                          className="debug-button clear"
                        >
                          Clear Debug Info
                        </button>
                      </div>
                    </div>
                    
                    <div className="admin-setup-info">
                      <h4>Admin Setup</h4>
                      <p>If you're experiencing issues with the admin dashboard, try the following:</p>
                      <ol>
                        <li>Visit <Link href="/force-admin" className="setup-link">/force-admin</Link> to verify and fix admin access</li>
                        <li>Ensure your MongoDB connection string is correctly set up in your environment variables</li>
                        <li>Check that the <code>ADMIN_EMAILS</code> environment variable includes your email</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 112, 243, 0.2);
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .admin-container {
          display: flex;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 2rem;
        }
        
        .admin-sidebar {
          width: 200px;
          flex-shrink: 0;
        }
        
        .admin-content {
          flex: 1;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .admin-nav-button {
          padding: 0.75rem 1rem;
          text-align: left;
          background: none;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .admin-nav-button:hover {
          background-color: #f3f4f6;
          color: #111827;
        }
        
        .admin-nav-button.active {
          background-color: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .panel-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        
        .search-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          width: 240px;
          font-size: 0.875rem;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        .user-list {
          width: 100%;
        }
        
        .user-list-header {
          display: flex;
          padding: 0.75rem 1.5rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .user-row {
          display: flex;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }
        
        .user-row:hover {
          background-color: #f9fafb;
        }
        
        .user-header-cell,
        .user-cell {
          padding: 0.5rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .user-avatar {
          width: 50px;
          flex-shrink: 0;
        }
        
        .user-name {
          flex: 1;
          min-width: 120px;
        }
        
        .user-email {
          flex: 1.5;
          min-width: 180px;
        }
        
        .user-role {
          width: 100px;
          flex-shrink: 0;
        }
        
        .user-subscription {
          width: 110px;
          flex-shrink: 0;
        }
        
        .user-credits {
          width: 100px;
          flex-shrink: 0;
        }
        
        .user-actions {
          width: 80px;
          flex-shrink: 0;
        }
        
        .user-avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
        }
        
        .role-select,
        .subscription-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;
          background-color: white;
          max-width: 100%;
        }
        
        .credits-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .add-credits-button {
          padding: 0.25rem 0.5rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-credits-button:hover {
          background-color: #059669;
        }
        
        .add-credits-button:disabled {
          background-color: #d1fae5;
          cursor: not-allowed;
        }
        
        .view-user-button {
          padding: 0.25rem 0.5rem;
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .view-user-button:hover {
          background-color: #dbeafe;
        }
        
        .no-results {
          padding: 2rem 1.5rem;
          text-align: center;
          color: #6b7280;
        }
        
        .content-management,
        .app-settings {
          padding: 1.5rem;
        }
        
        .settings-section {
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .settings-section h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: #111827;
        }
        
        .settings-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 1rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .settings-row {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .settings-row:last-child {
          border-bottom: none;
        }
        
        .settings-row.header {
          background-color: #f9fafb;
          font-weight: 600;
          color: #4b5563;
        }
        
        .settings-cell {
          padding: 0.75rem 1rem;
          flex: 1;
          border-right: 1px solid #e5e7eb;
        }
        
        .settings-cell:last-child {
          border-right: none;
        }
        
        .settings-note {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid #9ca3af;
        }
        
        .settings-note ul {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
        }
        
        .settings-note li {
          margin-bottom: 0.25rem;
          font-family: monospace;
          font-size: 0.85rem;
        }
        
        .admin-error {
          padding: 2rem;
          text-align: center;
        }
        .error-message {
          color: #e53e3e;
          margin: 1rem 0;
        }
        .retry-button {
          background-color: var(--accent);
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        @media (max-width: 1024px) {
          .admin-container {
            flex-direction: column;
          }
          
          .admin-sidebar {
            width: 100%;
          }
          
          .admin-nav {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .user-list-header,
          .user-row {
            flex-wrap: wrap;
          }
          
          .user-header-cell,
          .user-cell {
            padding: 0.25rem 0;
          }
          
          .user-avatar {
            width: 40px;
          }
          
          .user-name,
          .user-email,
          .user-role,
          .user-subscription,
          .user-credits,
          .user-actions {
            width: auto;
            min-width: 0;
          }
        }
        
        .debug-actions {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        
        .debug-button, .debug-toggle {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .debug-button {
          background-color: #3b82f6;
          color: white;
          border: none;
        }
        
        .debug-button:hover {
          background-color: #2563eb;
        }
        
        .debug-button.clear {
          background-color: #ef4444;
        }
        
        .debug-button.clear:hover {
          background-color: #dc2626;
        }
        
        .debug-toggle {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #4b5563;
        }
        
        .debug-toggle:hover {
          background-color: #e5e7eb;
        }
        
        .debug-panel {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
        
        .debug-panel h4 {
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
        }
        
        .debug-panel h4:first-child {
          margin-top: 0;
        }
        
        .debug-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .debug-item {
          display: flex;
          gap: 0.5rem;
        }
        
        .debug-label {
          font-weight: 500;
          color: #64748b;
          min-width: 150px;
        }
        
        .debug-value {
          font-family: monospace;
        }
        
        .status-connected, .status-success {
          color: #16a34a;
        }
        
        .status-error {
          color: #dc2626;
        }
        
        .status-unknown {
          color: #9ca3af;
        }
        
        .debug-value.error {
          color: #dc2626;
          word-break: break-all;
        }
        
        .api-calls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .api-call {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .api-call-header {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background-color: #f1f5f9;
          font-size: 0.875rem;
        }
        
        .api-endpoint {
          font-weight: 500;
          color: #0f172a;
        }
        
        .api-data {
          padding: 0.75rem;
          margin: 0;
          background-color: #ffffff;
          font-family: monospace;
          font-size: 0.75rem;
          overflow-x: auto;
          white-space: pre-wrap;
        }
        
        .admin-setup-info {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
        }
        
        .admin-setup-info ol {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
        }
        
        .admin-setup-info li {
          margin-bottom: 0.5rem;
        }
        
        .setup-link {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .setup-link:hover {
          color: #1e40af;
        }
      `}</style>
    </>
  );
} 