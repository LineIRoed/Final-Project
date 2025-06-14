// Imports
import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './MovieDetails.module.css'
import Button from '../../components/Buttons/Buttons'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { db } from '../../firebaseConfig'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

// TMDB API key
const API_KEY = '4e461f739d78e77d2d7f16407e3db2c7'

export default function MovieDetails() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  // State variables
  const [movie, setMovie] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  // Fetch movie details and trailer on mount
  useEffect(() => {
    const fetchMovie = async () => {
      // Get main movie details
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
      )
      const data = await res.json()
      setMovie(data)

      // Get videos (trailers, teasers, etc.)
      const trailerRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
      )
      // Find first trailer
      const trailerData = await trailerRes.json()
      setTrailer(trailerData.results.find(video => video.type === 'Trailer'))
    }

    fetchMovie()
  }, [id])

  // Check if movie is in user's watchlist when user or movie changes
  useEffect(() => {
    if (!user || !movie) {
      setIsInWatchlist(false)
      return
    }
    const checkWatchlist = async () => {
      const docRef = doc(db, 'users', user.uid, 'watchlist', movie.id.toString())
      const docSnap = await getDoc(docRef)
      setIsInWatchlist(docSnap.exists())
    }
    checkWatchlist()
  }, [user, movie])

  // Add/remove movie from watchlist
  const toggleWatchlist = async () => {
    if (!user) {
      alert('Please log in to manage your watchlist.')
      return
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'watchlist', movie.id.toString())
      if (isInWatchlist) {
        await deleteDoc(docRef)
        setIsInWatchlist(false)
      } else {
        const movieData = {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }
        await setDoc(docRef, movieData)
        setIsInWatchlist(true)
      }
    } catch (error) {
      console.error('Error updating watchlist:', error)
      alert('Failed to update watchlist.')
    }
  }

  // Go back to the previous page
  const handleBack = () => {
    navigate(-1)
  }

  // Show loading state while movie data is being fetched
  if (!movie) return <p>Loading...</p>

  return (
    <div className={styles.movieContainer}>
      {/* Movie Poster */}
      <img
        className={styles.poster}
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      {/* Movie Info and Actions */}
      <div className={styles.infoContainer}>
        <div className={styles.movieInfo}>
          <h1>{movie.title}</h1>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average}/10</p>
        </div>
        {/* Watchlist Button */}
        <div className={styles.addBtnContainer}>
          <Button
            className={styles.addBtn}
            onClick={toggleWatchlist}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isInWatchlist ? <FaHeart color="red" /> : <FaRegHeart />}
            {' '}
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
        </div>
        {/* Trailer Embed */}
        {trailer && (
          <div className={styles.trailerContainer}>
            <h2 className={styles.trailerHeading}>Watch the Trailer</h2>
            <iframe
              className={styles.movieTrailer}
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
      {/* Back Button */}
      <div className={styles.backBtnContainer}>
        <Button className={styles.backButton} onClick={handleBack}>← Back</Button>
      </div>
    </div>
  )
}
