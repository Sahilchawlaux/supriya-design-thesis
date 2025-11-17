import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#D4AF37' }}>🎨 The Design Thesis</h1>
      <p>Website is loading successfully!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Test Status:</h2>
        <ul>
          <li>✅ React is working</li>
          <li>✅ TypeScript is compiling</li>
          <li>✅ Vite dev server is running</li>
          <li>✅ Basic rendering is functional</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApp;
