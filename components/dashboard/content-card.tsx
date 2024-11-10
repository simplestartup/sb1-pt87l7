"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, Clock, Check, Pencil, Trash2, Plus, ExternalLink, Youtube } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/lib/content-store";
import { toast } from "sonner";
import AddToPlaylistDialog from "@/components/playlists/add-to-playlist-dialog";
import { ActionButtons } from "./action-buttons";
import { RatingStars } from "./rating-stars";
import Image from "next/image";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    type: string;
    platform: string;
    genre: string[];
    releaseDate: string;
    watched: boolean;
    rating: number | null;
    image: string;
    host?: string;
    episodeCount?: number;
    duration?: string;
    youtubeId?: string;
    overview?: string;
    tmdbRating?: number;
  };
}

const platformColors = {
  netflix: "bg-red-500",
  prime: "bg-blue-500",
  apple: "bg-gray-500",
  hbo: "bg-purple-500",
  disney: "bg-blue-600",
  theaters: "bg-amber-500",
  youtube: "bg-red-600",
  spotify: "bg-green-500"
};

export default function ContentCard({ content }: ContentCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { updateContent, removeContent } = useContentStore();

  const handleWatchedToggle = () => {
    updateContent(content.id, { watched: !content.watched });
    toast.success(content.watched ? "Marked as unwatched" : "Marked as watched");
  };

  const handleRating = (value: number) => {
    updateContent(content.id, { 
      rating: content.rating === value ? null : value 
    });
    toast.success(content.rating === value ? "Rating removed" : `Rated ${value} stars`);
  };

  const handleDelete = () => {
    removeContent(content.id);
    setShowDeleteDialog(false);
    toast.success("Content removed from library");
  };

  const handleSave = () => {
    updateContent(content.id, editedContent);
    setShowEditDialog(false);
    toast.success("Changes saved");
  };

  const handleOpenYouTube = () => {
    if (content.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${content.youtubeId}`, '_blank');
    }
  };

  const isYouTube = content.platform === 'youtube';

  if (isYouTube) {
    return (
      <Card className="group relative h-full flex flex-col overflow-hidden">
        {/* Video Thumbnail Section */}
        <div className="relative aspect-video">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4">
              <ActionButtons
                watched={content.watched}
                onWatchedToggle={handleWatchedToggle}
                onAddToPlaylist={() => setShowAddToPlaylist(true)}
                onEdit={() => setShowEditDialog(true)}
                onDelete={() => setShowDeleteDialog(true)}
              />
            </div>
          </div>
          {/* YouTube Badge */}
          <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5">
            <Youtube className="h-4 w-4" />
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col gap-3">
            {/* Title and External Link */}
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-lg text-left hover:no-underline w-full"
                  onClick={handleOpenYouTube}
                >
                  <span className="text-left hover:text-primary transition-colors line-clamp-2">
                    {content.title}
                  </span>
                </Button>
              </div>
              <ExternalLink 
                className="h-4 w-4 shrink-0 mt-1 cursor-pointer hover:text-primary transition-colors" 
                onClick={handleOpenYouTube}
              />
            </div>

            {/* Channel and Duration Info */}
            <div className="flex items-center gap-2 flex-wrap">
              {content.host && (
                <span className="text-sm text-muted-foreground">
                  {content.host}
                </span>
              )}
              {content.duration && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {content.duration}
                  </span>
                </>
              )}
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2">
              {content.genre.map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Date Added */}
            <div className="text-sm text-muted-foreground">
              <p>Added: {format(new Date(content.releaseDate), "MMM d, yyyy")}</p>
            </div>
          </div>
        </CardContent>

        {/* Rating Section */}
        <CardFooter className="p-4 pt-0 mt-auto">
          <RatingStars rating={content.rating} onRate={handleRating} />
        </CardFooter>

        {/* Dialogs */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  value={editedContent.title}
                  onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Content</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove "{content.title}" from your library? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddToPlaylistDialog
          content={content}
          open={showAddToPlaylist}
          onOpenChange={setShowAddToPlaylist}
        />
      </Card>
    );
  }

  // Regular content card layout
  return (
    <Card className="group relative h-full flex flex-col overflow-hidden">
      <div className="relative pt-[150%]">
        <Image
          src={content.image}
          alt={content.title}
          fill
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <ActionButtons
            watched={content.watched}
            onWatchedToggle={handleWatchedToggle}
            onAddToPlaylist={() => setShowAddToPlaylist(true)}
            onEdit={() => setShowEditDialog(true)}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
        {content.tmdbRating && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white font-medium">
                {content.tmdbRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg line-clamp-2">{content.title}</h3>
          <Badge variant="secondary" className={cn("text-white ml-2 shrink-0", platformColors[content.platform as keyof typeof platformColors])}>
            {content.platform}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {content.genre.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {format(new Date(content.releaseDate), "MMM d, yyyy")}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <RatingStars rating={content.rating} onRate={handleRating} />
      </CardFooter>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                value={editedContent.title}
                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{content.title}" from your library? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddToPlaylistDialog
        content={content}
        open={showAddToPlaylist}
        onOpenChange={setShowAddToPlaylist}
      />
    </Card>
  );
}