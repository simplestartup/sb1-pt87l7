"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Film, Plus, ListMusic } from "lucide-react";
import { useState } from "react";
import { useContentStore, type Content } from "@/lib/content-store";
import { toast } from "sonner";
import CreatePlaylistDialog from "./create-playlist-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AddToPlaylistDialogProps {
  content: Content;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddToPlaylistDialog({
  content,
  open,
  onOpenChange
}: AddToPlaylistDialogProps) {
  const [search, setSearch] = useState("");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const { playlists, addToPlaylist } = useContentStore();

  // Filter out smart playlists and playlists that already contain the content
  const availablePlaylists = playlists.filter(playlist => 
    playlist.type !== 'smart' && !playlist.contentIds.includes(content.id)
  );

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, content.id);
    toast.success("Added to playlist");
    onOpenChange(false);
  };

  const handleCreatePlaylistSuccess = (playlistId: string) => {
    handleAddToPlaylist(playlistId);
    setShowCreatePlaylist(false);
  };

  const filteredPlaylists = availablePlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search playlists..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowCreatePlaylist(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </div>

          {availablePlaylists.length === 0 ? (
            <div className="text-center py-12">
              <ListMusic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No playlists available</h3>
              <p className="text-muted-foreground mb-6">
                Create a new playlist to add this content
              </p>
              <Button onClick={() => setShowCreatePlaylist(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group relative cursor-pointer rounded-lg border bg-card hover:bg-accent transition-colors"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium line-clamp-1">{playlist.name}</h4>
                      <Badge variant="secondary" className="shrink-0">
                        {playlist.contentIds.length} items
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {playlist.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {format(new Date(playlist.updatedAt), "MMM d, yyyy")}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-accent/50 rounded-lg">
                      <Button variant="secondary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Playlist
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredPlaylists.length === 0 && availablePlaylists.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No playlists found matching "{search}"
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreatePlaylistDialog 
        open={showCreatePlaylist} 
        onOpenChange={setShowCreatePlaylist}
        onSuccess={handleCreatePlaylistSuccess}
      />
    </>
  );
}