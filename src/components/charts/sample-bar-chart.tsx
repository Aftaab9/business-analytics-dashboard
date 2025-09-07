// src/components/charts/sample-bar-chart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SampleBarChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
  title: string;
  description?: string;
  className?: string;
  colorEachBar?: boolean;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  hideLegend?: boolean;
}

export function SampleBarChart({ data, dataKeys, xAxisKey, title, description, className, colorEachBar = false, yAxisFormatter, tooltipFormatter, hideLegend = false }: SampleBarChartProps) {
  const chartConfig = {} as ChartConfig;
  const chartColors = ['1', '2', '3', '4', '5'];

  // Base chart config from dataKeys
  dataKeys.forEach((dk, index) => {
    chartConfig[dk.key] = {
      label: dk.name || dk.key.charAt(0).toUpperCase() + dk.key.slice(1),
      color: `hsl(var(--chart-${dk.color}))`,
    }
  });

  // If coloring each bar, we create a dynamic config for each data point
  if (colorEachBar && data.length > 0 && dataKeys.length === 1) {
    data.forEach((d, index) => {
      const dataPointKey = d[xAxisKey];
      chartConfig[dataPointKey] = {
        label: dataPointKey,
        color: `hsl(var(--chart-${chartColors[index % chartColors.length]}))`
      }
    });
  }
  
  const defaultYAxisFormatter = (tickItem: number) => {
    if (typeof tickItem !== 'number') return tickItem;
    if (tickItem >= 1000000) {
        return `$${(tickItem / 1000000).toFixed(1)}M`;
    }
    if (tickItem >= 1000) {
        return `$${(tickItem / 1000).toFixed(0)}k`;
    }
    return `$${tickItem.toLocaleString()}`;
  };
  
  const defaultTooltipFormatter = (value: number) => {
    return typeof value === 'number' ? value.toLocaleString() : value;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={yAxisFormatter || defaultYAxisFormatter} />
              <ChartTooltip content={<ChartTooltipContent formatter={tooltipFormatter || defaultTooltipFormatter} />} />
              {!hideLegend && <Legend />}
              {dataKeys.map(dk => (
                <Bar key={dk.key} dataKey={dk.key} fill={`var(--color-${dk.key})`} radius={[4, 4, 0, 0]}>
                   {colorEachBar && data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${chartColors[index % chartColors.length]}))`} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
