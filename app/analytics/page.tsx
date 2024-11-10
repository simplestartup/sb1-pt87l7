import { Metadata } from "next";
import Analytics from "@/components/dashboard/analytics";

export const metadata: Metadata = {
  title: "Analytics - StreamTracker",
  description: "View your watching statistics and insights",
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="text-gray-500">Insights about your watching habits</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Analytics />
      </div>
    </div>
  );
}