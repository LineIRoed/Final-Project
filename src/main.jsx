// Imports
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Context providers for authentication and search state
import { AuthProvider } from './components/AuthContext/AuthContext'
import { SearchProvider } from './components/SearchContext/SearchContext'

// Global CSS styles
import './index.css'

// Create the root of the React app and render it
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provide search context to the app */}
    <SearchProvider>
      {/* Provide auth context to the app */}
      <AuthProvider>
        {/* Main application component */}
        <App />
      </AuthProvider>
    </SearchProvider>
  </React.StrictMode>
)
