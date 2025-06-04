// Fetching movies from API
const API_KEY = '4e461f739d78e77d2d7f16407e3db2c7'
const BASE_URL = 'https://api.themoviedb.org/3'

// Fetches a list of popular movies from TMDB.
// Returns an array of movie objects.
export const fetchPopularMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
  const data = await res.json()
  return data.results
}

//  Fetches movies filtered by a specific genre ID from TMDB.
export const fetchMoviesByGenre = async (genreId) => {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`
  )
  const data = await res.json()
  return data.results
}

// Fetches all available movie genres from TMDB.
// Returns an array of genre objects (id and name).
export const fetchGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
  const data = await res.json()
  return data.genres
}
