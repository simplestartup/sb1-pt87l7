import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Library - StreamTracker",
  description: "Browse your complete content library",
};

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Library</h1>
        <p className="text-gray-500">Browse all your tracked content in one place</p>
      </div>
      <ContentGrid />
    </div>
  );
}