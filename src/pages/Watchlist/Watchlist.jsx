import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../../Services/watchlistService.js'
import styles from './Watchlist.module.css'
import Button from '../../components/Buttons/Buttons.jsx'
import { Link } from 'react-router-dom'

export default function Watchlist() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    if (!user) {
      setMovies([])
      setLoading(false)
      return
    }
    const fetchWatchlist = async () => {
      setLoading(true)
      const data = await getWatchlist(user.uid)
      setMovies(data)
      setLoading(false)
    }
    fetchWatchlist()
  }, [user])

  const handleToggle = async (movie) => {
    setUpdatingId(movie.id)
    try {
      const exists = movies.find(m => m.id === movie.id)
      if (exists) {
        await removeFromWatchlist(user.uid, movie.id)
        setMovies(movies.filter(m => m.id !== movie.id))
      } else {
        await addToWatchlist(user.uid, movie)
        setMovies([...movies, movie])
      }
    } catch (error) {
      console.error('Error updating watchlist:', error)
      alert('Failed to update watchlist.')
    }
    setUpdatingId(null)
  }

  if (!user) return <p>Please log in to see your watchlist.</p>
  if (loading) return <p>Loading your watchlist...</p>

  return (
    <div className={styles.watchlistContainer}>
      <h2>Your Watchlist</h2>

      {movies.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Your watchlist is empty</h3>
          <p className={styles.subtitle}>Add movies to your watchlist and they'll appear here.</p>
          <Button onClick={() => navigate('/')} className={styles.exploreBtn}>
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className={styles.watchlistGrid}>
          {movies.map((movie) => (
            <div className={styles.watchlistCard}>
              <Link to={`/movie/${movie.id}`} key={movie.id} className={styles.linkCard}>
                <div className={styles.linkCardContainer}>
                  <img src={movie.poster} alt={movie.title} className={styles.movieImg} />
                  <h3>{movie.title}</h3>
                </div>
              </Link>
              <Button
                disabled={updatingId === movie.id}
                className={styles.watchlistBtn}
                onClick={() => handleToggle(movie)}
                >
                {updatingId === movie.id ? '...' : '❤️'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
