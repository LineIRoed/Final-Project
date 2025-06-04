// Import necessary hooks and components
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext/AuthContext'

// Component to protect routes from unauthenticated access
export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext)

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If user is logged in, render the protected content
  return children
}
