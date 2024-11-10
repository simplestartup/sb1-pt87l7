import { Metadata } from "next";
import dynamic from 'next/dynamic';

const RecentActivity = dynamic(() => import("@/components/dashboard/recent-activity"), {
  ssr: false
});

const WatchProgress = dynamic(() => import("@/components/dashboard/watch-progress"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Activity - Lumina",
  description: "View your watching activity",
};

export default function ActivityPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-muted-foreground">Track your watching progress</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <WatchProgress />
        <RecentActivity />
      </div>
    </div>
  );
}