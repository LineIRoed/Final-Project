// Import React hooks, router utilities, contexts, styles, and Button component
import { useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../AuthContext/AuthContext.jsx"
import styles from "./Navbar.module.css"
import Button from "../Buttons/Buttons.jsx"
import { SearchContext } from "../SearchContext/SearchContext.jsx"

export default function Navbar() {
  // Get search state and setter from SearchContext
  const { searchQuery, setSearchQuery } = useContext(SearchContext)
  // Get user info, logout function, and loading state from AuthContext
  const { user, logout, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Show loading message while auth state is loading
  if (loading) return <div>Loading...</div>

  // Handles user logout and redirects to login page
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      alert('Failed to log out. Please try again.')
    }
    
  }

  // Navigate to login page if not already there
  const handleSignInClick = () => {
    if (location.pathname !== "/login") navigate("/login")
  }

  // Navigate to register page if not already there
  const handleRegisterClick = () => {
    if (location.pathname !== "/register") navigate("/register")
  }

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.left}>
        {/* Logo links to home */}
        <Link to="/">
          <img src="/logo_final-project.svg" alt="Flixio logo" className={styles.logo} />
        </Link>
        {/* Search input and button */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for Movie name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.search}
          />
          <Button className={styles.searchBtn}>Search</Button>
        </div>
        {/* Navigation links */}
        <div className={styles.links}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/watchlist" className={styles.link}>
            Watchlist
          </Link>
          <Link to="/profile" className={styles.link}>
            Profile
          </Link>
        </div>
      </div>

      <div className={styles.right}>
        {/* Show user avatar if logged in */}
        {user && user.profileImage && (
          <Link to="/profile">
            <img
              src={user.profileImage}
              alt="Profile Avatar"
              className={styles.avatar}
            />
          </Link>
        )}
        {/* Show Sign Out button if logged in */}
        {user ? (
          <Button onClick={handleLogout} className={styles.signInOut}>
            Sign Out
          </Button>
        ) : location.pathname === "/register" ? (
          // Show Sign In button if on register page
          <Button onClick={handleSignInClick} className={styles.signInOut}>
            Sign In
          </Button>
        ) : (
          // Otherwise show Register button
          <Button onClick={handleRegisterClick} className={styles.signInOut}>
            Register
          </Button>
        )}
      </div>
    </nav>
  )
}
