// src/components/charts/phillips-curve-chart.tsx
"use client"

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PhillipsCurveChartProps {
    data: { unemployment: number; inflation: number; trend: number }[];
    className?: string;
}

const formatAxis = (tickItem: number) => `${tickItem.toFixed(0)}%`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const pointData = payload[0].payload;
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="font-semibold">{`Unemployment: ${pointData.unemployment.toFixed(1)}%`}</p>
        {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value.toFixed(1)}%`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PhillipsCurveChart({ data, className }: PhillipsCurveChartProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="font-headline">Phillips Curve</CardTitle>
                <CardDescription>The relationship between inflation and unemployment.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={data}
                        margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
                    >
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="unemployment"
                            type="number"
                            name="Unemployment"
                            domain={['dataMin - 1', 'dataMax + 1']}
                            tickFormatter={formatAxis}
                            label={{ value: "Unemployment %", position: 'insideBottom', dy: 25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            yAxisId="left"
                            type="number"
                            name="Inflation"
                            domain={[0, 'dataMax + 2']}
                            tickFormatter={formatAxis}
                            label={{ value: "Inflation %", angle: -90, position: 'insideLeft', dx: -15, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Legend verticalAlign="top" align="right" />
                        
                        <Scatter yAxisId="left" name="Data" dataKey="inflation" fill="hsl(var(--chart-1))" />
                        
                        <Line 
                            yAxisId="left"
                            dataKey="trend" 
                            type="monotone"
                            stroke="hsl(var(--chart-4))" 
                            strokeWidth={2} 
                            name="Trend" 
                            dot={false} 
                            activeDot={false}
                            strokeDasharray="5 5"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does the Phillips Curve show?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><b>Phillips Curve:</b> The (usually) inverse relationship between inflation and unemployment.</li>
                                <li><b>Dots:</b> Real data for different times/countries.</li>
                                <li><b>Yellow Line:</b> The trend—typically, lower unemployment means higher inflation.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
