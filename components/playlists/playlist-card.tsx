"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Trash2, Plus, Film, ArrowRight, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useContentStore, type Playlist } from "@/lib/content-store";
import EditPlaylistDialog from "./edit-playlist-dialog";
import PlaylistSharing from "./playlist-sharing";
import { toast } from "sonner";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSharingDialog, setShowSharingDialog] = useState(false);
  const { items, deletePlaylist } = useContentStore();

  const playlistContent = items.filter(item => playlist.contentIds.includes(item.id));

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    setShowDeleteDialog(false);
    toast.success("Playlist deleted successfully");
  };

  const handleViewPlaylist = () => {
    router.push(`/playlists/${playlist.id}`);
  };

  return (
    <>
      <Card className="flex flex-col group cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="line-clamp-1">{playlist.name}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSharingDialog(true);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditDialog(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {playlist.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1" onClick={handleViewPlaylist}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{playlistContent.length} items</span>
              <span>Updated: {format(new Date(playlist.updatedAt), "MMM d, yyyy")}</span>
            </div>
            {playlistContent.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {playlistContent.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="aspect-video relative rounded-md overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Film className="h-8 w-8 mb-2" />
                <p className="text-sm">No content yet</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/playlists/${playlist.id}?add=true`);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
          <Button className="w-full" onClick={handleViewPlaylist}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditPlaylistDialog
        playlist={playlist}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Sharing Dialog */}
      <PlaylistSharing
        playlist={playlist}
        open={showSharingDialog}
        onOpenChange={setShowSharingDialog}
      />
    </>
  );
}