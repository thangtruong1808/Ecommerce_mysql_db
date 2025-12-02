/**
 * Application Entry Point
 * Initializes React application
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Initialize React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Error boundary wrapper */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
