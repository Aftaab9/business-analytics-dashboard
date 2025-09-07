// src/components/charts/forecasting-methods-chart.tsx
"use client"

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ForecastingMethodsDataPoint } from "@/types";
import { cn } from "@/lib/utils";

interface ForecastingMethodsChartProps {
    data: ForecastingMethodsDataPoint[];
    className?: string;
}

const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000) {
        return `$${(tickItem / 1000000).toFixed(1)}M`;
    }
    if (tickItem >= 1000) {
        return `$${Math.round(tickItem / 1000)}k`;
    }
    return `$${tickItem}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{label}</p>
        {payload.map((p: any) => {
            if (p.value == null || p.dataKey === 'forecastPoint') return null;
            return (
                 <p key={p.dataKey} style={{ color: p.color }}>
                    {`${p.name}: ${formatYAxis(p.value)}`}
                 </p>
            )
        })}
      </div>
    );
  }
  return null;
};

// Custom shape for the star
const Star = (props: any) => {
  const { cx, cy, fill } = props;
  if (cx == null || cy == null) return null;
  const points = "10,1 4,18 19,6 1,6 16,18";
  return (
     <svg x={cx - 10} y={cy - 10} width="20" height="20" viewBox="0 0 20 20" fill={fill} stroke={fill}>
      <polygon points={points} />
    </svg>
  );
};


export function ForecastingMethodsChart({ data, className }: ForecastingMethodsChartProps) {
    return (
        <Card className={cn("shadow-lg", className)}>
            <CardHeader>
                <CardTitle className="font-headline">Forecasting Demand: MA vs. EWMA vs. Regression</CardTitle>
                <CardDescription>Comparing different forecasting methods against actual revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            bottom: 30,
                            left: 40,
                        }}
                    >
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            name="Month"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            tickFormatter={formatYAxis}
                            label={{ value: "Demand / Revenue ($)", angle: -90, position: 'insideLeft', dx: -25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Actual" dot={{r: 4}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="ma" stroke="hsl(var(--chart-2))" strokeWidth={2} name="MA (3-month)" strokeDasharray="5 5" dot={false} activeDot={false} connectNulls />
                        <Line type="monotone" dataKey="ewma" stroke="hsl(var(--chart-3))" strokeWidth={2} name="EWMA (α=0.3)" strokeDasharray="2 8" dot={false} activeDot={false} connectNulls />
                        <Line type="monotone" dataKey="regression" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Regression Forecast" dot={false} activeDot={false} />
                        
                        <Scatter dataKey="forecastPoint" fill="hsl(var(--chart-4))" name="Forecast Points" shape={<Star />} zIndex={100} />
                    </ComposedChart>
                </ResponsiveContainer>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What do these forecasting methods mean?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                <li><b>Moving Average (MA):</b> Smooths out short-term ups and downs, making it easier to spot the overall trend. It's great for seeing the big picture, but it reacts slowly to sudden changes.</li>
                                <li><b>EWMA (Exponentially Weighted Moving Average):</b> Like MA, but it reacts more quickly if something changes in the most recent months by giving more weight to recent data.</li>
                                <li><b>Regression:</b> Draws the best-fit straight line through all the historical data points and projects this trend into the future.</li>
                                <li><b>On the graph:</b> The green stars on the right show the regression forecast for the next three months.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
