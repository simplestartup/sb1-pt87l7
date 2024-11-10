"use client";

import { useContentStore } from "@/lib/content-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity() {
  const { items } = useContentStore();
  
  const recentItems = items
    .filter(item => item.watched)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 5);

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-muted-foreground">
                  {item.title[0]}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(item.releaseDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}