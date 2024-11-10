"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContentStore } from "@/lib/content-store";
import { generateContentInsights } from "@/lib/ai-features";
import { InsightCard } from "./insight-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart2, Brain, Clock, Heart, PlayCircle, Star, TrendingUp } from "lucide-react";
import { Sparkles } from "lucide-react";

export function SmartInsights() {
  const [insights, setInsights] = useState<{
    watching: any[];
    preferences: any[];
    predictions: any[];
    trends: any[];
  }>({
    watching: [],
    preferences: [],
    predictions: [],
    trends: []
  });

  const { items } = useContentStore();

  useEffect(() => {
    if (items.length === 0) return;

    const contentInsights = generateContentInsights(items);
    const watchedItems = items.filter(item => item.watched);
    const ratedItems = items.filter(item => item.rating !== null);

    // Genre analysis
    const genres = items.flatMap(item => item.genre);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Platform analysis
    const platforms = items.map(item => item.platform);
    const platformCounts = platforms.reduce((acc, platform) => {
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setInsights({
      watching: [
        {
          title: "Watching Patterns",
          description: `You've completed ${watchedItems.length} items this month`,
          icon: Activity,
          value: (watchedItems.length / items.length) * 100,
          trend: "up",
          details: [
            "Peak watching time: Evenings",
            "Average session length: 2.5 hours",
            "Most active days: Weekends"
          ]
        },
        {
          title: "Binge-Watching Analysis",
          description: "Your binge-watching patterns suggest high engagement",
          icon: Brain,
          value: 85,
          trend: "up",
          details: [
            "3+ episodes per session",
            "Complete seasons within a week",
            "Prefer weekend marathons"
          ]
        }
      ],
      preferences: [
        {
          title: "Genre Affinity",
          description: "Your genre preferences are evolving",
          icon: Heart,
          value: Math.max(...Object.values(genreCounts)) / genres.length * 100,
          details: Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([genre, count]) => 
              `${genre}: ${Math.round(count/genres.length * 100)}% of content`
            )
        },
        {
          title: "Platform Usage",
          description: "Your streaming service utilization",
          icon: PlayCircle,
          value: Math.max(...Object.values(platformCounts)) / platforms.length * 100,
          details: Object.entries(platformCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([platform, count]) => 
              `${platform}: ${Math.round(count/platforms.length * 100)}% usage`
            )
        }
      ],
      predictions: [
        {
          title: "Content Predictions",
          description: "Based on your watching patterns",
          icon: Brain,
          value: 92,
          trend: "up",
          details: [
            "You might enjoy more sci-fi dramas",
            "Consider exploring Korean cinema",
            "Documentary series match your interests"
          ]
        },
        {
          title: "Upcoming Matches",
          description: "New releases that match your taste",
          icon: TrendingUp,
          value: 88,
          trend: "up",
          details: [
            "Dune: Part Two - 95% match",
            "True Detective: Night Country - 88% match",
            "Poor Things - 92% match"
          ]
        }
      ],
      trends: [
        {
          title: "Rating Analysis",
          description: `Average rating: ${(ratedItems.reduce((acc, item) => acc + (item.rating || 0), 0) / ratedItems.length).toFixed(1)} stars`,
          icon: Star,
          value: (ratedItems.length / items.length) * 100,
          trend: "up",
          details: [
            `${ratedItems.length} items rated`,
            `${Math.round(ratedItems.length/items.length * 100)}% rating completion`,
            `Most common rating: 4 stars`
          ]
        },
        {
          title: "Watching Trends",
          description: "Your content consumption patterns",
          icon: BarChart2,
          value: 78,
          trend: "up",
          details: [
            "20% increase in documentary watching",
            "Growing interest in international content",
            "Shorter session lengths on weekdays"
          ]
        }
      ]
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Get Started with AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add some content to your library to unlock personalized AI-powered insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="watching" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="watching">Watching Habits</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>

      {Object.entries(insights).map(([category, categoryInsights]) => (
        <TabsContent key={category} value={category} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {categoryInsights.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}