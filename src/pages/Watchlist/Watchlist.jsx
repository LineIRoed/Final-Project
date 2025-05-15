import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../../Services/watchlistService.js'
import styles from './Watchlist.module.css'

export default function Watchlist() {
  const { user } = useContext(AuthContext)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null) // For disabling buttons while updating

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

  if (!user) return <p>Please log in to see your watchlist.</p>
  if (loading) return <p>Loading your watchlist...</p>
  if (movies.length === 0) return <p>Your watchlist is empty.</p>

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

  return (
    <div className={styles.container}>
      <h2>Your Watchlist</h2>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.card}>
            <img src={movie.poster} alt={movie.title} className={styles.poster} />
            <h3>{movie.title}</h3>
            <button
              disabled={updatingId === movie.id}
              className={styles.watchlistBtn}
              onClick={() => handleToggle(movie)}
              aria-label={movies.find(m => m.id === movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {movies.find(m => m.id === movie.id) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
