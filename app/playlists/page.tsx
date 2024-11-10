import { Metadata } from "next";
import dynamic from 'next/dynamic';

const PlaylistGrid = dynamic(() => import("@/components/playlists/playlist-grid"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Playlists - Lumina",
  description: "Manage your custom playlists",
};

export default function PlaylistsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Playlists</h1>
        <p className="text-gray-500">Create and manage your custom collections</p>
      </div>
      <PlaylistGrid />
    </div>
  );
}