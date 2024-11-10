"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/content-store";
import { format } from "date-fns";
import PlaylistContentGrid from "@/components/playlists/playlist-content-grid";
import AddContentToPlaylistDialog from "@/components/playlists/add-content-to-playlist-dialog";
import PlaylistInsights from "@/components/playlists/playlist-insights";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlaylistContentProps {
  playlistId: string;
}

export default function PlaylistContent({ playlistId }: PlaylistContentProps) {
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { playlists, items } = useContentStore();
  
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Playlist not found</h1>
        <Button onClick={() => router.push("/playlists")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Playlists
        </Button>
      </div>
    );
  }

  const playlistContent = playlist.type === 'smart'
    ? useContentStore.getState().getSmartPlaylistContent(playlist)
    : items.filter(item => playlist.contentIds.includes(item.id));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/playlists")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{playlist.name}</h1>
          <p className="text-muted-foreground">{playlist.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>{playlistContent.length} items</span>
            <span>•</span>
            <span>Last updated {format(new Date(playlist.updatedAt), "MMM d, yyyy")}</span>
          </div>
        </div>
        {playlist.type !== 'smart' && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        )}
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart2 className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-6">
          <PlaylistContentGrid playlist={playlist} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <PlaylistInsights playlistId={playlist.id} />
        </TabsContent>
      </Tabs>

      {playlist.type !== 'smart' && (
        <AddContentToPlaylistDialog
          playlistId={playlistId}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      )}
    </div>
  );
}