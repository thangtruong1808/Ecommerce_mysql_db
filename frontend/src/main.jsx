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
import axios from 'axios'

// Get the base URL from environment variables.
let apiBaseUrl = import.meta.env.VITE_API_URL || ""

// If the base URL ends with '/api' or '/api/', remove it to prevent duplication
// since API calls in the code already include '/api'.
if (apiBaseUrl.endsWith('/api')) {
  apiBaseUrl = apiBaseUrl.slice(0, -4)
} else if (apiBaseUrl.endsWith('/api/')) {
  apiBaseUrl = apiBaseUrl.slice(0, -5)
}

// Set the base URL for all Axios requests.
axios.defaults.baseURL = apiBaseUrl
// Ensure cookies are sent with every request.
axios.defaults.withCredentials = true

// Initialize React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Error boundary wrapper */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
