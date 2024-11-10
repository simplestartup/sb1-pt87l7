import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface PlaylistItem {
  id: string;
  contentId: string;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  items: PlaylistItem[];
  createdAt: string;
  updatedAt: string;
  collaborators: string[];
  isPublic: boolean;
}

interface PlaylistStore {
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => void;
  addToPlaylist: (playlistId: string, contentId: string) => void;
  removeFromPlaylist: (playlistId: string, contentId: string) => void;
  deletePlaylist: (id: string) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  getPlaylistInsights: (playlistId: string) => {
    totalItems: number;
    averageRating: number;
    genreDistribution: Record<string, number>;
    platformDistribution: Record<string, number>;
    watchedPercentage: number;
    typeDistribution: Record<string, number>;
  };
}

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],

      createPlaylist: (name, description) => {
        set((state) => ({
          playlists: [...state.playlists, {
            id: uuidv4(),
            name,
            description,
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            collaborators: [],
            isPublic: false
          }]
        }));
      },

      addToPlaylist: (playlistId, contentId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  items: [...playlist.items, {
                    id: uuidv4(),
                    contentId,
                    addedAt: new Date().toISOString()
                  }],
                  updatedAt: new Date().toISOString()
                }
              : playlist
          )
        }));
      },

      removeFromPlaylist: (playlistId, contentId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  items: playlist.items.filter((item) => item.contentId !== contentId),
                  updatedAt: new Date().toISOString()
                }
              : playlist
          )
        }));
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id)
        }));
      },

      updatePlaylist: (id, updates) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id
              ? { ...playlist, ...updates, updatedAt: new Date().toISOString() }
              : playlist
          )
        }));
      },

      getPlaylistInsights: (playlistId) => {
        const { playlists } = get();
        const playlist = playlists.find((p) => p.id === playlistId);
        
        if (!playlist || playlist.items.length === 0) {
          return {
            totalItems: 0,
            averageRating: 0,
            genreDistribution: {},
            platformDistribution: {},
            watchedPercentage: 0,
            typeDistribution: {}
          };
        }

        // Calculate insights here based on playlist items and content store
        // This is a placeholder that should be implemented with actual content data
        return {
          totalItems: playlist.items.length,
          averageRating: 0,
          genreDistribution: {},
          platformDistribution: {},
          watchedPercentage: 0,
          typeDistribution: {}
        };
      }
    }),
    {
      name: 'playlist-store'
    }
  )
);