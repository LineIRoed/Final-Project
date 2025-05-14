import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './components/AuthContext/AuthContext'
import './index.css'
import { SearchProvider } from './components/SearchContext/SearchContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SearchProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SearchProvider>
  </React.StrictMode>
)
