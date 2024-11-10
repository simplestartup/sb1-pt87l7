"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Film, Plus } from "lucide-react";
import { useState } from "react";
import { useContentStore } from "@/lib/content-store";
import { toast } from "sonner";
import Image from "next/image";

interface AddContentToPlaylistDialogProps {
  playlistId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddContentToPlaylistDialog({
  playlistId,
  open,
  onOpenChange
}: AddContentToPlaylistDialogProps) {
  const [search, setSearch] = useState("");
  const { items, playlists, addToPlaylist } = useContentStore();

  // Get the current playlist
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) return null;

  // Get all content not already in the playlist
  const availableContent = items.filter(item => !playlist.contentIds.includes(item.id));

  const handleAddToPlaylist = (contentId: string) => {
    addToPlaylist(playlistId, contentId);
    toast.success("Added to playlist");
  };

  const filteredContent = availableContent.filter(content =>
    content.title.toLowerCase().includes(search.toLowerCase()) ||
    content.genre.some(g => g.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Content to {playlist.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or genre..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {availableContent.length === 0 ? (
            <div className="text-center py-12">
              <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No content available</h3>
              <p className="text-muted-foreground">
                Add some content to your library first
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-h-[60vh] overflow-y-auto">
              {filteredContent.map((content) => (
                <div
                  key={content.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  onClick={() => handleAddToPlaylist(content.id)}
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={content.image}
                      alt={content.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Playlist
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium line-clamp-1">{content.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {content.type} • {content.platform}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredContent.length === 0 && availableContent.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No content found matching "{search}"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}