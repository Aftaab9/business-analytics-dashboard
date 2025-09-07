// src/components/charts/sample-pie-chart.tsx
"use client"

import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PieChartDataPoint {
  name: string;
  value: number;
}

interface SamplePieChartProps {
  data: PieChartDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

export function SamplePieChart({ data, title, description, className }: SamplePieChartProps) {
  const chartColors = ['1', '2', '3', '4', '5'];
  
  const chartConfig = data.reduce((acc, item, index) => {
    const colorKey = chartColors[index % chartColors.length];
    acc[item.name] = {
      label: item.name,
      color: `hsl(var(--chart-${colorKey}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="min-h-[200px] aspect-square w-full max-w-[350px]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" formatter={(value) => `${value}%`} />} />
              <Legend />
              <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={`hsl(var(--chart-${chartColors[index % chartColors.length]}))`}/>
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
