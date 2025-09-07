// src/components/role-dashboards/cfo-dashboard.tsx
"use client";

import { useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SamplePieChart } from "@/components/charts/sample-pie-chart";
import { mockFinancialData, mockExpenseTransactions, mockForecastingData } from "@/lib/placeholder-data";
import { detectExpenseAnomalies, type DetectExpenseAnomaliesOutput } from "@/ai/flows/detect-expense-anomalies";
import { DollarSign, TrendingDown, Banknote, Percent, Scale, LineChart as LineChartIcon, BarChartBig, ShieldCheck, CheckCircle, BrainCircuit, Loader2, AlertCircle, Ratio } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ForecastingMethodsChart } from "../charts/forecasting-methods-chart";
import { ActionCenter } from "../action-center";

type Anomaly = DetectExpenseAnomaliesOutput['anomalies'][0];

export function CfoDashboard() {
  const { toast } = useToast();
  const [anomalies, setAnomalies] = useState<Anomaly[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleAnomalyScan = async () => {
    setIsScanning(true);
    setScanError(null);
    setAnomalies(null);

    try {
      const result = await detectExpenseAnomalies({ transactions: mockExpenseTransactions });
      setAnomalies(result.anomalies);
      toast({
        title: "Scan Complete",
        description: `Found ${result.anomalies.length} potential ${result.anomalies.length === 1 ? 'anomaly' : 'anomalies'}.`,
      });
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during the scan.";
      setScanError(errorMessage);
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: errorMessage,
      });
    } finally {
      setIsScanning(false);
    }
  };


  const totalRevenue = mockFinancialData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = mockFinancialData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  const expenseBreakdownData = [
    { name: 'Salaries', value: 45 },
    { name: 'Marketing', value: 20 },
    { name: 'Operations', value: 15 },
    { name: 'R&D', value: 10 },
    { name: 'Other', value: 10 },
  ];

  const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const cfoActionItems = anomalies?.filter(a => a.severity === 'High').map(anomaly => {
     const transaction = mockExpenseTransactions.find(t => t.id === anomaly.transactionId);
     return {
        id: anomaly.transactionId,
        type: 'Expense Anomaly',
        title: `High risk transaction: ${transaction?.vendor} ($${transaction?.amount})`,
        description: `AI Reason: ${anomaly.reason}`,
        status: 'Action Required',
        priority: 'High' as 'High' | 'Medium' | 'Low',
     }
  }) || [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-3xl font-headline font-semibold text-foreground">CFO Dashboard</h2>
            <p className="text-muted-foreground -mt-4">Detailed financial performance, profitability analysis, and forecasting insights.</p>
        </div>
        <div className="lg:col-span-1 lg:row-span-3">
           <ActionCenter 
              title="Action & Insight Hub"
              description="Prioritized alerts and financial insights."
              items={cfoActionItems}
              emptyStateMessage={anomalies ? "No high-priority anomalies detected." : "Run anomaly scan to check for issues."}
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
                        description="YTD"
                        className="cursor-pointer"
                      />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Total Revenue Details</DialogTitle>
                          <DialogDescription>A detailed look at monthly revenue trends over the past year.</DialogDescription>
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
                        description="YTD"
                        className="cursor-pointer"
                      />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Total Expenses Details</DialogTitle>
                          <DialogDescription>A detailed look at monthly expense trends over the past year.</DialogDescription>
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
                        title="Net Profit" 
                        value={`$${(netProfit / 1000000).toFixed(1)}M`} 
                        icon={Banknote} 
                        description="YTD"
                        className="cursor-pointer"
                      />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                          <DialogTitle>Net Profit Details</DialogTitle>
                          <DialogDescription>A detailed look at monthly profit over the past year.</DialogDescription>
                      </DialogHeader>
                      <SampleBarChart
                          title=""
                          description=""
                          data={mockFinancialData}
                          xAxisKey="month"
                          dataKeys={[{ key: 'profit', color: '3', name: 'Profit' }]}
                          className="mt-4"
                          colorEachBar={true}
                      />
                  </DialogContent>
              </Dialog>

              <KpiCard title="Profit Margin" value={`${((netProfit / totalRevenue) * 100).toFixed(1)}%`} icon={Percent} description="YTD" />
            </div>
            
            <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><Ratio className="mr-2 h-5 w-5 text-primary"/>Key Financial Ratios</CardTitle>
                  <CardDescription>Snapshot of the company's financial health and stability.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">0.85</p>
                    <p className="text-sm text-muted-foreground">Debt-to-Equity Ratio</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">2.1</p>
                    <p className="text-sm text-muted-foreground">Current Ratio</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">18.5%</p>
                    <p className="text-sm text-muted-foreground">Return on Equity (ROE)</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground italic">Ratios are based on the latest quarterly data.</p>
                </CardFooter>
              </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <SampleLineChart
                title="Revenue vs. Expenses"
                description="Monthly financial flows."
                data={mockFinancialData}
                xAxisKey="month"
                xAxisLabel="Month"
                yAxisLabel="Amount ($)"
                dataKeys={[
                  { key: 'revenue', color: '1', name: 'Revenue' },
                  { key: 'expenses', color: '2', name: 'Expenses' },
                ]}
              />
              <SampleBarChart
                title="Profitability by Month"
                description="Monthly net profit analysis."
                data={mockFinancialData}
                xAxisKey="month"
                dataKeys={[{ key: 'profit', color: '3', name: 'Profit' }]}
                colorEachBar={true}
              />
            </div>

            <ForecastingMethodsChart data={mockForecastingData} className="shadow-lg border-primary/50" />

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><Scale className="mr-2 h-5 w-5 text-primary"/>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of expenses across major categories for the last quarter.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="w-full max-w-md mx-auto">
                      <SamplePieChart
                          title=""
                          description=""
                          data={expenseBreakdownData}
                      />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseBreakdownData.map((item) => {
                        const amount = (item.value / 100) * (totalExpenses / 4); // Assuming Q2 expenses
                        return (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">${(amount / 1000).toFixed(1)}k</TableCell>
                            <TableCell className="text-right">{item.value}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center"><BarChartBig className="mr-2 h-5 w-5 text-primary" />AI-Powered Expense Anomaly Detection</CardTitle>
                  <CardDescription>Use AI to scan recent expense transactions for unusual patterns that may indicate errors or fraud.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scanError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Scan Failed</AlertTitle>
                    <AlertDescription>{scanError}</AlertDescription>
                  </Alert>
                )}

                {isScanning && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>Scanning transactions for anomalies...</p>
                  </div>
                )}

                {anomalies && !isScanning && (
                  <div>
                    {anomalies.length > 0 ? (
                      <div className="space-y-3">
                        {anomalies.map((anomaly) => {
                          const transaction = mockExpenseTransactions.find(t => t.id === anomaly.transactionId);
                          return (
                              <div key={anomaly.transactionId} className="p-3 border-l-4 bg-muted/50 rounded-r-md" style={{ borderColor: `hsl(var(--${anomaly.severity === 'High' ? 'destructive' : 'primary'}))`}}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold">{transaction?.vendor}: ${transaction?.amount.toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground">{transaction?.description}</p>
                                  </div>
                                  <Badge variant={getSeverityBadge(anomaly.severity)}>{anomaly.severity} Priority</Badge>
                                </div>
                                <p className="text-xs text-foreground mt-2 pt-2 border-t border-dashed">AI Reason: {anomaly.reason}</p>
                              </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                        <p className="font-semibold">No anomalies detected.</p>
                        <p className="text-sm text-muted-foreground">All scanned transactions appear to be within normal parameters.</p>
                      </div>
                    )}
                  </div>
                )}

                {!isScanning && !anomalies && (
                  <p className="text-sm text-muted-foreground">Click the button below to start an AI-powered scan of the latest expense entries.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleAnomalyScan} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Run Anomaly Scan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
