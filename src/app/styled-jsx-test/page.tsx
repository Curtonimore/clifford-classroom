'use client';

import React from 'react';

export default function StyledJsxTest() {
  return (
    <div className="container">
      <h1>Styled JSX Test Page</h1>
      <p>This page tests if styled-jsx is working correctly.</p>
      <div className="box">
        This box should have a red background if styled-jsx is working.
      </div>
      
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        h1 {
          color: #0070f3;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 10px;
        }
        
        .box {
          background-color: #ff0000;
          color: white;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
} 