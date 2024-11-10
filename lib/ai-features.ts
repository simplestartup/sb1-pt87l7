"use client";

import { Content } from './content-store';

// Types
export interface ContentInsight {
  title: string;
  description: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  confidence: number;
  details?: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  mediaType: 'movie' | 'tv';
  confidence: number;
  reason: string;
  source: 'trending' | 'similar' | 'personalized';
}

// Helper Functions
function calculateGenreDistribution(items: Content[]): Record<string, number> {
  const genreCounts = items.reduce((acc, item) => {
    item.genre.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  return Object.entries(genreCounts).reduce((acc, [genre, count]) => {
    acc[genre] = (count / total) * 100;
    return acc;
  }, {} as Record<string, number>);
}

function calculatePlatformUsage(items: Content[]): Record<string, number> {
  const platformCounts = items.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(platformCounts).reduce((a, b) => a + b, 0);
  return Object.entries(platformCounts).reduce((acc, [platform, count]) => {
    acc[platform] = (count / total) * 100;
    return acc;
  }, {} as Record<string, number>);
}

function calculateWatchingTrends(items: Content[]): {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
} {
  const watchedItems = items.filter(item => item.watched);
  const percentage = (watchedItems.length / items.length) * 100;
  
  // Simple trend calculation based on recent activity
  const recentItems = items.slice(-5);
  const recentWatched = recentItems.filter(item => item.watched).length;
  const recentPercentage = (recentWatched / recentItems.length) * 100;
  
  const trend = recentPercentage > percentage ? 'up' : 
                recentPercentage < percentage ? 'down' : 'stable';
  
  return { trend, percentage };
}

// Main Functions
export function generateContentInsights(items: Content[]): ContentInsight[] {
  if (items.length === 0) return [];

  const genreDistribution = calculateGenreDistribution(items);
  const platformUsage = calculatePlatformUsage(items);
  const watchingTrends = calculateWatchingTrends(items);
  const ratedItems = items.filter(item => item.rating !== null);
  const avgRating = ratedItems.length ? 
    ratedItems.reduce((acc, item) => acc + (item.rating || 0), 0) / ratedItems.length : 0;

  return [
    {
      title: "Watching Progress",
      description: "Your content consumption rate",
      value: watchingTrends.percentage,
      trend: watchingTrends.trend,
      confidence: 90,
      details: [
        `${Math.round(watchingTrends.percentage)}% of content watched`,
        watchingTrends.trend === 'up' ? 'Increasing activity' : 
        watchingTrends.trend === 'down' ? 'Decreasing activity' : 'Stable activity'
      ]
    },
    {
      title: "Genre Preferences",
      description: "Your most watched genres",
      value: Math.max(...Object.values(genreDistribution)),
      confidence: 85,
      details: Object.entries(genreDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre, percentage]) => `${genre}: ${Math.round(percentage)}%`)
    },
    {
      title: "Platform Usage",
      description: "Your streaming service preferences",
      value: Math.max(...Object.values(platformUsage)),
      confidence: 95,
      details: Object.entries(platformUsage)
        .sort(([,a], [,b]) => b - a)
        .map(([platform, percentage]) => `${platform}: ${Math.round(percentage)}%`)
    },
    {
      title: "Rating Analysis",
      description: "Your content rating patterns",
      value: avgRating * 20, // Convert to percentage
      confidence: 80,
      details: [
        `Average rating: ${avgRating.toFixed(1)} / 5`,
        `${ratedItems.length} items rated`,
        `${Math.round((ratedItems.length / items.length) * 100)}% rating completion`
      ]
    }
  ];
}

// TMDB API Integration
const TMDB_API_KEY = 'd485f8d371ee34f0dc66490b1e9418f6';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });
  
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) throw new Error('TMDB API request failed');
  return response.json();
}

export async function getTrendingContent(): Promise<AIRecommendation[]> {
  try {
    const [movies, tvShows] = await Promise.all([
      fetchFromTMDB('/trending/movie/week'),
      fetchFromTMDB('/trending/tv/week')
    ]);

    const recommendations: AIRecommendation[] = [
      ...movies.results.slice(0, 10).map((movie: any) => ({
        id: `tmdb-${movie.id}`,
        title: movie.title,
        overview: movie.overview,
        posterPath: `${TMDB_IMAGE_BASE}${movie.poster_path}`,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        mediaType: 'movie' as const,
        confidence: Math.round(movie.vote_average * 10),
        reason: 'Currently trending worldwide',
        source: 'trending' as const
      })),
      ...tvShows.results.slice(0, 10).map((show: any) => ({
        id: `tmdb-${show.id}`,
        title: show.name,
        overview: show.overview,
        posterPath: `${TMDB_IMAGE_BASE}${show.poster_path}`,
        releaseDate: show.first_air_date,
        voteAverage: show.vote_average,
        mediaType: 'tv' as const,
        confidence: Math.round(show.vote_average * 10),
        reason: 'Currently trending worldwide',
        source: 'trending' as const
      }))
    ].filter(item => item.posterPath.includes('null') === false);

    return recommendations;
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

export async function getPersonalizedRecommendations(userContent: Content[]): Promise<AIRecommendation[]> {
  try {
    // Get user's favorite genres
    const genreDistribution = calculateGenreDistribution(userContent);
    const topGenres = Object.entries(genreDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Get user's highly rated content
    const highlyRated = userContent
      .filter(item => item.rating && item.rating >= 4)
      .slice(0, 3);

    // Fetch recommendations based on user preferences
    const recommendationPromises = [
      // Genre-based recommendations
      ...topGenres.map(genre => 
        Promise.all([
          fetchFromTMDB('/discover/movie', { 
            with_genres: genre.toLowerCase(),
            sort_by: 'popularity.desc'
          }),
          fetchFromTMDB('/discover/tv', { 
            with_genres: genre.toLowerCase(),
            sort_by: 'popularity.desc'
          })
        ])
      ),
      // Similar content based on highly rated items
      ...highlyRated.map(item =>
        fetchFromTMDB(`/${item.type === 'movie' ? 'movie' : 'tv'}/popular`)
      )
    ];

    const results = await Promise.all(recommendationPromises);
    
    const recommendations: AIRecommendation[] = results.flatMap((result, index) => {
      const isGenreBased = index < topGenres.length;
      const genre = isGenreBased ? topGenres[index] : null;
      const [movies, shows] = Array.isArray(result) ? result : [result, null];

      return [
        ...(movies?.results || []).slice(0, 5).map((item: any) => ({
          id: `tmdb-${item.id}`,
          title: item.title || item.name,
          overview: item.overview,
          posterPath: `${TMDB_IMAGE_BASE}${item.poster_path}`,
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: item.vote_average,
          mediaType: 'movie' as const,
          confidence: Math.round((item.vote_average / 10) * 100),
          reason: genre 
            ? `Based on your interest in ${genre}`
            : 'Matches your viewing preferences',
          source: 'personalized' as const
        })),
        ...(shows?.results || []).slice(0, 5).map((item: any) => ({
          id: `tmdb-${item.id}`,
          title: item.name,
          overview: item.overview,
          posterPath: `${TMDB_IMAGE_BASE}${item.poster_path}`,
          releaseDate: item.first_air_date,
          voteAverage: item.vote_average,
          mediaType: 'tv' as const,
          confidence: Math.round((item.vote_average / 10) * 100),
          reason: genre 
            ? `Based on your interest in ${genre}`
            : 'Matches your viewing preferences',
          source: 'personalized' as const
        }))
      ];
    }).filter(item => 
      item.posterPath.includes('null') === false &&
      item.title &&
      item.releaseDate
    );

    // Remove duplicates and sort by confidence
    return recommendations
      .filter((rec, index, self) => 
        index === self.findIndex(r => r.id === rec.id)
      )
      .sort((a, b) => b.confidence - a.confidence);

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}