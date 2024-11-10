"use client";

import { useState } from "react";
import ContentCard from "./content-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentGridProps {
  type?: string;
  filter?: 'favorites' | 'watchLater' | 'history' | 'rated' | 'collection';
}

export default function ContentGrid({ type, filter }: ContentGridProps) {
  const [search, setSearch] = useState("");
  const { items } = useContentStore();

  // Map UI type to stored content type
  const typeMapping: Record<string, string> = {
    movie: 'movie',
    tv: 'tv',
    series: 'tv',
    documentary: 'documentary',
    podcast: 'podcast'
  };

  const filteredItems = items
    .filter(item => {
      // Type filtering
      if (type) {
        if (type === 'podcast') {
          return item.platform === 'youtube';
        }
        const mappedType = typeMapping[type];
        return item.type === mappedType;
      }
      return true;
    })
    .filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(search.toLowerCase())) ||
      (item.host && item.host.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(item => {
      if (!filter) return true;
      switch (filter) {
        case 'favorites': return item.rating === 5;
        case 'watchLater': return !item.watched;
        case 'history': return item.watched;
        case 'rated': return item.rating !== null;
        case 'collection': return true;
        default: return true;
      }
    });

  const movieItems = filteredItems.filter(item => item.type === 'movie');
  const tvItems = filteredItems.filter(item => item.type === 'tv');
  const documentaryItems = filteredItems.filter(item => item.type === 'documentary');
  const podcastItems = filteredItems.filter(item => item.platform === 'youtube');

  return (
    <div className="space-y-6">
      <div className="relative max-w-md w-full mx-auto md:mx-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${type || 'content'}...`}
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {type ? (
        filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {search ? "No results found" : "No content added yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredItems.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tv">TV Shows</TabsTrigger>
            <TabsTrigger value="documentaries">Documentaries</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {search ? "No results found" : "No content added yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {filteredItems.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movies">
            {movieItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {search ? "No movies found" : "No movies added yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {movieItems.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tv">
            {tvItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {search ? "No TV shows found" : "No TV shows added yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {tvItems.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentaries">
            {documentaryItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {search ? "No documentaries found" : "No documentaries added yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {documentaryItems.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="podcasts">
            {podcastItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {search ? "No podcasts found" : "No podcasts added yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {podcastItems.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}