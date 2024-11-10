import { Metadata } from "next";
import { SmartInsights } from "@/components/ai/smart-insights";

export const metadata: Metadata = {
  title: "Smart Insights - Lumina",
  description: "AI-powered insights about your watching habits",
};

export default function InsightsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Insights</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of your watching patterns and preferences
        </p>
      </div>
      <SmartInsights />
    </div>
  );
}