"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/lib/content-store";
import PlaylistCard from "./playlist-card";
import CreatePlaylistDialog from "./create-playlist-dialog";

export default function PlaylistGrid() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { playlists } = useContentStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first playlist to start organizing your content
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Playlist
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      <CreatePlaylistDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}