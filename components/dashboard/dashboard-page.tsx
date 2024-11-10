"use client";

import dynamic from 'next/dynamic';

const DashboardHeader = dynamic(() => import("./header"), {
  ssr: false
});

const DashboardHero = dynamic(() => import("./hero"), {
  ssr: false
});

const WatchProgress = dynamic(() => import("./watch-progress"), {
  ssr: false
});

const QuickInsights = dynamic(() => import("./quick-insights"), {
  ssr: false
});

const TopRecommendations = dynamic(() => import("./top-recommendations"), {
  ssr: false
});

const RecentActivity = dynamic(() => import("./recent-activity"), {
  ssr: false
});

const WatchlistPreview = dynamic(() => import("./watchlist-preview"), {
  ssr: false
});

const TrendingContent = dynamic(() => import("./trending-content"), {
  ssr: false
});

const ContentGrid = dynamic(() => import("./content-grid"), {
  ssr: false
});

export default function Dashboard() {
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
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Your Library</h2>
        <ContentGrid />
      </div>
    </div>
  );
}