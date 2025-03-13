'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Processing...');

    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secretKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user role');
      }

      setStatus('success');
      setMessage(data.message || 'User role updated successfully');
      
      // Automatically redirect to admin dashboard after success
      setTimeout(() => {
        router.push('/admin');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h1>Setup Admin User</h1>
        <p>Use this page to grant admin privileges to your account</p>
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
            disabled={status === 'loading'}
            className={`submit-button ${status === 'loading' ? 'loading' : ''}`}
          >
            {status === 'loading' ? 'Processing...' : 'Make Admin'}
          </button>
        </form>
        
        {status !== 'idle' && (
          <div className={`status-message ${status}`}>
            {message}
            {status === 'success' && (
              <p>Redirecting to admin dashboard in 3 seconds...</p>
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
        
        .submit-button {
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
        }
        
        .submit-button:hover {
          background-color: #3182ce;
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