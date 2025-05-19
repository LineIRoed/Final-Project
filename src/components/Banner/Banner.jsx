import { useEffect, useState, useContext } from 'react'
import styles from './Banner.module.css'
export default function Banner({ movies }) {
  
  const [index, setIndex] = useState(0)

  if (!movies || movies.length === 0) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [movies.length])

  return (
    <div className={styles.banner}>
      <img src={movies[index].poster} alt={movies[index].title} />
      <div className={styles.titleOverlay}>
        <h1>{movies[index].title}</h1>
      </div>
    </div>
  )
}
