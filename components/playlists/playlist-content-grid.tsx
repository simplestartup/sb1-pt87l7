"use client";

import { useState } from "react";
import { Search, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContentStore, type Playlist } from "@/lib/content-store";
import PlaylistContentCard from "./playlist-content-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlaylistContentGridProps {
  playlist: Playlist;
}

export default function PlaylistContentGrid({ playlist }: PlaylistContentGridProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const { items } = useContentStore();

  const playlistContent = items.filter(item => playlist.contentIds.includes(item.id));

  const filteredContent = playlistContent
    .filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "type":
          return a.type.localeCompare(b.type);
        case "dateAdded":
          const aIndex = playlist.contentIds.indexOf(a.id);
          const bIndex = playlist.contentIds.indexOf(b.id);
          return bIndex - aIndex;
        default:
          return 0;
      }
    });

  if (playlistContent.length === 0) {
    return (
      <div className="text-center py-12">
        <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">This playlist is empty</h3>
        <p className="text-muted-foreground">
          Add some movies or shows to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, type, or genre..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredContent.map((item) => (
          <PlaylistContentCard
            key={item.id}
            content={item}
            playlistId={playlist.id}
          />
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for "{search}"
          </p>
        </div>
      )}
    </div>
  );
}