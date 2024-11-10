"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface InsightMetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  progress?: number;
  className?: string;
}

export function InsightMetricCard({
  title,
  value,
  icon: Icon,
  progress,
  className
}: InsightMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
        {progress !== undefined && (
          <Progress 
            value={progress} 
            className="mt-2 [&>div]:bg-primary"
          />
        )}
      </CardContent>
    </Card>
  );
}