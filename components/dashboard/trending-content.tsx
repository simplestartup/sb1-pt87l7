"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getTrending } from "@/lib/tmdb";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingItem {
  id: string;
  title: string;
  image: string;
  type: string;
  platform: string;
  confidence: number;
}

function TrendingItemSkeleton() {
  return (
    <div className="relative">
      <div className="relative rounded-lg overflow-hidden">
        <div className="pb-[150%] bg-muted" />
      </div>
    </div>
  );
}

export default function TrendingContent() {
  const router = useRouter();
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        setLoading(true);
        setError(null);
        const [movies, shows] = await Promise.all([
          getTrending('movie'),
          getTrending('tv')
        ]);
        const combined = [...movies, ...shows]
          .slice(0, 6)
          .map(item => ({
            ...item,
            confidence: Math.round(item.tmdbRating * 10)
          }));
        setTrending(combined);
      } catch (error) {
        console.error('Error fetching trending content:', error);
        setError('Failed to load trending content');
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (error) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Trending Now
        </CardTitle>
        <Button variant="ghost" onClick={() => router.push("/browse")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <TrendingItemSkeleton key={i} />
              ))}
            </>
          ) : (
            trending.map((item) => (
              <div key={item.id} className="group relative">
                <div className="relative rounded-lg overflow-hidden">
                  <div className="pb-[150%]" />
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="absolute inset-0 object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-medium line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 mt-1">
                      <span className="text-sm capitalize">{item.type}</span>
                      <span className="text-xs">•</span>
                      <span className="text-sm capitalize">{item.platform}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs text-white">{item.confidence}%</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => router.push(`/content/${item.id}`)}
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}