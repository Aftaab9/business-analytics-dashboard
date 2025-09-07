// src/components/charts/sample-treemap.tsx
"use client"

import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface TreemapDataPoint {
  name: string;
  value: number;
}

interface SampleTreemapProps {
  data: TreemapDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-2) / 0.7)',
  'hsl(var(--chart-1) / 0.7)',
];

const TreemapContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;
  const color = chartColors[index % chartColors.length];
  const showLabel = width > 80 && height > 40;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: 'hsl(var(--card))',
          strokeWidth: 2,
          fillOpacity: 0.9
        }}
      />
       {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary-foreground text-xs font-medium"
        >
          {name}
        </text>
      )}
    </g>
  );
};


export function SampleTreemap({ data, title, description, className }: SampleTreemapProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="hsl(var(--card))"
            content={<TreemapContent />}
          >
            <Tooltip 
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
              cursor={{fill: 'hsl(var(--accent))', opacity: 0.2}}
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
          </Treemap>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            {data.map((item, index) => (
                <div key={`legend-${item.name}`} className="flex items-center gap-1.5">
                    <span 
                        className="h-3 w-3 rounded-sm" 
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
