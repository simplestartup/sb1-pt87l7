"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, TrendingUp, Activity } from "lucide-react";
import { InsightMetricCard } from "./insight-metric-card";
import { InsightChart } from "./insight-chart";
import { useContentStore } from "@/lib/content-store";
import { cn } from "@/lib/utils";

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f59e0b", // amber
];

interface PlaylistInsightsProps {
  playlistId: string;
}

export default function PlaylistInsights({ playlistId }: PlaylistInsightsProps) {
  const { items, playlists } = useContentStore();
  const [insights, setInsights] = useState<{
    totalItems: number;
    averageRating: number;
    watchedPercentage: number;
    typeDistribution: Record<string, number>;
    genreDistribution: Record<string, number>;
    platformDistribution: Record<string, number>;
    ratingDistribution: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Get playlist content using contentIds from the playlist
    const playlistContent = items.filter(item => playlist.contentIds.includes(item.id));
    
    if (playlistContent.length === 0) {
      return;
    }

    // Calculate insights
    const totalItems = playlistContent.length;
    const watchedItems = playlistContent.filter(item => item.watched);
    const ratedItems = playlistContent.filter(item => item.rating !== null);

    const averageRating = ratedItems.length > 0
      ? ratedItems.reduce((acc, item) => acc + (item.rating || 0), 0) / ratedItems.length
      : 0;

    const watchedPercentage = (watchedItems.length / totalItems) * 100;

    // Type distribution
    const typeDistribution = playlistContent.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert counts to percentages
    Object.keys(typeDistribution).forEach(key => {
      typeDistribution[key] = (typeDistribution[key] / totalItems) * 100;
    });

    // Genre distribution
    const genreDistribution = playlistContent.reduce((acc, item) => {
      item.genre.forEach(genre => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert genre counts to percentages
    Object.keys(genreDistribution).forEach(key => {
      genreDistribution[key] = (genreDistribution[key] / totalItems) * 100;
    });

    // Platform distribution
    const platformDistribution = playlistContent.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert platform counts to percentages
    Object.keys(platformDistribution).forEach(key => {
      platformDistribution[key] = (platformDistribution[key] / totalItems) * 100;
    });

    // Rating distribution
    const ratingDistribution = playlistContent.reduce((acc, item) => {
      if (item.rating) {
        acc[item.rating] = (acc[item.rating] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert rating counts to percentages
    const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    Object.keys(ratingDistribution).forEach(key => {
      ratingDistribution[key] = (ratingDistribution[key] / totalRatings) * 100;
    });

    setInsights({
      totalItems,
      averageRating,
      watchedPercentage,
      typeDistribution,
      genreDistribution,
      platformDistribution,
      ratingDistribution
    });
  }, [items, playlists, playlistId]);

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No insights available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add some content to this playlist to see insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <InsightMetricCard
          title="Total Items"
          value={insights.totalItems.toString()}
          icon={Activity}
        />
        <InsightMetricCard
          title="Average Rating"
          value={insights.averageRating.toFixed(1)}
          icon={Star}
        />
        <InsightMetricCard
          title="Watch Progress"
          value={`${Math.round(insights.watchedPercentage)}%`}
          icon={Clock}
          progress={insights.watchedPercentage}
        />
        <InsightMetricCard
          title="Most Common Type"
          value={Object.entries(insights.typeDistribution)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"}
          icon={TrendingUp}
          className="capitalize"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <InsightChart
          title="Content Types"
          type="pie"
          data={insights.typeDistribution}
          colors={COLORS}
        />
        <InsightChart
          title="Platforms"
          type="bar"
          data={insights.platformDistribution}
          colors={COLORS}
          layout="vertical"
        />
        <InsightChart
          title="Top Genres"
          type="progress"
          data={insights.genreDistribution}
          colors={COLORS}
          limit={5}
        />
        <InsightChart
          title="Rating Distribution"
          type="bar"
          data={insights.ratingDistribution}
          colors={COLORS}
          formatLabel={(key) => `${key} Stars`}
        />
      </div>
    </div>
  );
}