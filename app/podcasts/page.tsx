import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Podcasts - Lumina",
  description: "Browse your podcast collection",
};

export default function PodcastsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Podcasts</h1>
        <p className="text-gray-500">Your podcast collection</p>
      </div>
      <ContentGrid type="podcast" />
    </div>
  );
}