// TMDB API Integration
const TMDB_API_KEY = 'd485f8d371ee34f0dc66490b1e9418f6';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface TMDBResponse {
  results: any[];
}

export type MediaType = 'movie' | 'tv' | 'documentary';

export async function getTrending(type: MediaType = 'movie', page: number = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    return data.results
      .filter((item: any) => item.poster_path)
      .map((item: any) => ({
        id: `tmdb-${item.id}`,
        title: item.title || item.name,
        type: type,
        platform: 'netflix', // Default platform, can be customized
        genre: ['Drama'], // Default genre, can be enhanced with TMDB genres
        releaseDate: item.release_date || item.first_air_date || new Date().toISOString(),
        image: `${TMDB_IMAGE_BASE}${item.poster_path}`,
        overview: item.overview,
        tmdbRating: item.vote_average
      }));
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

export async function searchContent(query: string, type: MediaType) {
  try {
    // For documentaries, search in both movies and TV shows with documentary genre
    if (type === 'documentary') {
      const [movies, tvShows] = await Promise.all([
        fetch(
          `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&with_genres=99`
        ),
        fetch(
          `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&with_genres=99`
        )
      ]);

      const [movieData, tvData] = await Promise.all([
        movies.json(),
        tvShows.json()
      ]);

      const results = [...movieData.results, ...tvData.results];
      return results
        .filter(item => item.poster_path)
        .map(item => ({
          id: `tmdb-${item.id}`,
          title: item.title || item.name,
          type: 'documentary',
          genre: ['Documentary'],
          releaseDate: item.release_date || item.first_air_date || new Date().toISOString(),
          image: `${TMDB_IMAGE_BASE}${item.poster_path}`,
          overview: item.overview,
          tmdbRating: item.vote_average
        }));
    }

    // Regular movie or TV show search
    const searchType = type === 'movie' ? 'movie' : 'tv';
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBResponse = await response.json();

    return data.results
      .filter(item => item.poster_path)
      .map(item => ({
        id: `tmdb-${item.id}`,
        title: item.title || item.name,
        type: searchType === 'movie' ? 'movie' : 'tv',
        genre: ['Drama'], // This should be enhanced with actual genres from TMDB
        releaseDate: item.release_date || item.first_air_date || new Date().toISOString(),
        image: `${TMDB_IMAGE_BASE}${item.poster_path}`,
        overview: item.overview,
        tmdbRating: item.vote_average
      }));
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}