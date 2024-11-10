import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Watch Later - StreamTracker",
  description: "Your watch list of movies and shows",
};

export default function WatchLaterPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Watch Later</h1>
        <p className="text-gray-500">Content you want to watch in the future</p>
      </div>
      <ContentGrid filter="watchLater" />
    </div>
  );
}