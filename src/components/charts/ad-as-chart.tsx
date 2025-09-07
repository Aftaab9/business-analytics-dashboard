// src/components/charts/ad-as-chart.tsx
"use client"

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";

interface AdAsChartProps {
    data: { output: number; ad: number; sras: number; equilibrium?: number | null }[];
    className?: string;
}

const formatXAxis = (tickItem: number) => {
    if (tickItem >= 1000000) {
        return `${(tickItem / 1000000).toFixed(1)}M`;
    }
    if (tickItem >= 1000) {
        return `${Math.round(tickItem / 1000)}k`;
    }
    return tickItem;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{`Output: ${formatXAxis(label)}`}</p>
        {payload.map((p: any) => {
            if (p.dataKey === 'equilibrium') return null;
            return (
                 <p key={p.dataKey} style={{ color: p.color }}>
                    {`${p.name}: ${p.value.toFixed(1)}`}
                 </p>
            )
        })}
      </div>
    );
  }
  return null;
};


export function AdAsChart({ data, className }: AdAsChartProps) {
    const equilibriumPoint = useMemo(() => data.find(p => p.equilibrium != null), [data]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="font-headline">Short-Run AD & SRAS</CardTitle>
                <CardDescription>Aggregate Demand and Supply Economic Model</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            bottom: 30,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="output"
                            type="number"
                            name="Output (Revenue)"
                            domain={['dataMin - 50000', 'dataMax + 50000']}
                            tickFormatter={formatXAxis}
                            label={{ value: "Output (Revenue)", position: 'insideBottom', dy: 25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            type="number"
                            name="Price Level (CPI)"
                            domain={[0, 'dataMax + 20']}
                            label={{ value: "Price Level (CPI)", angle: -90, position: 'insideLeft', dx: -15, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" />
                        <Line type="monotone" dataKey="ad" stroke="hsl(var(--chart-2))" strokeWidth={2} name="AD" dot={false} activeDot={false} />
                        <Line type="monotone" dataKey="sras" stroke="hsl(var(--chart-5))" strokeWidth={2} name="SRAS" dot={false} activeDot={false} />
                        <Scatter dataKey="equilibrium" fill="hsl(var(--chart-4))" name="Equilibrium" />
                        
                        {equilibriumPoint && (
                            <ReferenceLine
                                x={equilibriumPoint.output}
                                stroke="hsl(var(--chart-4))"
                                strokeDasharray="5 5"
                                strokeWidth={1.5}
                            />
                        )}
                         {equilibriumPoint && equilibriumPoint.equilibrium && (
                            <ReferenceLine
                                y={equilibriumPoint.equilibrium}
                                stroke="hsl(var(--chart-4))"
                                strokeDasharray="5 5"
                                strokeWidth={1.5}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does this AD-AS Model show?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><b>Aggregate Demand (AD):</b> Total spending in the economy at different price levels.</li>
                                <li><b>SRAS:</b> What firms will produce at different prices in the short run.</li>
                                <li><b>Yellow Dot:</b> The equilibrium output and price level, where AD equals SRAS.</li>
                                <li><b>Use:</b> Helps explain inflation, unemployment, and economic growth dynamics.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
