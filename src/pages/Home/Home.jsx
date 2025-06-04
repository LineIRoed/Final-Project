// Import React hooks, components, styles, services, and context
import { useEffect, useState, useContext } from 'react'
import Banner from '../../components/Banner/Banner'
import MovieCard from '../../components/MovieCard/MovieCard'
import styles from './Home.module.css'
import { fetchPopularMovies, fetchMoviesByGenre, fetchGenres } from '../../Services/tmbd'
import Button from '../../components/Buttons/Buttons'
import { SearchContext } from '../../components/SearchContext/SearchContext'

export default function Home() {
  // State for popular movies shown in the banner
  const [popular, setPopular] = useState([])
  // State for movies currently displayed
  const [movies, setMovies] = useState([])
  // State for genres fetched from the API
  const [genres, setGenres] = useState([])
  // State for the currently selected genre
  const [selectedGenre, setSelectedGenre] = useState('All')

  // Get current search query from SearchContext
  const { searchQuery } = useContext(SearchContext)

  // Filter movies by search query
  const filtered = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Fetch popular movies and genres on initial load
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [pop, genreList] = await Promise.all([fetchPopularMovies(), fetchGenres()])
        // Set popular movies for the banner
        setPopular(
          pop.slice(0, 5).map((movie) => ({
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w780${movie.backdrop_path || movie.poster_path}`,
          }))
        )
        // Set genres for filter buttons
        setGenres(genreList)
        // Set full movie list (initially showing popular)
        setMovies(pop)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    loadInitial()
  }, [])

  // Handle genre button click: fetch movies by genre or show all
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

  // Show loading state if data isn't ready
  if (!popular.length || !genres.length || !movies.length) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.mainContainer}>
      {/* Banner section with popular movies */}
      <Banner movies={popular} />
      {/* Genre filter buttons */}
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

      {/* Show message if no movies match the search */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No results found</h3>
          <p className={styles.subtitle}>Try searching for another movie title or change the genre.</p>
        </div>
      ) : (
        // Grid of movie cards based on filtered results
        <div className={styles.movieCardGrid}>
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: movie.id,
                title: movie.title,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

