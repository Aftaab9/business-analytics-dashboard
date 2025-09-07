// src/components/role-dashboards/sales-manager-dashboard.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { TrendingUp, Target, Users, DollarSign, UserCheck, Tags, Activity } from "lucide-react";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { mockClassificationInsights, mockTeamPerformance, mockQuarterlySalesData } from "@/lib/placeholder-data";
import type { ClassificationInsight } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActionCenter } from "../action-center";


const leadSourceData = [
  { name: 'Organic', conversion: 35 },
  { name: 'Paid Ads', conversion: 25 },
  { name: 'Referrals', conversion: 45 },
  { name: 'Social', conversion: 15 },
];

export function SalesManagerDashboard() {
  // Calculations based on mockTeamPerformance for a more cohesive view
  const totalSales = mockTeamPerformance.reduce((sum, item) => sum + item.sales, 0);
  const totalDeals = mockTeamPerformance.reduce((sum, item) => sum + item.deals, 0);
  const salesTarget = 250000;
  const leadsCount = 375; // Assumed leads for a realistic conversion rate
  const conversionRate = leadsCount > 0 ? (totalDeals / leadsCount) * 100 : 0;
  const avgDealSize = totalDeals > 0 ? totalSales / totalDeals : 0;
  
  const productPurchaseLikelihood = mockClassificationInsights.filter(
    (insight) => insight.type === 'purchaseLikelihood'
  );
  
  const featureImportanceData = productPurchaseLikelihood[0]?.featureContributions || [];
  
  const salesActionItems = productPurchaseLikelihood.slice(0,3).map(insight => ({
      id: insight.itemId,
      type: 'Sales Opportunity',
      title: `Lead: ${insight.customerName || insight.itemId}`,
      description: `High likelihood (${(insight.probability! * 100).toFixed(0)}%) to purchase '${insight.productName}'. Recommend immediate follow-up.`,
      status: 'Action Required',
      priority: 'High' as 'High' | 'Medium' | 'Low',
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-headline font-semibold text-foreground">Sales Manager Dashboard</h2>
          <p className="text-muted-foreground -mt-4">Monitor sales performance, team activity, and customer acquisition.</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard 
              title="Total Sales (This Period)" 
              value={`$${(totalSales / 1000).toFixed(0)}k`} 
              icon={DollarSign} 
              description={`Target: $${(salesTarget / 1000).toFixed(0)}k`}
              trend={`${totalSales >= salesTarget ? '+' : ''}${((totalSales / salesTarget - 1) * 100).toFixed(1)}% to target`}
              trendColor={totalSales >= salesTarget ? "text-green-600" : "text-red-600"}
            />
            <KpiCard 
              title="Conversion Rate" 
              value={`${conversionRate.toFixed(1)}%`} 
              icon={UserCheck} 
              description={`${totalDeals} deals from ${leadsCount} leads`}
              trend="+1.5% vs Last Period"
              trendColor="text-green-600"
            />
            <KpiCard 
              title="Avg. Deal Size" 
              value={`$${(avgDealSize / 1000).toFixed(1)}k`} 
              icon={TrendingUp} 
              description="Based on closed deals"
            />
            <KpiCard 
              title="Active Leads in Pipeline" 
              value={(leadsCount - totalDeals).toString()} 
              icon={Users} 
              description="Awaiting conversion"
            />
          </div>
        </div>
         <div className="lg:col-span-1">
            <ActionCenter 
              title="Opportunity Feed"
              description="AI-generated leads and sales opportunities requiring attention."
              items={salesActionItems}
            />
         </div>
      </div>
      
      <SampleBarChart
          title="Team Performance (Top Reps)"
          description="Sales by individual team members for the period."
          data={mockTeamPerformance.slice(0,5).sort((a,b) => b.sales - a.sales)}
          xAxisKey="name"
          dataKeys={[{ key: 'sales', color: '3', name: 'Sales Value' }]}
          colorEachBar={true}
          hideLegend={true}
        />

      <div className="grid gap-6 md:grid-cols-2">
        <SampleLineChart
          title="Quarterly Sales Performance"
          description="Sales vs. Target over time."
          data={mockQuarterlySalesData}
          xAxisKey="quarter"
          dataKeys={[
            { key: 'sales', color: '1', name: 'Actual Sales' },
            { key: 'target', color: '2', name: 'Sales Target', strokeDasharray: "5 5" },
          ]}
        />
        <SampleBarChart
          title="Lead Source Conversion Rate"
          description="Illustrative effectiveness of different lead channels."
          data={leadSourceData}
          xAxisKey="name"
          dataKeys={[{ key: 'conversion', color: '1', name: 'Conversion Rate' }]}
          colorEachBar={true}
          yAxisFormatter={(value) => `${value}%`}
          tooltipFormatter={(value) => `${value}%`}
          hideLegend={true}
        />
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center"><Tags className="mr-2 h-5 w-5 text-primary"/>AI-Powered Sales Opportunities</CardTitle>
            <CardDescription>AI predictions of which customers are likely to purchase specific products.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Predicted Action</TableHead>
                  <TableHead className="text-right">Likelihood</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPurchaseLikelihood.slice(0, 4).map((insight) => (
                  <TableRow key={insight.itemId}>
                    <TableCell className="font-medium">{insight.customerName || insight.itemId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                          <span className="font-semibold">{insight.productName}</span>
                          <Badge variant={insight.predictedClass === 'Likely to Buy' ? 'default' : 'secondary'} className="w-fit mt-1">
                            {insight.predictedClass}
                          </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">{(insight.probability && (insight.probability * 100).toFixed(0) + '%') || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {productPurchaseLikelihood.length === 0 && <p className="text-muted-foreground mt-4">No product purchase likelihood data available.</p>}
          </div>
            <div>
              <h4 className="text-md font-semibold mb-2 flex items-center"><Activity className="mr-2 h-4 w-4 text-muted-foreground"/>Key Drivers for Prediction</h4>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={featureImportanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="feature" width={100} />
                          <Tooltip cursor={{fill: 'rgba(230, 230, 230, 0.5)'}}/>
                          <Bar dataKey="contribution" fill="hsl(var(--chart-4))" background={{ fill: '#eee' }} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
                <p className="text-xs text-muted-foreground italic mt-2">Visualizing the factors that influence purchase likelihood.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Key Opportunities</CardTitle>
          <CardDescription>High-value deals in the pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">Alpha Corp - Enterprise Deal</span>
                <span className="text-green-600 font-bold">$75,000</span>
              </div>
              <p className="text-sm text-muted-foreground">Stage: Negotiation - Expected Close: Next 2 Weeks</p>
            </li>
            <li className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">Beta Solutions - Expansion</span>
                <span className="text-yellow-600 font-bold">$40,000</span>
              </div>
              <p className="text-sm text-muted-foreground">Stage: Proposal Sent - Follow-up Scheduled</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
