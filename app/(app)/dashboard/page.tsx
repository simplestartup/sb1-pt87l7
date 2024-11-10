import { Metadata } from "next";
import dynamic from 'next/dynamic';

const DashboardHeader = dynamic(() => import("@/components/dashboard/header"), {
  ssr: false
});

const DashboardHero = dynamic(() => import("@/components/dashboard/hero"), {
  ssr: false
});

const WatchProgress = dynamic(() => import("@/components/dashboard/watch-progress"), {
  ssr: false
});

const QuickInsights = dynamic(() => import("@/components/dashboard/quick-insights"), {
  ssr: false
});

const TopRecommendations = dynamic(() => import("@/components/dashboard/top-recommendations"), {
  ssr: false
});

const RecentActivity = dynamic(() => import("@/components/dashboard/recent-activity"), {
  ssr: false
});

const WatchlistPreview = dynamic(() => import("@/components/dashboard/watchlist-preview"), {
  ssr: false
});

const TrendingContent = dynamic(() => import("@/components/dashboard/trending-content"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "Dashboard - Lumina",
  description: "Your streaming dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader />
      <DashboardHero />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WatchProgress />
        <QuickInsights />
        <WatchlistPreview />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <TopRecommendations />
        <RecentActivity />
      </div>

      <TrendingContent />
    </div>
  );
}