'use client';

import { useEffect, useState } from 'react';

export default function ViewportDebug() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsVisible(isDev);
    
    if (!isDev) return;
    
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Update on resize
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Don't render anything in production or initial SSR
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '5px',
        left: '5px',
        fontSize: '10px',
        color: '#999',
        background: 'rgba(255,255,255,0.7)',
        padding: '2px 5px',
        zIndex: 9999,
      }}
    >
      viewport: {dimensions.width}x{dimensions.height}
    </div>
  );
} 