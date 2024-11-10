"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContentStore } from "@/lib/content-store";
import { Recommendation } from "@/lib/ai-features";
import { toast } from "sonner";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation
}: RecommendationCardProps) {
  const { content, score, reason, source } = recommendation;
  const { addContent } = useContentStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    try {
      addContent({
        title: content.title,
        type: content.type,
        platform: content.platform,
        genre: content.genre,
        releaseDate: content.releaseDate
      });
      toast.success("Added to your library");
    } catch (error) {
      toast.error("Failed to add content");
    }
    setIsAdding(false);
  };

  return (
    <Card className="group relative overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={content.image}
          alt={content.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {content.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">
              {content.type}
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20"
            >
              {content.platform}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {Math.round(score * 100)}% match
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{reason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}