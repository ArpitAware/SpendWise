import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply dark class immediately to prevent flash
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'dark' || (!saved && prefersDark) || saved === 'system' && prefersDark) {
  document.documentElement.classList.add('dark');
  document.body.style.background = '#030712';
} else {
  document.body.style.background = '#f9fafb';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
