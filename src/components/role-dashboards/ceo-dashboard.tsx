// src/components/role-dashboards/ceo-dashboard.tsx
"use client";

import { useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SamplePieChart } from "@/components/charts/sample-pie-chart";
import { SampleScatterChart } from "@/components/charts/sample-scatter-chart";
import { mockFinancialData, mockClassificationInsights, mockCustomerClusters, mockStrategicInitiativesData, getCountryMetricsData, mockInventory, mockTeamPerformance } from "@/lib/placeholder-data";
import type { ClassificationInsight, CustomerCluster } from "@/types";
import { DollarSign, TrendingUp, Users, Zap, Target, ShieldAlert, BarChartBig, TrendingDown, UserCog, UsersRound, CheckCircle, Activity, LineChart as LineChartIcon, Award, Gem, Ratio, BrainCircuit, Loader2, AlertCircle as AlertCircleIcon, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActionCenter } from "../action-center";
import { askBusinessQuestion, type AskBusinessQuestionOutput } from "@/ai/flows/ask-business-question-flow";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SampleTreemap } from "../charts/sample-treemap";

export function CeoDashboard() {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState<AskBusinessQuestionOutput | null>(null);
  const [askError, setAskError] = useState<string | null>(null);


  const handleAskQuestion = async () => {
    if (!question) return;
    setIsAsking(true);
    setAskError(null);
    setAiResponse(null);

    try {
      const result = await askBusinessQuestion({ question });
      setAiResponse(result);
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setAskError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Getting Answer",
        description: errorMessage,
      });
    } finally {
      setIsAsking(false);
    }
  };

  const totalRevenue = mockFinancialData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = mockFinancialData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = mockFinancialData.reduce((sum, item) => sum + item.profit, 0);
  const countryData = getCountryMetricsData(true); // Get top 5 countries for bar chart

  const marketShareData = [
    { name: 'InsightFlow', value: 35 },
    { name: 'StyleSphere', value: 25 },
    { name: 'ModaMe', value: 20 },
    { name: 'Others', value: 20 },
  ];

  const customerSegmentationInsights = mockClassificationInsights.filter(
    (insight) => insight.type === 'customerSegmentation'
  );
  
  const featureImportanceData = customerSegmentationInsights[0]?.featureContributions || [];

  const customerSegmentDistributionData = [
    { name: 'High-Value', value: 25 },
    { name: 'Loyal Champions', value: 20 },
    { name: 'Occasional Buyer', value: 35 },
    { name: 'At Risk', value: 10 },
    { name: 'Newcomers', value: 10 },
  ];

  const marketSentimentData = [
    { name: 'Positive', value: 75, fill: 'var(--chart-1)' },
    { name: 'Neutral', value: 15, fill: 'var(--chart-2)' },
    { name: 'Negative', value: 10, fill: 'var(--chart-3)' },
  ];

  const financialDataWithMovingAverage = mockFinancialData.map((item, index, arr) => {
    if (index < 2) {
      return { ...item, movingAverage: null }; // Not enough data for a 3-month MA
    }
    const sum = arr[index].revenue + arr[index - 1].revenue + arr[index - 2].revenue;
    const movingAverage = sum / 3;
    return { ...item, movingAverage };
  });

  const ceoActionItems = [
    { id: 'risk-1', type: 'High Risk', title: 'Supply Chain Disruption', description: 'Mitigation plan for key component supplier is behind schedule. Immediate review required.', status: 'Action Required', priority: 'High' as 'High' | 'Medium' | 'Low' },
    { id: 'goal-1', type: 'Strategic Goal', title: 'Increase Customer Retention by 15%', description: 'Progress is at 40%, currently behind Q3 target. Marketing and Sales alignment needed.', status: 'Needs Attention', priority: 'Medium' as 'High' | 'Medium' | 'Low'},
    { id: 'sentiment-1', type: 'Market Sentiment', title: 'Negative chatter on social media rising', description: 'Recent product update has sparked negative feedback regarding new UI changes.', status: 'Monitor', priority: 'Low' as 'High' | 'Medium' | 'Low' },
  ];
  
  const inventoryTreemapData = mockInventory.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    const existing = acc.find(c => c.name === category);
    const itemValue = item.stock * item.price;
    if (existing) {
      existing.value += itemValue;
    } else {
      acc.push({ name: category, value: parseFloat(itemValue.toFixed(2)) });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const renderSuggestedChart = () => {
    if (!aiResponse || !aiResponse.suggestedChart || aiResponse.suggestedChart === 'None') return null;

    switch (aiResponse.suggestedChart) {
        case 'RevenueProfitTrend':
            return <SampleLineChart title="Revenue & Profit Trend" description="AI-suggested chart based on your question." data={mockFinancialData} xAxisKey="month" dataKeys={[{ key: 'revenue', color: '1', name: 'Revenue' }, { key: 'profit', color: '2', name: 'Profit' }]} />;
        case 'TeamPerformance':
            return <SampleBarChart title="Team Performance" description="AI-suggested chart based on your question." data={mockTeamPerformance} xAxisKey="name" dataKeys={[{ key: 'sales', color: '3', name: 'Sales' }]} colorEachBar={true} />;
        case 'StockValueByCategory':
            return <SampleTreemap title="Stock Value by Category" description="AI-suggested chart based on your question." data={inventoryTreemapData} />;
        default:
            return null;
    }
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-headline font-semibold text-foreground">CEO Dashboard</h2>
          <p className="text-muted-foreground -mt-4">High-level overview of company performance and strategic goals.</p>
        </div>
        <div className="lg:col-span-1 lg:row-span-3">
           <ActionCenter 
              title="Action & Insight Hub"
              description="Prioritized alerts and insights requiring your attention."
              items={ceoActionItems}
            />
        </div>
        <div className="lg:col-span-2 space-y-6">

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Dialog>
              <DialogTrigger asChild>
                <KpiCard 
                  title="Total Revenue" 
                  value={`$${(totalRevenue / 1000000).toFixed(1)}M`} 
                  icon={DollarSign} 
                  description="Year to Date" 
                  trend="+15% vs LY" 
                  trendColor="text-green-600"
                  className="cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Total Revenue Details</DialogTitle>
                  <DialogDescription>
                    A detailed look at monthly revenue trends over the past year.
                  </DialogDescription>
                </DialogHeader>
                <SampleLineChart
                  title=""
                  description=""
                  data={mockFinancialData}
                  xAxisKey="month"
                  xAxisLabel="Month"
                  yAxisLabel="Revenue"
                  dataKeys={[{ key: 'revenue', color: '1', name: 'Revenue' }]}
                  className="mt-4"
                />
              </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                  <KpiCard 
                    title="Total Expenses" 
                    value={`$${(totalExpenses / 1000000).toFixed(1)}M`} 
                    icon={TrendingDown} 
                    description="Year to Date" 
                    trend="-5% vs LY"
                    trendColor="text-green-600"
                    className="cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Total Expenses Details</DialogTitle>
                    <DialogDescription>
                      A detailed look at monthly expense trends over the past year.
                    </DialogDescription>
                  </DialogHeader>
                  <SampleLineChart
                    title=""
                    description=""
                    data={mockFinancialData}
                    xAxisKey="month"
                    xAxisLabel="Month"
                    yAxisLabel="Expenses"
                    dataKeys={[{ key: 'expenses', color: '5', name: 'Expenses' }]}
                    className="mt-4"
                  />
                </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <KpiCard 
                  title="Net Profit Margin" 
                  value={`${((totalProfit / totalRevenue) * 100).toFixed(1)}%`} 
                  icon={TrendingUp} 
                  description="Healthy Growth" 
                  trend="+2.5% vs LY" 
                  trendColor="text-green-600"
                  className="cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Profitability Details</DialogTitle>
                  <DialogDescription>
                    A detailed look at monthly profit over the past year.
                  </DialogDescription>
                </DialogHeader>
                <SampleBarChart
                    title=""
                    description=""
                    data={mockFinancialData}
                    xAxisKey="month"
                    dataKeys={[{ key: 'profit', color: '2', name: 'Profit' }]}
                    className="mt-4"
                    colorEachBar={true}
                />
              </DialogContent>
            </Dialog>

            <KpiCard title="New Customers" value="12,850" icon={Users} description="This Quarter" trend="+8% vs LQ" trendColor="text-green-600"/>
            <KpiCard title="Customer Lifetime Value (LTV)" value="$850" icon={Gem} description="Average per customer" trend="+12% vs LY" trendColor="text-green-600" />
            <KpiCard title="Customer Acquisition Cost (CAC)" value="$120" icon={Ratio} description="Average per customer" trend="-8% vs LY" trendColor="text-green-600" />
            <KpiCard title="Innovation Index" value="7.8/10" icon={Zap} description="R&D Pipeline Strength" trend="Stable" />
          </div>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary"/>Ask InsightFlow a Question</CardTitle>
                  <CardDescription>Use natural language to get instant answers about your business data.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex gap-2">
                      <Input
                          placeholder="e.g., What was our best sales month? Who is the top performer?"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                          disabled={isAsking}
                      />
                      <Button onClick={handleAskQuestion} disabled={isAsking || !question}>
                          {isAsking ? <Loader2 className="animate-spin" /> : "Ask"}
                      </Button>
                  </div>
              </CardContent>
              {isAsking && (
                  <CardFooter>
                      <div className="flex items-center gap-2 text-muted-foreground w-full">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <p>AI is thinking...</p>
                      </div>
                  </CardFooter>
              )}
              {askError && (
                  <CardFooter>
                      <Alert variant="destructive">
                          <AlertCircleIcon className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{askError}</AlertDescription>
                      </Alert>
                  </CardFooter>
              )}
              {aiResponse && (
                  <CardFooter className="flex-col items-start gap-4">
                      <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-md w-full">
                          <h4 className="font-semibold text-primary flex items-center gap-2"><FileText/> AI Answer</h4>
                          <p className="text-foreground mt-2">{aiResponse.answerText}</p>
                          {aiResponse.keyDataPoints && aiResponse.keyDataPoints.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                              {aiResponse.keyDataPoints.map(dp => (
                                <div key={dp.label} className="flex justify-between p-2 bg-background/50 rounded">
                                  <span className="font-medium text-muted-foreground">{dp.label}:</span>
                                  <span className="font-bold text-foreground">{dp.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <div className="w-full">
                        {renderSuggestedChart()}
                      </div>
                  </CardFooter>
              )}
          </Card>


          <div className="grid gap-6 md:grid-cols-2">
            <SampleLineChart
              title="Overall Financial Health"
              description="Monthly revenue and profit trends."
              data={mockFinancialData}
              xAxisKey="month"
              xAxisLabel="Month"
              yAxisLabel="Amount ($)"
              dataKeys={[
                { key: 'revenue', color: '1', name: 'Revenue' },
                { key: 'profit', color: '2', name: 'Profit' },
              ]}
            />
            <SamplePieChart
              title="Market Share"
              description="Current market position against competitors."
              data={marketShareData}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SampleBarChart
                title="Top 5 Countries by Revenue"
                description="Comparing total revenue from leading international markets."
                data={countryData.data}
                xAxisKey="country"
                dataKeys={[{ key: 'totalRevenue', color: '1', name: 'Revenue' }]}
                colorEachBar={true}
                hideLegend={true}
              />
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><LineChartIcon className="mr-2 h-5 w-5 text-primary"/>Monthly Revenue with 3-Month Moving Average</CardTitle>
                    <CardDescription>Smoothed revenue trend to identify long-term direction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SampleLineChart
                        data={financialDataWithMovingAverage}
                        xAxisKey="month"
                        dataKeys={[
                            { key: 'revenue', name: 'Actual Revenue', color: '1' },
                            { key: 'movingAverage', name: '3-Month MA', color: '4', strokeDasharray: "5 5" },
                        ]}
                        title=""
                    />
                </CardContent>
              </Card>
          </div>

          <SampleBarChart
              title="Strategic Initiative Performance"
              description="Impact of key initiatives on performance metrics (Illustrative)."
              data={mockStrategicInitiativesData}
              xAxisKey="month"
              dataKeys={[
                { key: 'initiativeA', color: '4', name: 'Initiative Alpha' },
                { key: 'initiativeB', color: '5', name: 'Initiative Beta' },
              ]}
            />
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />Strategic Goals Progress</CardTitle>
              <CardDescription>Tracking key strategic initiatives for the year.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                        <h4 className="font-semibold">Expand to New EMEA Market</h4>
                        <p className="text-sm text-muted-foreground">Target: Q4 Launch</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-green-600">On Track (65%)</p>
                        <progress value="65" max="100" className="w-24 h-2 rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-green-500"></progress>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                        <h4 className="font-semibold">Increase Customer Retention by 15%</h4>
                        <p className="text-sm text-muted-foreground">Target: Year End</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-yellow-500">Needs Attention (40%)</p>
                        <progress value="40" max="100" className="w-24 h-2 rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-yellow-400"></progress>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><UserCog className="mr-2 h-5 w-5 text-primary"/>Customer Segmentation Insights</CardTitle>
                <CardDescription>AI-driven customer segments and their characteristics.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Customer ID</TableHead>
                                <TableHead>Segment</TableHead>
                                <TableHead className="text-right">Confidence</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {customerSegmentationInsights.slice(0, 5).map((insight) => (
                                <TableRow key={insight.itemId}>
                                <TableCell className="font-medium">{insight.itemId}</TableCell>
                                <TableCell>
                                    <Badge variant={insight.predictedClass === 'High-Value' ? 'default' : 'secondary'}>
                                    {insight.predictedClass}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{(insight.probability && (insight.probability * 100).toFixed(0) + '%') || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {customerSegmentationInsights.length === 0 && <p className="text-muted-foreground mt-4">No customer segmentation data available.</p>}
                    </div>
                    <div>
                        <h4 className="text-md font-semibold mb-2 flex items-center"><Activity className="mr-2 h-4 w-4 text-muted-foreground"/>Feature Importance</h4>
                        <div className="w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={featureImportanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="feature" width={120} />
                                    <Tooltip cursor={{fill: 'rgba(230, 230, 230, 0.5)'}}/>
                                    <Bar dataKey="contribution" fill="hsl(var(--chart-2))" background={{ fill: '#eee' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-muted-foreground italic mt-2">Key drivers for customer segmentation.</p>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-muted-foreground"/>Model Performance (Illustrative)</h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Classification Accuracy: 92%</Badge>
                        <Badge variant="outline">F1-Score (Weighted): 0.88</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-2">Feature contributions (SHAP values) could be shown here or in a drill-down.</p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><UsersRound className="mr-2 h-5 w-5 text-primary"/>Customer Persona Clusters</CardTitle>
                <CardDescription>Identified customer personas based on behavior and demographics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <SampleScatterChart
                  title="Customer Cluster Visualization"
                  description="Visual separation of customer groups based on key behaviors."
                  data={mockCustomerClusters}
                  className="bg-muted/30 border-0 shadow-none"
                />
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Persona</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCustomerClusters.slice(0, 5).map((cluster: CustomerCluster) => (
                        <TableRow key={cluster.customerID}>
                          <TableCell className="font-medium">{cluster.customerID}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{cluster.clusterLabel || `Cluster ${cluster.clusterId}`}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {mockCustomerClusters.length === 0 && <p className="text-muted-foreground mt-4">No customer persona data available.</p>}
                </div>
              </div>
              <Separator className="my-6"/>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What does this Cluster chart show?</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <strong>What are Principal Components?</strong> To visualize complex customer data (with many attributes like spending, frequency, etc.) on a 2D chart, we use a technique called Principal Component Analysis (PCA). It condenses many variables into two main "components".
                                </li>
                                <li>
                                    <strong>Principal Component 1 (Horizontal Axis):</strong> Represents the largest source of variation in the data. This could be interpreted as an "Overall Customer Value" score, combining high spending with high purchase frequency.
                                </li>
                                <li>
                                    <strong>Principal Component 2 (Vertical Axis):</strong> Represents the second largest source of variation. This might capture a different dimension like "Shopping Style" (e.g., bargain hunter vs. premium product buyer).
                                </li>
                                <li>
                                    <strong>The Goal:</strong> This chart plots customers based on these two combined scores. Customers who are similar to each other naturally form the visible clusters or "personas".
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Clustering Quality (Illustrative)</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">Silhouette Score: 0.65</Badge>
                                <Badge variant="outline">Davies-Bouldin Index: 0.82</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground italic mt-2">These metrics measure how well-separated and compact the clusters are. A higher Silhouette Score and lower Davies-Bouldin Index generally indicate better clustering.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardHeader>
                  <CardTitle className="font-headline flex items-center"><BarChartBig className="mr-2 h-5 w-5 text-primary" />Market Sentiment Analysis (Illustrative)</CardTitle>
                  <CardDescription>Simulated classification of market sentiment based on news and social media.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                <SampleBarChart
                  title="Sentiment Breakdown"
                  description="Current market sentiment distribution."
                  data={marketSentimentData}
                  xAxisKey="name"
                  dataKeys={[{ key: 'value', color: '1', name: 'Mentions (%)' }]}
                  colorEachBar={true}
                  yAxisFormatter={(value) => `${value}%`}
                  tooltipFormatter={(value) => `${value}%`}
                />
                <div className="space-y-3">
                    <p className="text-lg font-semibold">Overall Sentiment: <span className="text-green-600">Positive</span></p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Positive mentions: 75% (Up 5% from last period)</li>
                        <li>Neutral mentions: 15% (Stable)</li>
                        <li>Negative mentions: 10% (Down 3% from last period)</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                  <Separator className="my-4" />
                  <h4 className="text-md font-semibold mb-2 flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-muted-foreground"/>Model Performance (Illustrative)</h4>
                  <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Overall Sentiment Accuracy: 85%</Badge>
                      <Badge variant="outline">Precision (Positive): 0.90</Badge>
                      <Badge variant="outline">Recall (Negative): 0.75</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2">Note: This represents a potential output of a classification model analyzing market text data.</p>
                </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
