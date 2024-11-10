"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore, type Playlist } from "@/lib/content-store";
import { toast } from "sonner";

interface EditPlaylistDialogProps {
  playlist: Playlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPlaylistDialog({
  playlist,
  open,
  onOpenChange
}: EditPlaylistDialogProps) {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const { updatePlaylist } = useContentStore();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    updatePlaylist(playlist.id, {
      name: name.trim(),
      description: description.trim()
    });
    toast.success("Playlist updated successfully");
    handleClose();
  };

  const handleClose = () => {
    setName(playlist.name);
    setDescription(playlist.description);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter playlist description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}