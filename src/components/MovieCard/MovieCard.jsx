import styles from './MovieCard.module.css'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.card}>
        <img src={movie.poster} alt={movie.title} />
        <h3>{movie.title}</h3>
  </Link>
  )
}
