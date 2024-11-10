"use client";

import { Button } from "@/components/ui/button";
import { Check, Clock, ListPlus, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
  watched: boolean;
  onWatchedToggle: () => void;
  onAddToPlaylist: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionButtons({
  watched,
  onWatchedToggle,
  onAddToPlaylist,
  onEdit,
  onDelete,
}: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onWatchedToggle}>
              {watched ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {watched ? "Mark as Unwatched" : "Mark as Watched"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onAddToPlaylist}>
              <ListPlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add to Playlist</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}