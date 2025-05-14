import { useEffect, useState, useContext } from 'react'
import Banner from '../../components/Banner/Banner'
import MovieCard from '../../components/MovieCard/MovieCard'
import styles from './Home.module.css'
import { fetchPopularMovies, fetchMoviesByGenre, fetchGenres } from '../../Services/tmbd'
import Button from '../../components/Buttons/Buttons'
import { SearchContext } from '../../components/SearchContext/SearchContext'

export default function Home() {
  const [popular, setPopular] = useState([])
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('All')

  const { searchQuery } = useContext(SearchContext)

  const filtered = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [pop, genreList] = await Promise.all([fetchPopularMovies(), fetchGenres()])
        setPopular(
          pop.slice(0, 5).map((movie) => ({
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w780${movie.backdrop_path || movie.poster_path}`,
          }))
        )
        setGenres(genreList)
        setMovies(pop)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    loadInitial()
  }, [])

  const handleGenreClick = async (genre) => {
    setSelectedGenre(genre.name)
    if (genre.id === 'all') {
      const pop = await fetchPopularMovies()
      setMovies(pop)
    } else {
      const filtered = await fetchMoviesByGenre(genre.id)
      setMovies(filtered)
    }
  }

  // If data is not yet loaded
  if (!popular.length || !genres.length || !movies.length) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.mainContainer}>
      <Banner movies={popular} />
      <div className={styles.filterBtnContainer}>
        <Button
          className={`${styles.categoryBtn} ${selectedGenre === 'All' ? styles.active : ''}`}
          onClick={() => handleGenreClick({ name: 'All', id: 'all' })}
        >
          All
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre.id}
            className={`${styles.categoryBtn} ${selectedGenre === genre.name ? styles.active : ''}`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      <div className={styles.movieCardGrid}>
        {filtered.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
