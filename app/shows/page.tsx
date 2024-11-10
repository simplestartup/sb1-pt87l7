import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows - StreamTracker",
  description: "Browse and track TV shows",
};

export default function ShowsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">TV Shows</h1>
        <p className="text-gray-500">Browse and track your TV shows</p>
      </div>
    </div>
  );
}