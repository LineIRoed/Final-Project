// Import styles and Link component for navigation
import styles from './MovieCard.module.css'
import { Link } from 'react-router-dom'

// MovieCard component displays a clickable card for each movie
export default function MovieCard({ movie }) {
  return (
    // Link navigates to movie details page using the movie's ID
    <Link to={`/movie/${movie.id}`} className={styles.card}>
        <img src={movie.poster} alt={movie.title} />
        <h3>{movie.title}</h3>
  </Link>
  )
}
