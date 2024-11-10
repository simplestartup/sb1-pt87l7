"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/content-store";
import { format } from "date-fns";
import PlaylistContentGrid from "@/components/playlists/playlist-content-grid";

export default function SharedPlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const { playlists, items } = useContentStore();
  
  const playlist = playlists.find(p => p.id === params.id && p.visibility !== 'private');
  
  if (!playlist) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Playlist not found or is private</h1>
        <Button onClick={() => router.push("/playlists")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Playlists
        </Button>
      </div>
    );
  }

  const playlistContent = items.filter(item => playlist.contentIds.includes(item.id));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/playlists")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{playlist.name}</h1>
        <p className="text-muted-foreground">{playlist.description}</p>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          <span>{playlistContent.length} items</span>
          <span>•</span>
          <span>Last updated {format(new Date(playlist.updatedAt), "MMM d, yyyy")}</span>
        </div>
      </div>

      <PlaylistContentGrid playlist={playlist} />
    </div>
  );
}