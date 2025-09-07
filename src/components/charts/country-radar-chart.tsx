// src/components/charts/country-radar-chart.tsx
"use client"

import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CountryRadarChartProps {
  data: any[];
  countries: { name: string; color: string }[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {`${p.name}: ${(p.value * 100).toFixed(0)}% of max`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CountryRadarChart({ data, countries, className }: CountryRadarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-headline">Top 5 Country Sales Metrics</CardTitle>
        <CardDescription>
          A normalized comparison of key sales metrics across the top-performing countries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {countries.map(country => (
              <Radar 
                key={country.name} 
                name={country.name} 
                dataKey={country.name} 
                stroke={country.color} 
                fill={country.color} 
                fillOpacity={0.6} 
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>How to read this Radar Chart?</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>This chart compares the top 5 countries across several key performance indicators (KPIs).</li>
                <li>Each axis represents a different metric (e.g., Total Revenue, Order Count).</li>
                <li>For each metric, the country with the highest value is set as the 100% mark (the outermost edge). All other countries are scored relative to that leader.</li>
                <li>A larger, more expansive shape indicates stronger overall performance across all metrics.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
