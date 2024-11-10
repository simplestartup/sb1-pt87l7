import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Watch History - StreamTracker",
  description: "View your watch history",
};

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Watch History</h1>
        <p className="text-gray-500">Content you've already watched</p>
      </div>
      <ContentGrid filter="history" />
    </div>
  );
}