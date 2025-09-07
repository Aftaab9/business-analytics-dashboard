// src/components/charts/sample-line-chart.tsx
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SampleLineChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name?: string; strokeDasharray?: string }[];
  xAxisKey: string;
  title: string;
  description?: string;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisFormatter?: (value: number) => string;
}

export function SampleLineChart({ data, dataKeys, xAxisKey, title, description, className, xAxisLabel, yAxisLabel, yAxisFormatter }: SampleLineChartProps) {
  const chartConfig = {} as ChartConfig;
  dataKeys.forEach(dk => {
    chartConfig[dk.key] = {
      label: dk.name || dk.key.charAt(0).toUpperCase() + dk.key.slice(1),
      color: `hsl(var(--chart-${dk.color}))`,
    }
  });

  const chartMargin = {
    top: 5,
    right: 20,
    left: yAxisLabel ? 15 : -10,
    bottom: xAxisLabel ? 30 : 5, // Increased bottom margin to prevent overlap
  };
  
  const defaultYAxisFormatter = (value: number) => {
    if (typeof value !== 'number') return String(value);
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', dy: 25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' } : undefined}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                tickFormatter={yAxisFormatter || defaultYAxisFormatter}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', dx: -15, fontSize: 12, fill: 'hsl(var(--muted-foreground))' } : undefined}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Legend verticalAlign="bottom" />
              {dataKeys.map(dk => (
                <Line
                  key={dk.key}
                  dataKey={dk.key}
                  type="monotone"
                  stroke={`var(--color-${dk.key})`}
                  strokeWidth={2}
                  dot={{r:4, fill: `var(--color-${dk.key})`}}
                  activeDot={{r:6}}
                  strokeDasharray={dk.strokeDasharray}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
