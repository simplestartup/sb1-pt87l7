import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Browse - Lumina",
  description: "Browse all content",
};

export default function BrowsePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse</h1>
        <p className="text-muted-foreground">Discover new content</p>
      </div>
      <ContentGrid />
    </div>
  );
}