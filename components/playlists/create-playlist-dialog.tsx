"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore } from "@/lib/content-store";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (playlistId: string) => void;
}

export default function CreatePlaylistDialog({
  open,
  onOpenChange,
  onSuccess
}: CreatePlaylistDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createPlaylist } = useContentStore();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    // Generate a unique ID for the new playlist
    const playlistId = uuidv4();
    
    // Create the playlist
    createPlaylist(name.trim(), description.trim());
    toast.success("Playlist created successfully");
    
    // Call success callback with the new playlist ID
    if (onSuccess) {
      onSuccess(playlistId);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
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
          <Button onClick={handleSubmit}>Create Playlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}