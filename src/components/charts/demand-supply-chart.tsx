// src/components/charts/demand-supply-chart.tsx
"use client"

import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMemo } from "react";

interface DemandSupplyChartProps {
    data: { quantity: number; demand: number; supply: number; equilibrium?: number | null }[];
    className?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
}

const formatXAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
        return `${Math.round(tickItem / 1000)}k`;
    }
    return tickItem;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{`Quantity: ${label}`}</p>
        {payload.map((p: any) => {
            if (p.dataKey === 'equilibrium') return null;
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


export function DemandSupplyChart({ data, className, xAxisLabel="Quantity", yAxisLabel="Price" }: DemandSupplyChartProps) {
    const equilibriumPoint = useMemo(() => data.find(p => p.equilibrium != null), [data]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="font-headline">Demand & Supply Model</CardTitle>
                <CardDescription>Visualizing the relationship between product demand and supply.</CardDescription>
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
                            name={xAxisLabel}
                            domain={['dataMin - 50', 'dataMax + 50']}
                            tickFormatter={formatXAxis}
                            label={{ value: xAxisLabel, position: 'insideBottom', dy: 25, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            type="number"
                            name={yAxisLabel}
                            domain={[0, 'dataMax + 20']}
                            tickFormatter={(value) => `$${value}`}
                            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', dx: -15, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" />
                        <Line type="monotone" dataKey="demand" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Demand" dot={false} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="supply" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Supply" dot={false} activeDot={{r: 6}}/>
                        
                        {equilibriumPoint && (
                            <Scatter dataKey="equilibrium" fill="hsl(var(--chart-4))" name="Equilibrium" />
                        )}
                        
                        {equilibriumPoint && (
                            <ReferenceLine
                                x={equilibriumPoint.quantity}
                                stroke="hsl(var(--chart-4))"
                                strokeDasharray="3 3"
                            />
                        )}
                         {equilibriumPoint && equilibriumPoint.equilibrium && (
                            <ReferenceLine
                                y={equilibriumPoint.equilibrium}
                                stroke="hsl(var(--chart-4))"
                                strokeDasharray="3 3"
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does this Demand & Supply Model show?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><b>Demand Curve:</b> Shows how much consumers are willing to buy at different prices (downward sloping).</li>
                                <li><b>Supply Curve:</b> Shows how much producers are willing to sell at different prices (upward sloping).</li>
                                <li><b>Equilibrium Point (Yellow Dot):</b> The market clearing price where the quantity demanded equals the quantity supplied.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
