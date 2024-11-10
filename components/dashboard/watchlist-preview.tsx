"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WatchlistPreview() {
  const router = useRouter();
  const { items } = useContentStore();
  
  const watchlistItems = items
    .filter(item => !item.watched)
    .slice(0, 3);

  if (watchlistItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Watch Later
        </CardTitle>
        <Button variant="ghost" onClick={() => router.push("/watch-later")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-20 rounded-lg overflow-hidden">
                {/* Set a fixed aspect ratio container */}
                <div className="pb-[150%]" /> {/* 2:3 aspect ratio */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="absolute inset-0 object-cover"
                  sizes="(max-width: 768px) 80px, 80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.type} • {item.platform}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}