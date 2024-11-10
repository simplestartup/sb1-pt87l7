"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Link, Mail, Share2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useContentStore } from "@/lib/content-store";
import { generateShareUrl } from "@/lib/utils";

interface PlaylistSharingProps {
  playlist: {
    id: string;
    name: string;
    visibility: 'private' | 'public' | 'shared';
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlaylistSharing({
  playlist,
  open,
  onOpenChange,
}: PlaylistSharingProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState(playlist.visibility);
  const [shareUrl, setShareUrl] = useState("");
  const { updatePlaylist } = useContentStore();

  useEffect(() => {
    if (open) {
      const url = generateShareUrl(playlist.id);
      setShareUrl(url);
      setPermission(playlist.visibility);
    }
  }, [open, playlist]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Share link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleInvite = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    // In a real app, this would send an invitation email
    toast.success(`Invitation sent to ${email}`);
    setEmail("");
  };

  const handlePermissionChange = (value: string) => {
    setPermission(value as 'private' | 'public' | 'shared');
    updatePlaylist(playlist.id, {
      visibility: value as 'private' | 'public' | 'shared'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Playlist</DialogTitle>
          <DialogDescription>
            Share your playlist with others or invite collaborators
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={permission} onValueChange={handlePermissionChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="shared">Shared with specific people</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Invite Collaborators</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleInvite}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Share</Label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleCopy}>
                <Link className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                window.open(`mailto:?subject=Check out my playlist&body=${shareUrl}`);
              }}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: playlist.name,
                    text: `Check out my playlist: ${playlist.name}`,
                    url: shareUrl
                  });
                } else {
                  handleCopy();
                }
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}