// Import React functions for context and state management
import { createContext, useState } from 'react'

// Create a new context for search functionality
export const SearchContext = createContext()

// Provider component to wrap around parts of app that need search state
export function SearchProvider({ children }) {
  // State to store current search query string
  const [searchQuery, setSearchQuery] = useState('')

  return (
    // Provide searchQuery and function to update it to descendants
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  )
}
