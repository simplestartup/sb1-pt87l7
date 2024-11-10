"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

interface InsightChartProps {
  title: string;
  type: "pie" | "bar" | "progress";
  data: Record<string, number>;
  colors: string[];
  layout?: "vertical" | "horizontal";
  limit?: number;
  formatLabel?: (key: string) => string;
}

export function InsightChart({
  title,
  type,
  data,
  colors,
  layout = "horizontal",
  limit,
  formatLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1)
}: InsightChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name: formatLabel(name),
      value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === "progress" ? (
          <div className="space-y-4">
            {chartData.map(({ name, value }, index) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{name}</span>
                  <span className="text-muted-foreground">
                    {Math.round(value)}%
                  </span>
                </div>
                <Progress 
                  value={value} 
                  className={`h-2 [&>div]:bg-[${colors[index % colors.length]}]`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {type === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart
                  data={chartData}
                  layout={layout}
                  margin={
                    layout === "vertical"
                      ? { top: 5, right: 30, left: 40, bottom: 5 }
                      : { top: 5, right: 30, left: 20, bottom: 5 }
                  }
                >
                  {layout === "vertical" ? (
                    <>
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                    </>
                  ) : (
                    <>
                      <XAxis dataKey="name" />
                      <YAxis />
                    </>
                  )}
                  <Tooltip />
                  <Bar dataKey="value" fill={colors[0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}