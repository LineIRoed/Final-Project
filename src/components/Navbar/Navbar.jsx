import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx"
import styles from './Navbar.module.css'
import Button from "../Buttons/Buttons.jsx"

export default function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
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
                        className={styles.search}
                    />
                    <Button className={styles.searchBtn}>Search</Button>
                </div>
                <div className={styles.links}>
                    <Link to="/" className={styles.link}>Home</Link> 
                    <Link to="/watchlist" className={styles.link}>Watchlist</Link> 
                    <Link to="/profile" className={styles.link}>Profile</Link> 
                </div>
            </div>

            <div className={styles.right}>
                {user ? (
                    <button onClick={handleLogout} className={styles.signInOut}>Sign Out</button>
                ) : (
                    <Link to="/login" className={styles.signInOut}>Sign In</Link> 
                )}
            </div>
        </nav>
    )
}