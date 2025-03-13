'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export default function SetupLocalAdmin() {
  const router = useRouter();
  const { data: session, status: sessionStatus, update } = useSession();
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session, sessionStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setMessage('Processing...');

    // Validate the secret key
    if (secretKey !== 'make-me-admin-now') {
      setFormStatus('error');
      setMessage('Invalid secret key. Please try again.');
      return;
    }

    try {
      // Store admin role in local storage
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('admin_email', email);
      
      // If this is the current user, let's update the session
      if (session?.user?.email === email) {
        // Force a session update to reflect the admin role
        await update({ role: 'admin' });
      }

      setFormStatus('success');
      setMessage(`Admin privileges granted to ${email} in local storage. Please refresh your application.`);
      
      // Give time to read the message before redirecting
      setTimeout(() => {
        router.push('/check-admin');
      }, 3000);
    } catch (error: any) {
      setFormStatus('error');
      setMessage(error.message || 'An error occurred while updating role');
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h1>Local Admin Setup</h1>
        <p>This is a local development workaround for MongoDB connection issues</p>
        <p>The default secret key is: <code>make-me-admin-now</code></p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your account email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="secretKey">Secret Key</label>
            <input
              type="text"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              placeholder="Enter the secret key"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={formStatus === 'loading'}
            className={`submit-button ${formStatus === 'loading' ? 'loading' : ''}`}
          >
            {formStatus === 'loading' ? 'Processing...' : 'Grant Local Admin Access'}
          </button>

          {formStatus === 'success' && (
            <button
              type="button"
              className="refresh-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          )}
        </form>
        
        {formStatus !== 'idle' && (
          <div className={`status-message ${formStatus}`}>
            {message}
            {formStatus === 'success' && (
              <p>Redirecting to admin status check in 3 seconds...</p>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .admin-setup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f7fafc;
        }
        
        .admin-setup-card {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        p {
          color: #4a5568;
          margin-bottom: 1.5rem;
        }
        
        code {
          background-color: #edf2f7;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }
        
        .submit-button, .refresh-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 0.5rem;
        }
        
        .refresh-button {
          background-color: #48bb78;
          margin-top: 0.5rem;
        }
        
        .submit-button:hover {
          background-color: #3182ce;
        }
        
        .refresh-button:hover {
          background-color: #38a169;
        }
        
        .submit-button.loading {
          background-color: #90cdf4;
          cursor: not-allowed;
        }
        
        .status-message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .status-message.loading {
          background-color: #ebf8ff;
          color: #2b6cb0;
        }
        
        .status-message.success {
          background-color: #f0fff4;
          color: #2f855a;
        }
        
        .status-message.error {
          background-color: #fff5f5;
          color: #c53030;
        }
      `}</style>
    </div>
  );
} 