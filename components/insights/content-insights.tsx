"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useContentStore } from "@/lib/content-store";
import { generateContentInsights, ContentInsight } from "@/lib/ai-features";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export default function ContentInsights() {
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const { items } = useContentStore();

  useEffect(() => {
    const newInsights = generateContentInsights(items);
    setInsights(newInsights);
  }, [items]);

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Insights Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add more content to your library to get personalized insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              {insight.title}
              {insight.trend && (
                <span>
                  {insight.trend === "up" ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : insight.trend === "down" ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-yellow-500" />
                  )}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{insight.description}</p>
            {typeof insight.value === "number" && (
              <Progress
                value={insight.value}
                className="h-2"
                indicatorClassName={
                  insight.trend === "up"
                    ? "bg-green-500"
                    : insight.trend === "down"
                    ? "bg-red-500"
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}