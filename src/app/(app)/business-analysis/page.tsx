
'use client';

import { useState } from 'react';

import {
  generateBusinessAnalysis,
  type BusinessAnalysisOutput,
} from '@/ai/flows/business-analysis-flow';
import {
  mockFinancialData,
  mockInventory,
  mockTeamPerformance,
} from '@/lib/placeholder-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, FileText, Loader2, Printer, AlertCircle } from 'lucide-react';

export default function BusinessAnalysisReportPage() {
  const [analysisResult, setAnalysisResult] =
    useState<BusinessAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Aggregate data from mocks
      const totalRevenue = mockFinancialData.reduce(
        (sum, item) => sum + item.revenue,
        0
      );
      const totalExpenses = mockFinancialData.reduce(
        (sum, item) => sum + item.expenses,
        0
      );
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin =
        totalRevenue > 0
          ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%`
          : 'N/A';
      const totalStockValue = mockInventory.reduce(
        (sum, item) => sum + item.stock * item.price,
        0
      );
      const atRiskItemsCount = mockInventory.filter(
        item => item.stock < 100
      ).length;
      const totalSalesYTD = mockTeamPerformance.reduce(
        (sum, item) => sum + item.sales,
        0
      );
      const topPerformer = mockTeamPerformance.reduce((prev, current) =>
        prev.sales > current.sales ? prev : current
      );

      const input = {
        keyMetrics: { totalRevenue, totalExpenses, netProfit, profitMargin },
        inventoryMetrics: {
          totalStockValue,
          atRiskItemsCount,
          stockTurnoverRate: 4.5,
        },
        salesMetrics: {
          totalSalesYTD,
          topPerformer: topPerformer.name,
          conversionRate: '15.2%',
        },
        period: 'Last 12 Months (based on mock data)',
      };

      const result = await generateBusinessAnalysis(input);
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'The business analysis report has been generated.',
      });
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Generation Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-foreground">
            AI Business Analysis Report
          </h2>
          <p className="text-muted-foreground">
            Generate a comprehensive, narrative report on business performance
            with actionable insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generate Analysis
              </>
            )}
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            disabled={!analysisResult}
          >
            <Printer className="mr-2 h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      <Card className="printable-area">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <FileText className="mr-3 h-6 w-6 text-primary" />
            Comprehensive Business Report
          </CardTitle>
          <CardDescription>
            Generated on {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!analysisResult && !isLoading && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium text-foreground">
                Ready to analyze your business?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click the "Generate Analysis" button to begin.
              </p>
            </div>
          )}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                AI is analyzing your data...
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This may take a moment.
              </p>
            </div>
          )}
          {analysisResult && (
            <div className="space-y-6 text-foreground prose prose-sm max-w-none">
              <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-md">
                <h3 className="font-headline text-xl text-primary">
                  Executive Summary
                </h3>
                <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
                  {analysisResult.executiveSummary}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-headline text-xl">Financial Analysis</h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {analysisResult.financialAnalysis}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-headline text-xl">Operational Analysis</h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {analysisResult.operationalAnalysis}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-headline text-xl">
                  Sales and Market Analysis
                </h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {analysisResult.salesAndMarketAnalysis}
                </p>
              </div>

              <Separator />

              <div className="p-4 bg-accent/10 border-l-4 border-accent rounded-r-md">
                <h3 className="font-headline text-xl text-accent-foreground">
                  Strategic Recommendations
                </h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {analysisResult.strategicRecommendations}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .print-hidden {
            display: none;
          }
          .printable-area {
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
