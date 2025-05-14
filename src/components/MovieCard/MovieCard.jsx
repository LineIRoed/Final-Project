import styles from './MovieCard.module.css'

export default function MovieCard({ movie }) {
  return (
    <div className={styles.card}>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
    </div>
  )
}
