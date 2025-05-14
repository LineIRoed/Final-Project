import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './MovieDetails.module.css'
import Button from '../../components/Buttons/Buttons'
import { db } from '../../firebaseConfig'; // Import the Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

const API_KEY = '4e461f739d78e77d2d7f16407e3db2c7'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [trailer, setTrailer] = useState(null)

  const handleAddToWatchlist = async () => {
    if (!movie) return; // Ensure movie data is loaded

    const movieData = {
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }
    
    try {
      // Add movie to Firestore (assuming 'watchlist' is your collection)
      await addDoc(collection(db, 'watchlist'), movieData);
      alert('Movie added to your watchlist!');
    } catch (error) {
      console.error('Error adding movie to Firestore: ', error);
      alert('Failed to add movie to watchlist.');
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
      <div className={styles.movieInfo}>
        <h1>{movie.title}</h1>
        <p><strong>Overview:</strong> {movie.overview}</p>
        <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ {movie.vote_average}/10</p>
      </div>

      {trailer && (
        <div className={styles.trailerContainer}>
          <h2>Watch the Trailer</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className={styles.addBtnContainer}>
        <Button className={styles.addButton} onClick={handleAddToWatchlist}>
          Add to Watchlist
        </Button>
      </div>

      <div className={styles.backBtnContainer}>
        <Button className={styles.backButton} onClick={handleBack}>← Back</Button>
      </div>
    </div>
  )
}
