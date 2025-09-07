// src/app/(app)/forecasting/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { generateFinancialForecastWithImpact, type FinancialForecastingOutput } from "@/ai/flows/financial-forecasting";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrainCircuit, TrendingUp, FileText, Lightbulb, AlertCircle, Loader2, TrendingDown, CheckCircle } from "lucide-react";
import { mockSalesTransactions, marketTrendsExample } from "@/lib/placeholder-data"; // Using mockSalesTransactions
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";

// Schema for the form fields the user interacts with
const forecastFormSchema = z.object({
  marketTrends: z.string().min(20, "Market trends description is too short."),
  forecastHorizon: z.string().min(3, "Forecast horizon is too short, e.g., 'Next Quarter', 'Next Year'."),
});

type ForecastFormData = z.infer<typeof forecastFormSchema>;

// Function to process mockSalesTransactions into historical sales data for the AI
const getHistoricalSalesData = () => {
  const monthlySales: Record<string, number> = {};

  mockSalesTransactions.forEach(transaction => {
    if (transaction.totalPrice && !transaction.isCancellation) {
      const monthYear = format(parseISO(transaction.invoiceDate), 'yyyy-MM');
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + transaction.totalPrice;
    }
  });

  return Object.entries(monthlySales)
    .map(([date, salesValue]) => ({ date, salesValue }))
    .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
};

export default function FinancialForecastingPage() {
  const [forecastResult, setForecastResult] = useState<FinancialForecastingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ForecastFormData>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues: {
      marketTrends: "",
      forecastHorizon: "Next Quarter",
    },
  });

  const onSubmit = async (data: ForecastFormData) => {
    setIsLoading(true);
    setError(null);
    setForecastResult(null);
    try {
      const historicalSales = getHistoricalSalesData();
      if (historicalSales.length === 0) {
        throw new Error("No historical sales data could be derived from the mock transactions. Please check placeholder data.");
      }

      const aiInput = {
        historicalSales,
        marketTrends: data.marketTrends,
        forecastHorizon: data.forecastHorizon,
      };
      
      const result = await generateFinancialForecastWithImpact(aiInput);
      setForecastResult(result);
      toast({
        title: "Forecast Generated",
        description: "Financial forecast has been successfully generated using derived sales data.",
      });
    } catch (e: any) {
      console.error("Forecasting error:", e);
      const errorMessage = e.message || "An unexpected error occurred during forecasting.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Forecasting Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactBadge = (impactType: 'Positive' | 'Negative' | 'Neutral') => {
    switch (impactType) {
      case 'Positive': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'Negative': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-headline font-semibold text-foreground">AI Financial Forecasting</h2>
            <p className="text-muted-foreground">Predict future performance and understand the impact of market trends on your forecast.</p>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Input Data for Forecasting</CardTitle>
          <CardDescription>Provide market context. Historical sales data is automatically derived from internal records.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Market Trends & News</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={marketTrendsExample}
                        className="min-h-[100px]"
                        {...field}
                         aria-describedby="marketTrendsHelp"
                      />
                    </FormControl>
                     <FormDescription id="marketTrendsHelp">
                      Describe relevant market conditions, competitor actions, economic factors, etc. The AI will analyze this text.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forecastHorizon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forecast Horizon</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Next Quarter, Next 6 Months, Next Year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
               <Button type="button" variant="outline" onClick={() => {
                form.setValue("marketTrends", marketTrendsExample);
               }} className="ml-2">
                Load Example Market Trends
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {isLoading && (
        <Card>
            <CardContent className="pt-6 text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">AI is analyzing historical data and market trends...</p>
            </CardContent>
        </Card>
      )}

      {forecastResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg lg:col-span-2 border-primary bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center text-primary"><TrendingUp className="mr-2 h-6 w-6"/>AI Generated Financial Forecast</CardTitle>
                    <CardDescription>Forecast for: {form.getValues().forecastHorizon}, based on derived historical sales and provided market trends.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <h3 className="font-semibold text-lg text-foreground">Revenue Forecast</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{forecastResult.revenueForecast}</p>
                    </div>
                    <div>
                    <h3 className="font-semibold text-lg text-foreground">AI-Estimated Expense Forecast</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{forecastResult.expenseForecast}</p>
                    </div>
                    <div>
                    <h3 className="font-semibold text-lg text-foreground">AI-Estimated Profit Forecast</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{forecastResult.profitForecast}</p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg text-foreground flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500"/>Forecast Commentary</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{forecastResult.forecastCommentary}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground italic">Disclaimer: AI-generated forecasts are for informational purposes only and should not be considered financial advice. Validate with expert analysis.</p>
                </CardFooter>
            </Card>

            <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary"/>Market Trend Impact Analysis</CardTitle>
                    <CardDescription>AI's breakdown of how market news affects the forecast.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {forecastResult.impactAnalysis.map((factor, index) => (
                            <div key={index} className="p-4 rounded-md border bg-muted/50 flex gap-4">
                                <div className="pt-1">{getImpactBadge(factor.impactType)}</div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-foreground">{factor.factor}</h4>
                                        <Badge variant={factor.impactType === 'Negative' ? 'destructive' : 'default'} className="capitalize">{factor.impactStrength} {factor.impactType}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{factor.reasoning}</p>
                                </div>
                            </div>
                        ))}
                         {forecastResult.impactAnalysis.length === 0 && (
                            <p className="text-muted-foreground">The AI did not identify any specific impact factors from the provided text.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
