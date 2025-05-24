import { useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../AuthContext/AuthContext.jsx"
import styles from "./Navbar.module.css"
import Button from "../Buttons/Buttons.jsx"
import { SearchContext } from "../SearchContext/SearchContext.jsx"

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext)
  const { user, logout, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) return <div>Loading...</div>

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleSignInClick = () => {
    if (location.pathname !== "/login") navigate("/login")
  }

  const handleRegisterClick = () => {
    if (location.pathname !== "/register") navigate("/register")
  }

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.left}>
        <Link to="/">
          <img src="/logo_final-project.svg" alt="Flixio logo" className={styles.logo} />
        </Link>
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
        {user && user.profileImage && (
          <Link to="/profile">
            <img
              src={user.profileImage}
              alt="Profile Avatar"
              className={styles.avatar}
            />
          </Link>
        )}
        {user ? (
          <Button onClick={handleLogout} className={styles.signInOut}>
            Sign Out
          </Button>
        ) : location.pathname === "/register" ? (
          <Button onClick={handleSignInClick} className={styles.signInOut}>
            Sign In
          </Button>
        ) : (
          <Button onClick={handleRegisterClick} className={styles.signInOut}>
            Register
          </Button>
        )}
      </div>
    </nav>
  )
}
