// src/components/charts/sample-scatter-chart.tsx
"use client"

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ZAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CustomerCluster } from "@/types"

interface SampleScatterChartProps {
  data: CustomerCluster[];
  title: string;
  description?: string;
  className?: string;
}

export function SampleScatterChart({ data, title, description, className }: SampleScatterChartProps) {
  // Group data by cluster label
  const clusters = data.reduce((acc, point) => {
    const key = point.clusterLabel || `Cluster ${point.clusterId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(point);
    return acc;
  }, {} as Record<string, CustomerCluster[]>);

  const chartColors = ['1', '2', '3', '4', '5'];
  
  const chartConfig = Object.keys(clusters).reduce((acc, key, index) => {
    acc[key] = {
      label: key,
      color: `hsl(var(--chart-${chartColors[index % chartColors.length]}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Feature 1" 
                unit="" 
                domain={['dataMin - 0.1', 'dataMax + 0.1']} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                label={{ value: "Principal Component 1", position: "insideBottom", dy: 25, fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Feature 2" 
                unit="" 
                domain={['dataMin - 0.1', 'dataMax + 0.1']} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                label={{ value: "Principal Component 2", angle: -90, position: "insideLeft", dx: -25, fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <ZAxis type="string" dataKey="customerID" name="Customer ID" />
              <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" align="right" />
              {Object.entries(clusters).map(([clusterName, clusterData], index) => (
                <Scatter 
                  key={clusterName} 
                  name={clusterName} 
                  data={clusterData} 
                  fill={`hsl(var(--chart-${chartColors[index % chartColors.length]}))`}/>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
