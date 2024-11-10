import { Metadata } from "next";
import { AIRecommendations } from "@/components/ai/recommendations";

export const metadata: Metadata = {
  title: "AI Recommendations - Lumina",
  description: "Get personalized movie and show recommendations",
};

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
        <p className="text-muted-foreground">
          Personalized content recommendations based on your watching habits
        </p>
      </div>
      <AIRecommendations />
    </div>
  );
}