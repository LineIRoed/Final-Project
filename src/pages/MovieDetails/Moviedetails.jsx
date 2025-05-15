import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './MovieDetails.module.css'
import Button from '../../components/Buttons/Buttons'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { db } from '../../firebaseConfig'; // Import the Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods

const API_KEY = '4e461f739d78e77d2d7f16407e3db2c7'

export default function MovieDetails() {
    const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [trailer, setTrailer] = useState(null)

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert('Please log in to add movies to your watchlist.')
      return
    }
  
    const movieData = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }
  
    try {
      const docRef = doc(db, 'users', user.uid, 'watchlist', movie.id.toString())
      await setDoc(docRef, movieData)
      alert('Movie added to your watchlist!')
    } catch (error) {
      console.error('Error adding movie to watchlist:', error)
      alert('Failed to add movie to watchlist.')
    }
  }
  

  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1) // Goes back to the previous page
  }

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
      )
      const data = await res.json()
      setMovie(data)

      // Fetch movie trailers
      const trailerRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
      )
      const trailerData = await trailerRes.json()
      setTrailer(trailerData.results.find(video => video.type === 'Trailer')) // Assuming the first trailer is the desired one
    }

    fetchMovie()
  }, [id])

  if (!movie) return <p>Loading...</p>

  return (
    <div className={styles.movieContainer}>
        <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
        />
        <div className={styles.infoContainer}>
            <div className={styles.movieInfo}>
                <h1>{movie.title}</h1>
                <p><strong>Overview:</strong> {movie.overview}</p>
                <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Release Date:</strong> {movie.release_date}</p>
                <p><strong>Rating:</strong> ⭐ {movie.vote_average}/10</p>
            </div>
            <div className={styles.addBtnContainer}>
                <Button className={styles.addBtn} onClick={handleAddToWatchlist}>
                    Add to Watchlist
                </Button>
            </div>
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
        <div className={styles.backBtnContainer}>
            <Button className={styles.backButton} onClick={handleBack}>← Back</Button>
        </div>
    </div>
  )
}
