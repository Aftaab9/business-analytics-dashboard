// src/components/kpi-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  className?: string;
  trend?: string; // e.g., "+5% from last month"
  trendColor?: 'text-green-600' | 'text-red-600' | 'text-muted-foreground';
}

export function KpiCard({ title, value, description, icon: Icon, className, trend, trendColor = 'text-muted-foreground' }: KpiCardProps) {
  return (
    <Card 
      className={cn(
        "shadow-lg hover:shadow-xl transition-shadow duration-300", 
        className
      )}
      aria-label={`${title}: ${value}. ${description || ''} ${trend || ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && <p className={`text-xs ${trendColor} pt-1`}>{trend}</p>}
      </CardContent>
    </Card>
  );
}
