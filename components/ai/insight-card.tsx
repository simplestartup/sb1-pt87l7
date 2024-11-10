"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  description: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  details?: string[];
  icon: React.ElementType;
  className?: string;
}

export function InsightCard({
  title,
  description,
  value,
  trend,
  details,
  icon: Icon,
  className
}: InsightCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-yellow-500';

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {title}
          </div>
        </CardTitle>
        {trend && (
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {value !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(value)}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          )}

          {details && details.length > 0 && (
            <div className="space-y-2 mt-4">
              {details.map((detail, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {detail}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}