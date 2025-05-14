import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx"
import styles from './Navbar.module.css'

export default function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.left}>
                <Link to="/" className={styles.logo}>Flixio</Link>
                <div className={styles.links}>
                    <Link to="/" className={styles.link}>Home</Link> 
                    <Link to="/watchlist" className={styles.link}>Watchlist</Link> 
                    <Link to="/profile" className={styles.link}>Profile</Link> 
                </div>
            </div>

            <div className={styles.right}>
                <input 
                    type="text"
                    placeholder="Search for Movie name..." 
                    className={styles.search}
                />
                {user ? (
                    <button onClick={handleLogout} className={styles.button}>Sign Out</button>
                ) : (
                    <Link to="/login" className={styles.button}>Sign In</Link> 
                )}
            </div>
        </nav>
    )
}