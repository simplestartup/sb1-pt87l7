"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Info, Star, Sparkles, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentStore } from "@/lib/content-store";
import { getTrendingContent, getPersonalizedRecommendations, type AIRecommendation } from "@/lib/ai-features";
import { toast } from "sonner";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function RecommendationSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/3] relative">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: AIRecommendation }) {
  const { addContent } = useContentStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      addContent({
        title: recommendation.title,
        type: recommendation.mediaType,
        platform: 'netflix', // Default to Netflix, can be enhanced with actual platform data
        genre: ['Drama'], // Default genre, can be enhanced with TMDB genres
        releaseDate: recommendation.releaseDate,
        image: recommendation.posterPath,
        overview: recommendation.overview
      });
      toast.success(`Added ${recommendation.title} to your library`);
    } catch (error) {
      toast.error("Failed to add to library");
    }
    setIsAdding(false);
  };

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[2/3]">
        <Image
          src={recommendation.posterPath}
          alt={recommendation.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              className="w-full"
              onClick={handleAdd}
              disabled={isAdding}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Library
            </Button>
          </div>
        </div>
        {recommendation.voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white font-medium">
                {recommendation.voteAverage.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <div className="space-y-3">
          <h3 className="font-semibold line-clamp-2">{recommendation.title}</h3>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {recommendation.mediaType}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "bg-primary/10 text-primary border-primary/20",
                recommendation.confidence >= 90 && "bg-green-500/10 text-green-500 border-green-500/20"
              )}
            >
              {recommendation.confidence}% Match
            </Badge>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Why recommended?</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{recommendation.reason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<{
    all: AIRecommendation[];
    trending: AIRecommendation[];
    personalized: AIRecommendation[];
  }>({
    all: [],
    trending: [],
    personalized: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items } = useContentStore();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const [trending, personalized] = await Promise.all([
          getTrendingContent(),
          items.length > 0 ? getPersonalizedRecommendations(items) : []
        ]);

        // Remove duplicates and combine all recommendations
        const allRecommendations = [...trending, ...personalized]
          .filter((rec, index, self) => 
            index === self.findIndex(r => r.id === rec.id)
          )
          // Sort by confidence score
          .sort((a, b) => b.confidence - a.confidence);

        setRecommendations({
          all: allRecommendations,
          trending,
          personalized
        });
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setError('Failed to load recommendations');
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [items]);

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Get Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Add movies and shows to your library to get personalized recommendations based on your taste.
          </p>
          <Button onClick={() => window.location.href = '/library'}>
            Go to Library
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
        </TabsList>

        {['all', 'personalized', 'trending'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {loading ? (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <RecommendationSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {recommendations[tab as keyof typeof recommendations].map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            )}

            {!loading && recommendations[tab as keyof typeof recommendations].length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations available</h3>
                <p className="text-muted-foreground">
                  {tab === 'personalized' 
                    ? 'Add more content to your library to get personalized recommendations'
                    : 'Check back later for more recommendations'}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}