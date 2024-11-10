import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ratings - StreamTracker",
  description: "Your content ratings",
};

export default function RatingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ratings</h1>
        <p className="text-gray-500">Your ratings and reviews</p>
      </div>
    </div>
  );
}