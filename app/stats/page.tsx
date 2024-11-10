import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats - StreamTracker",
  description: "Your watching statistics",
};

export default function StatsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Stats</h1>
        <p className="text-gray-500">Your watching statistics and insights</p>
      </div>
    </div>
  );
}