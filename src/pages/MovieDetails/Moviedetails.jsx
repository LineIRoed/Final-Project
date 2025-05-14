import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './MovieDetails.module.css'

const API_KEY = '4e461f739d78e77d2d7f16407e3db2c7'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
      )
      const data = await res.json()
      setMovie(data)
    }

    fetchMovie()
  }, [id])

  if (!movie) return <p>Loading...</p>

  return (
    <div className={styles.container}>
      <img
        className={styles.poster}
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className={styles.info}>
        <h1>{movie.title}</h1>
        <p><strong>Overview:</strong> {movie.overview}</p>
        <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ {movie.vote_average}/10</p>
      </div>
    </div>
  )
}
