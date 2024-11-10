"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Content {
  id: string;
  title: string;
  type: string;
  platform: string;
  genre: string[];
  releaseDate: string;
  watched: boolean;
  rating: number | null;
  image: string;
  backdrop?: string;
  overview?: string;
  tmdbRating?: number;
  host?: string;
  episodeCount?: number;
  duration?: string;
  youtubeId?: string;
}

export type Playlist = {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  createdAt: string;
  updatedAt: string;
  type: 'regular' | 'smart';
  rules?: SmartPlaylistRule[];
  visibility: 'private' | 'public' | 'shared';
};

export type SmartPlaylistRule = {
  field: string;
  operator: string;
  value: string;
};

interface ContentStore {
  items: Content[];
  playlists: Playlist[];
  addContent: (content: Omit<Content, 'id' | 'watched' | 'rating'>) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  removeContent: (id: string) => void;
  createPlaylist: (name: string, description: string) => string;
  createSmartPlaylist: (name: string, description: string, rules: SmartPlaylistRule[]) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, contentId: string) => void;
  removeFromPlaylist: (playlistId: string, contentId: string) => void;
  getSmartPlaylistContent: (playlist: Playlist) => Content[];
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      items: [],
      playlists: [],
      
      addContent: (content) => {
        set((state) => ({
          items: [...state.items, {
            ...content,
            id: uuidv4(),
            watched: false,
            rating: null
          }]
        }));
      },
      
      updateContent: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },
      
      removeContent: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          playlists: state.playlists.map(playlist => ({
            ...playlist,
            contentIds: playlist.contentIds.filter(contentId => contentId !== id)
          }))
        }));
      },

      createPlaylist: (name, description) => {
        const id = uuidv4();
        set((state) => ({
          playlists: [...state.playlists, {
            id,
            name,
            description,
            contentIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: 'regular',
            visibility: 'private'
          }]
        }));
        return id;
      },

      createSmartPlaylist: (name, description, rules) => {
        set((state) => ({
          playlists: [...state.playlists, {
            id: uuidv4(),
            name,
            description,
            contentIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: 'smart',
            rules,
            visibility: 'private'
          }]
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

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id)
        }));
      },

      addToPlaylist: (playlistId, contentId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId && !playlist.contentIds.includes(contentId)
              ? {
                  ...playlist,
                  contentIds: [...playlist.contentIds, contentId],
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
                  contentIds: playlist.contentIds.filter(id => id !== contentId),
                  updatedAt: new Date().toISOString()
                }
              : playlist
          )
        }));
      },

      getSmartPlaylistContent: (playlist: Playlist) => {
        if (playlist.type !== 'smart' || !playlist.rules) return [];

        const { items } = get();
        return items.filter(item => {
          return playlist.rules?.every(rule => {
            const itemValue = item[rule.field as keyof Content];
            switch (rule.operator) {
              case 'equals':
                return itemValue === rule.value;
              case 'contains':
                return String(itemValue).toLowerCase().includes(rule.value.toLowerCase());
              case 'greater':
                return Number(itemValue) > Number(rule.value);
              case 'less':
                return Number(itemValue) < Number(rule.value);
              default:
                return false;
            }
          });
        });
      }
    }),
    {
      name: 'content-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            items: persistedState.items || [],
            playlists: persistedState.playlists || [],
          };
        }
        return persistedState;
      },
    }
  )
);