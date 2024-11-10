import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateShareUrl(playlistId: string): string {
  // In a real app, this would generate a proper sharing URL with your domain
  // For demo purposes, we'll create a local URL
  return `/playlists/${playlistId}/share/${uuidv4()}`;
}