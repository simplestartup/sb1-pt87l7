"use client";

import { useContentStore } from "@/lib/content-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Sparkles, MonitorPlay, Film, Tv2, Video, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const contentTypes = [
  { id: 'movie', label: 'Movies', icon: Film, color: 'from-blue-500 to-indigo-500', route: 'movies' },
  { id: 'tv', label: 'TV Series', icon: Tv2, color: 'from-purple-500 to-pink-500', route: 'series' },
  { id: 'documentary', label: 'Documentaries', icon: Video, color: 'from-emerald-500 to-teal-500', route: 'documentaries' },
  { id: 'podcast', label: 'Educational', icon: Mic, color: 'from-orange-500 to-red-500', route: 'podcasts' }
];

export default function DashboardHero() {
  const router = useRouter();
  const { items } = useContentStore();
  const hasContent = items.length > 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-violet-500 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative p-8">
          <div className="max-w-2xl">
            {!hasContent ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <MonitorPlay className="h-12 w-12" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
                  </div>
                  <h1 className="text-4xl font-bold">
                    Welcome to Lumina
                  </h1>
                </div>
                <p className="text-lg mb-6 text-blue-100">
                  Your intelligent streaming companion. Track what you watch, discover new content, and get AI-powered recommendations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-blue-50"
                    onClick={() => router.push("/library")}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Content
                  </Button>
                  <Button
                    size="lg"
                    className="border-2 border-white bg-transparent text-white hover:bg-white/20"
                    onClick={() => router.push("/recommendations")}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
                </div>
                <p className="text-lg mb-6 text-blue-100">
                  We've analyzed your watching patterns and have personalized recommendations ready for you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-blue-50"
                    onClick={() => router.push("/recommendations")}
                  >
                    View Recommendations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="border-2 border-white bg-transparent text-white hover:bg-white/20"
                    onClick={() => router.push("/insights")}
                  >
                    See Insights
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const itemCount = items.filter(item => 
            type.id === 'podcast' ? item.platform === 'youtube' : item.type === type.id
          ).length;

          return (
            <Card
              key={type.id}
              className={cn(
                "relative overflow-hidden cursor-pointer group",
                "hover:shadow-lg transition-shadow"
              )}
              onClick={() => router.push(`/${type.route}`)}
            >
              <div className={cn(
                "absolute inset-0 opacity-10 bg-gradient-to-br",
                type.color
              )} />
              <div className="relative p-6">
                <Icon className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{type.label}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {itemCount} items
                </p>
                <Button
                  variant="ghost"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  Browse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}