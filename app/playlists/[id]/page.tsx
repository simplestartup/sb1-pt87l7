import { Metadata } from "next";
import PlaylistContent from "@/components/playlists/playlist-content";

export const metadata: Metadata = {
  title: "Playlist - Lumina",
  description: "View and manage your playlist content",
};

interface PlaylistPageProps {
  params: { id: string };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  return <PlaylistContent playlistId={params.id} />;
}