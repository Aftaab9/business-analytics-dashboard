// src/components/role-dashboards/cmo-dashboard.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { Target, BarChart, DollarSign, Users, LineChart, Activity, BadgePercent } from "lucide-react";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { mockCampaignData, mockClassificationInsights, mockSentimentData } from "@/lib/placeholder-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart as RechartsBarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActionCenter } from "../action-center";

export function CmoDashboard() {
  const totalSpend = mockCampaignData.reduce((sum, item) => sum + item.spend, 0);
  const totalConversions = mockCampaignData.reduce((sum, item) => sum + item.conversions, 0);
  const overallRoas = 3.8; // Mocked overall
  const cac = totalConversions > 0 ? totalSpend / totalConversions : 0;

  const leadConversionData = mockClassificationInsights.filter(
    (insight) => insight.type === 'leadConversion'
  );
  
  const featureImportanceData = leadConversionData[0]?.featureContributions || [];
  
  const cmoActionItems = [
    ...leadConversionData.filter(i => i.predictedClass === 'High-Value Lead').slice(0, 2).map(insight => ({
        id: insight.itemId,
        type: 'Lead Conversion',
        title: `High-Value Lead: ${insight.customerName || insight.itemId}`,
        description: `This lead has a high probability (${(insight.probability! * 100).toFixed(0)}%) of converting. Recommend fast-tracking to sales team.`,
        status: 'Action Required',
        priority: 'High' as 'High' | 'Medium' | 'Low',
    })),
    {
      id: 'sentiment-1',
      type: 'Brand Sentiment',
      title: 'Negative Sentiment Detected',
      description: `Spike in negative sentiment related to "shipping times". Recommend coordinating with operations and customer support.`,
      status: 'Needs Attention',
      priority: 'Medium' as 'High' | 'Medium' | 'Low',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-headline font-semibold text-foreground">CMO Dashboard</h2>
            <p className="text-muted-foreground -mt-4">Monitor campaign performance, brand health, and customer acquisition funnels.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard 
                title="Total Marketing Spend" 
                value={`$${(totalSpend / 1000).toFixed(0)}k`} 
                icon={DollarSign} 
                description="YTD"
                />
                <KpiCard 
                title="Overall ROAS" 
                value={`${overallRoas}x`} 
                icon={BarChart} 
                description="Return on Ad Spend"
                trend="+0.5 vs Last Quarter"
                trendColor="text-green-600"
                />
                <KpiCard 
                title="Total Conversions" 
                value={totalConversions.toLocaleString()} 
                icon={Users} 
                description="From all campaigns"
                />
                 <KpiCard 
                title="Customer Acquisition Cost (CAC)" 
                value={`$${cac.toFixed(2)}`} 
                icon={BadgePercent} 
                description="Average per new customer"
                trend="-10% vs Last Quarter"
                trendColor="text-green-600"
                />
            </div>
        </div>
        <div className="lg:col-span-1">
           <ActionCenter 
              title="Marketing Action Hub"
              description="Prioritized leads and alerts for the marketing team."
              items={cmoActionItems}
            />
        </div>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Campaign Performance
            </CardTitle>
            <CardDescription>
              Overview of key marketing campaigns and their return on ad spend (ROAS).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaignData.map(campaign => (
                  <TableRow key={campaign.id} className={campaign.status === 'Over Budget' ? 'bg-destructive/10' : ''}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className={`font-semibold ${campaign.roas > 4 ? 'text-green-600' : 'text-foreground'}`}>{campaign.roas}x</TableCell>
                    <TableCell>${campaign.spend.toLocaleString()}</TableCell>
                    <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <SampleBarChart
          title="Return on Ad Spend (ROAS) by Campaign"
          description="Comparing the effectiveness of each marketing campaign."
          data={mockCampaignData.filter(c => c.status !== 'Active')}
          xAxisKey="name"
          dataKeys={[{ key: 'roas', color: '1', name: 'ROAS' }]}
          colorEachBar={true}
          yAxisFormatter={(value) => `${value}x`}
        />
        <SampleBarChart
          title="Brand Sentiment Analysis"
          description="Public perception based on social media and news (Illustrative)."
          data={mockSentimentData}
          xAxisKey="name"
          dataKeys={[{ key: 'value', color: '1', name: 'Mentions (%)' }]}
          colorEachBar={true}
          yAxisFormatter={(value) => `${value}%`}
          tooltipFormatter={(value) => `${value}%`}
          hideLegend={true}
        />
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>AI-Powered Lead Scoring</CardTitle>
            <CardDescription>AI predictions on which leads are most likely to convert to customers.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Predicted Status</TableHead>
                  <TableHead className="text-right">Conversion Probability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadConversionData.map((insight) => (
                  <TableRow key={insight.itemId}>
                    <TableCell className="font-medium">{insight.customerName || insight.itemId}</TableCell>
                    <TableCell>
                        <Badge variant={insight.predictedClass === 'High-Value Lead' ? 'default' : 'secondary'}>
                        {insight.predictedClass}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">{(insight.probability && (insight.probability * 100).toFixed(0) + '%') || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {leadConversionData.length === 0 && <p className="text-muted-foreground mt-4">No lead conversion data available.</p>}
          </div>
            <div>
              <h4 className="text-md font-semibold mb-2 flex items-center"><Activity className="mr-2 h-4 w-4 text-muted-foreground"/>Key Drivers for Conversion</h4>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart layout="vertical" data={featureImportanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="feature" width={120} />
                          <Tooltip cursor={{fill: 'rgba(230, 230, 230, 0.5)'}}/>
                          <RechartsBar dataKey="contribution" fill="hsl(var(--chart-4))" background={{ fill: '#eee' }} />
                      </RechartsBarChart>
                  </ResponsiveContainer>
              </div>
                <p className="text-xs text-muted-foreground italic mt-2">Visualizing the factors that influence conversion probability.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
