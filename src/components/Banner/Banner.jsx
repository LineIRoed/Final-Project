// Import necessary React hooks and CSS module styles
import { useEffect, useState, useContext } from 'react'
import styles from './Banner.module.css'

// Banner component accepts a list of movies as a prop
export default function Banner({ movies }) {
  
  const [index, setIndex] = useState(0)

  // If movies aren't loaded yet, show a loading message
  if (!movies || movies.length === 0) {
    return <div>Loading...</div>
  }

  // Automatically change the movie every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length)
    }, 3000)

    // Cleanup the interval when the component unmounts or movies change
    return () => clearInterval(interval)
  }, [movies.length])

  // Render the current movie's poster and title
  return (
    <div className={styles.banner}>
      <img src={movies[index].poster} alt={movies[index].title} />
      <div className={styles.titleOverlay}>
        <h1>{movies[index].title}</h1>
      </div>
    </div>
  )
}
