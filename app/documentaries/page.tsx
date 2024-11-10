import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ContentGrid = dynamic(() => import("@/components/dashboard/content-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Documentaries - Lumina",
  description: "Browse your documentary collection",
};

export default function DocumentariesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentaries</h1>
        <p className="text-muted-foreground">Your documentary collection</p>
      </div>
      <ContentGrid type="documentary" />
    </div>
  );
}