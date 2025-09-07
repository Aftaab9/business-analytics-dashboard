// src/components/charts/monopoly-chart.tsx
"use client"

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";
import type { MonopolyDataPoint } from "@/types";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{`Quantity: ${label}`}</p>
        {payload.map((p: any) => {
            if (p.dataKey === 'monopolyPrice' || p.dataKey === 'decisionPoint' || p.value == null) return null;
            return (
                 <p key={p.dataKey} style={{ color: p.color }}>
                    {`${p.name}: $${p.value.toFixed(2)}`}
                 </p>
            )
        })}
      </div>
    );
  }
  return null;
};

// Custom shape for the red 'X'
const DecisionPointCross = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  const size = 10;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <line x1={-size/2} y1={-size/2} x2={size/2} y2={size/2} stroke="hsl(var(--destructive))" strokeWidth={3} />
      <line x1={-size/2} y1={size/2} x2={size/2} y2={-size/2} stroke="hsl(var(--destructive))" strokeWidth={3} />
    </g>
  );
};


export function MonopolyChart({ data, className }: MonopolyChartProps) {
    const decisionPoint = useMemo(() => data.find(p => p.decisionPoint != null), [data]);
    const monopolyPricePoint = useMemo(() => data.find(p => p.monopolyPrice != null), [data]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="font-headline">Monopoly: Demand, MR &amp; MC</CardTitle>
                <CardDescription>Profit-Maximizing Output and Price</CardDescription>
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
                            dataKey="quantity"
                            type="number"
                            name="Quantity"
                            domain={[0, 'dataMax']}
                            label={{ value: "Quantity", position: 'insideBottom', dy: 25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            type="number"
                            name="Price/Cost"
                            domain={['dataMin - 20', 'dataMax + 20']}
                            tickCount={7}
                            tickFormatter={(value) => `$${value}`}
                            label={{ value: "Price/Cost ($)", angle: -90, position: 'insideLeft', dx: -15, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" />
                        
                        <Line type="monotone" dataKey="demand" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Demand" dot={false} activeDot={false} connectNulls />
                        <Line type="monotone" dataKey="mr" stroke="hsl(var(--chart-1))" strokeWidth={2} name="MR" dot={false} activeDot={false} strokeDasharray="5 5" connectNulls />
                        <Line type="monotone" dataKey="mc" stroke="hsl(var(--chart-4))" strokeWidth={2} name="MC" dot={false} activeDot={false} connectNulls />
                        
                        {decisionPoint && (
                           <Scatter dataKey="decisionPoint" name="MR = MC" shape={<DecisionPointCross />} zIndex={100} fill="hsl(var(--destructive))" />
                        )}
                        {monopolyPricePoint && (
                            <Scatter dataKey="monopolyPrice" fill="hsl(var(--primary))" name="Monopoly Price" zIndex={100} />
                        )}
                        
                         {decisionPoint && (
                            <ReferenceLine x={decisionPoint.quantity} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                         )}
                         {monopolyPricePoint && (
                            <ReferenceLine y={monopolyPricePoint.monopolyPrice} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                         )}
                         {monopolyPricePoint && decisionPoint?.decisionPoint && (
                            <ReferenceLine segment={[{x: monopolyPricePoint.quantity, y: decisionPoint.decisionPoint}, {x: monopolyPricePoint.quantity, y: monopolyPricePoint.monopolyPrice}]} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                         )}

                    </ComposedChart>
                </ResponsiveContainer>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does this Monopoly graph show?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><b>Demand Curve (Blue):</b> What customers will pay at each quantity.</li>
                                <li><b>MR (Purple):</b> Marginal revenue; <b>MC (Yellow):</b> Marginal cost.</li>
                                <li><b>Red X:</b> Output chosen where MR = MC (the profit-maximizing decision point).</li>
                                <li><b>Purple Dot:</b> Price charged by the monopolist (found on the Demand Curve at the chosen quantity).</li>
                                <li><b>Takeaway:</b> A monopoly restricts quantity and raises price above competitive levels.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
