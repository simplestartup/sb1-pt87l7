"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContentStore } from "@/lib/content-store";
import { generateRecommendations, Recommendation } from "@/lib/ai-features";
import RecommendationCard from "./recommendation-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RecommendationGrid() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { items, playlists } = useContentStore();

  useEffect(() => {
    const newRecommendations = generateRecommendations(items, playlists);
    setRecommendations(newRecommendations);
  }, [items, playlists]);

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add more content to your library to get personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personalized">Personalized</TabsTrigger>
          <TabsTrigger value="similar">Similar</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.content.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personalized" className="mt-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations
              .filter((r) => r.source === "personalized")
              .map((recommendation) => (
                <RecommendationCard
                  key={recommendation.content.id}
                  recommendation={recommendation}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="similar" className="mt-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations
              .filter((r) => r.source === "similar")
              .map((recommendation) => (
                <RecommendationCard
                  key={recommendation.content.id}
                  recommendation={recommendation}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations
              .filter((r) => r.source === "trending")
              .map((recommendation) => (
                <RecommendationCard
                  key={recommendation.content.id}
                  recommendation={recommendation}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}