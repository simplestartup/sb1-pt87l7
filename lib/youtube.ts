"use client";

const YOUTUBE_API_KEY = 'AIzaSyApsi5uH5k37ltHpkUCM8Bagsidl8VyQyU';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchResult {
  id: string;
  title: string;
  type: string;
  platform: string;
  genre: string[];
  releaseDate: string;
  image: string;
  host: string;
  duration?: string;
  youtubeId: string;
  overview: string;
}

async function fetchYouTubeData(url: string) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('YouTube API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`YouTube API error: ${response.status} - ${errorData?.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    throw error;
  }
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  if (!query.trim()) {
    throw new Error('Search query is required');
  }

  try {
    // Search for videos
    const searchUrl = new URL(`${YOUTUBE_API_URL}/search`);
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('maxResults', '10');
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('key', YOUTUBE_API_KEY);

    const searchData = await fetchYouTubeData(searchUrl.toString());

    if (!searchData.items?.length) {
      console.log('No YouTube results found');
      return [];
    }

    // Get video details (duration)
    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    const detailsUrl = new URL(`${YOUTUBE_API_URL}/videos`);
    detailsUrl.searchParams.append('part', 'contentDetails,statistics');
    detailsUrl.searchParams.append('id', videoIds.join(','));
    detailsUrl.searchParams.append('key', YOUTUBE_API_KEY);

    const detailsData = await fetchYouTubeData(detailsUrl.toString());

    // Create duration map
    const durationMap = new Map(
      detailsData.items?.map((item: any) => [
        item.id,
        formatDuration(item.contentDetails.duration)
      ]) || []
    );

    // Map results to our format
    const results = searchData.items.map((item: any): YouTubeSearchResult => ({
      id: `youtube-${item.id.videoId}`,
      title: item.snippet.title,
      type: 'podcast',
      platform: 'youtube',
      genre: ['Education'],
      releaseDate: item.snippet.publishedAt,
      image: getBestThumbnail(item.snippet.thumbnails),
      host: item.snippet.channelTitle,
      overview: item.snippet.description,
      youtubeId: item.id.videoId,
      duration: durationMap.get(item.id.videoId)
    }));

    console.log(`Found ${results.length} YouTube results`);
    return results;

  } catch (error) {
    console.error('YouTube search error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to search YouTube content');
  }
}

function getBestThumbnail(thumbnails: any): string {
  // Try to get the highest quality thumbnail available
  const qualities = ['maxres', 'high', 'medium', 'default'];
  for (const quality of qualities) {
    if (thumbnails[quality]?.url) {
      return thumbnails[quality].url;
    }
  }
  return thumbnails.default?.url || '';
}

function formatDuration(duration: string): string {
  if (!duration) return '';

  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';

    const [, hours, minutes, seconds] = match;
    const parts = [];

    if (hours) {
      parts.push(hours);
    }

    parts.push(minutes ? padZero(minutes) : '00');
    parts.push(seconds ? padZero(seconds) : '00');

    return parts.join(':');
  } catch (error) {
    console.error('Error formatting duration:', error);
    return '';
  }
}

function padZero(num: string): string {
  return num.padStart(2, '0');
}