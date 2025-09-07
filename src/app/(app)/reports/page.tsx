// src/app/(app)/reports/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { generateExecutiveSummary, type GenerateExecutiveSummaryOutput, type GenerateExecutiveSummaryInput } from "@/ai/flows/executive-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Sparkles, AlertCircle, Loader2, BarChart, PieChart, Settings2, Users, Boxes } from "lucide-react";
import { mockFinancialData, mockInventory, mockTeamPerformance } from "@/lib/placeholder-data";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { SampleTreemap } from "@/components/charts/sample-treemap";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const reportOptionsSchema = z.object({
  includeRevenueChart: z.boolean().default(false),
  includeProfitChart: z.boolean().default(false),
  includeTeamPerformance: z.boolean().default(false),
  includeStockValueTreemap: z.boolean().default(false),
  reportPeriod: z.string().min(1, "Report period is required").default("Last 12 Months (Mock Data)"),
});

type ReportOptionsFormData = z.infer<typeof reportOptionsSchema>;

export default function CustomReportsPage() {
  const [summaryResult, setSummaryResult] = useState<GenerateExecutiveSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ReportOptionsFormData>({
    resolver: zodResolver(reportOptionsSchema),
    defaultValues: {
      includeRevenueChart: true,
      includeProfitChart: false,
      includeTeamPerformance: false,
      includeStockValueTreemap: false,
      reportPeriod: "Last 12 Months (based on Mock Data)",
    },
  });

  const onSubmit = async (data: ReportOptionsFormData) => {
    setIsLoading(true);
    setError(null);
    setSummaryResult(null);

    try {
      const totalRevenue = mockFinancialData.reduce((sum, item) => sum + item.revenue, 0);
      const totalExpenses = mockFinancialData.reduce((sum, item) => sum + item.expenses, 0);
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) + "%" : "N/A";

      const observedTrends: string[] = [];
      if (mockFinancialData.length > 1) {
        const firstMonthRevenue = mockFinancialData[0].revenue;
        const lastMonthRevenue = mockFinancialData[mockFinancialData.length - 1].revenue;
        if (lastMonthRevenue > firstMonthRevenue) observedTrends.push("Overall revenue showed an increasing trend during the period.");
        else if (lastMonthRevenue < firstMonthRevenue) observedTrends.push("Overall revenue showed a decreasing trend during the period.");
        else observedTrends.push("Overall revenue remained relatively stable during the period.");

        const firstMonthProfit = mockFinancialData[0].profit;
        const lastMonthProfit = mockFinancialData[mockFinancialData.length - 1].profit;
         if (lastMonthProfit > firstMonthProfit) observedTrends.push("Profitability generally improved over the period.");
        else if (lastMonthProfit < firstMonthProfit) observedTrends.push("Profitability generally declined over the period.");
      }
      if (observedTrends.length === 0) observedTrends.push("Data processed for summary generation.");


      const aiInput: GenerateExecutiveSummaryInput = {
        keyMetrics: { totalRevenue, totalExpenses, netProfit, profitMargin },
        observedTrends,
        period: data.reportPeriod,
      };

      const result = await generateExecutiveSummary(aiInput);
      setSummaryResult(result);
      toast({
        title: "Executive Summary Generated",
        description: "AI has successfully created an executive summary based on internal data.",
      });
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred while generating the summary.";
      setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Summary Generation Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const watchIncludeRevenueChart = form.watch("includeRevenueChart");
  const watchIncludeProfitChart = form.watch("includeProfitChart");
  const watchIncludeTeamPerformance = form.watch("includeTeamPerformance");
  const watchIncludeStockValueTreemap = form.watch("includeStockValueTreemap");

  const treemapData = mockInventory.reduce((acc, item) => {
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

  const teamPerformanceData = mockTeamPerformance.slice(0, 5).sort((a, b) => b.sales - a.sales);

  const isAnyChartSelected = watchIncludeRevenueChart || watchIncludeProfitChart || watchIncludeTeamPerformance || watchIncludeStockValueTreemap;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-foreground">AI-Powered Report Builder</h2>
          <p className="text-muted-foreground">Generate AI summaries and select components from across the business for a consolidated report.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-primary"/>Report Options</CardTitle>
                <CardDescription>Select components and generate an AI summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                 <FormField
                  control={form.control}
                  name="reportPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Period</FormLabel>
                      <FormControl>
                         <Input {...field} readOnly className="bg-muted/50"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center"><BarChart className="w-4 h-4 mr-2"/>Chart Options</h4>
                  <FormField
                    control={form.control}
                    name="includeRevenueChart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Financials: Revenue Trend</FormLabel>
                           <FormDescription>Monthly revenue line chart.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="includeProfitChart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Financials: Profit Overview</FormLabel>
                          <FormDescription>Monthly profit bar chart.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeTeamPerformance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sales: Team Performance</FormLabel>
                          <FormDescription>Sales by top team members.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="includeStockValueTreemap"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Inventory: Stock Value</FormLabel>
                          <FormDescription>Treemap of stock value by category.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                  ) : (
                     <><Sparkles className="mr-2 h-4 w-4" />Generate AI Summary</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <div className="space-y-6 lg:col-span-2">
            {summaryResult && (
            <Card className="shadow-lg border-primary bg-primary/5">
                <CardHeader>
                <CardTitle className="flex items-center text-primary"><Sparkles className="mr-2 h-6 w-6"/>AI Executive Summary</CardTitle>
                 <CardDescription>For period: {form.getValues().reportPeriod}</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{summaryResult.summary}</p>
                </CardContent>
                <CardFooter>
                   <p className="text-xs text-muted-foreground italic">This summary was generated by AI based on the provided data.</p>
                </CardFooter>
            </Card>
            )}

            {!isAnyChartSelected && !summaryResult && (
                <Card className="flex flex-col items-center justify-center h-full text-center p-6 shadow-lg">
                    <BarChart className="w-16 h-16 text-muted-foreground/50 mb-4"/>
                    <CardTitle>Your Custom Report</CardTitle>
                    <CardDescription className="mt-2">Select charts from the options panel and generate an AI summary to build your report here.</CardDescription>
                </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {watchIncludeRevenueChart && (
                     <SampleLineChart
                        title="Revenue Trend"
                        description="Monthly revenue data."
                        data={mockFinancialData}
                        xAxisKey="month"
                        dataKeys={[{ key: 'revenue', color: '1', name: 'Revenue' }]}
                        className="shadow-md"
                    />
                )}
                {watchIncludeProfitChart && (
                     <SampleBarChart
                        title="Profit Overview"
                        description="Monthly profit data."
                        data={mockFinancialData}
                        xAxisKey="month"
                        dataKeys={[{ key: 'profit', color: '2', name: 'Profit' }]}
                        className="shadow-md"
                        colorEachBar={true}
                    />
                )}
                 {watchIncludeTeamPerformance && (
                     <SampleBarChart
                        title="Sales Team Performance"
                        description="Sales by top representatives."
                        data={teamPerformanceData}
                        xAxisKey="name"
                        dataKeys={[{ key: 'sales', color: '3', name: 'Sales' }]}
                        className="shadow-md"
                        colorEachBar={true}
                    />
                )}
                {watchIncludeStockValueTreemap && (
                     <SampleTreemap
                        title="Stock Value by Category"
                        description="Total inventory value by category."
                        data={treemapData}
                        className="shadow-md"
                    />
                )}
            </div>
        </div>

      </div>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Generated Report Preview</CardTitle>
            <CardDescription>This area displays the formatted report with selected components.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 border rounded-md min-h-[200px] bg-white shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Report for: {form.getValues().reportPeriod}</h3>
            
            {summaryResult && <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded-md shadow-sm"><h4 className="font-bold text-lg mb-1">Executive Summary</h4><p className="text-sm">{summaryResult.summary}</p></div>}
            
            {(!summaryResult && !isAnyChartSelected) &&
              <p className="text-gray-500">Select chart options and generate an AI summary to preview the report content here.</p>
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {watchIncludeRevenueChart && <div className="my-4"><h4 className="font-semibold text-gray-700 mb-2 flex items-center"><BarChart className="w-5 h-5 mr-2 text-primary"/>Revenue Trend</h4><div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">Chart will display above</div></div>}
              {watchIncludeProfitChart && <div className="my-4"><h4 className="font-semibold text-gray-700 mb-2 flex items-center"><PieChart className="w-5 h-5 mr-2 text-primary"/>Profit Overview</h4><div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">Chart will display above</div></div>}
              {watchIncludeTeamPerformance && <div className="my-4"><h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-primary"/>Team Performance</h4><div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">Chart will display above</div></div>}
              {watchIncludeStockValueTreemap && <div className="my-4"><h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Boxes className="w-5 h-5 mr-2 text-primary"/>Stock Value</h4><div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">Chart will display above</div></div>}
            </div>

            <p className="text-gray-600 mt-6 pt-4 border-t text-sm">Further sections like detailed analysis, data tables, and conclusions would follow here in a full report document.</p>
        </CardContent>
        <CardFooter>
            <Button><FileText className="mr-2 h-4 w-4"/>Download Report (PDF - Mock)</Button>
        </CardFooter>
       </Card>
    </div>
  );
}
