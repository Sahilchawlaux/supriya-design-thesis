import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import TestApp from './TestApp.tsx'
import './index.css'

// Temporarily use TestApp to check if basic React is working
// createRoot(document.getElementById("root")!).render(<TestApp />);

// Use the main App
createRoot(document.getElementById("root")!).render(<App />);
