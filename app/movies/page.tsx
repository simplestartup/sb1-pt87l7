import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Movies - Lumina",
  description: "Browse your movie collection",
};

export default function MoviesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Movies</h1>
        <p className="text-gray-500">Your complete movie collection</p>
      </div>
      <ContentGrid type="movie" />
    </div>
  );
}