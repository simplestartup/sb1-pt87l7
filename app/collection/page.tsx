import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "My Collection - Lumina",
  description: "View your content collection",
};

export default function CollectionPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Collection</h1>
        <p className="text-muted-foreground">Your personal content library</p>
      </div>
      <ContentGrid filter="collection" />
    </div>
  );
}