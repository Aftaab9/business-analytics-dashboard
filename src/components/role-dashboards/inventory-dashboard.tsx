// src/components/role-dashboards/inventory-dashboard.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KpiCard } from "@/components/kpi-card";
import { SampleTreemap } from "@/components/charts/sample-treemap";
import { SampleLineChart } from "@/components/charts/sample-line-chart";
import { mockInventory, mockSalesTransactions, inventoryMarketTrendsExample, getCountryMetricsData, mockAssociationRules } from "@/lib/placeholder-data"; 
import type { InventoryItem as InventoryItemType, SalesTransaction, AssociationRule } from "@/types"; 
import { forecastProductDemand, type ProductDemandForecastInput, type ProductDemandForecastOutput } from "@/ai/flows/product-demand-forecast";
import { Package, PackageCheck, PackageX, TrendingUp, AlertTriangle, Boxes, CheckCircle, BrainCircuit, Loader2, AlertCircle as AlertCircleIcon, ShoppingBasket } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";
import { CountryRadarChart } from "@/components/charts/country-radar-chart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssociationHeatmap } from "../charts/association-heatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionCenter } from "../action-center";

const productDemandForecastFormSchema = z.object({
  productId: z.string().min(1, "Please select a product."),
  forecastHorizon: z.string().min(3, "Forecast horizon is too short (e.g., 'Next Quarter').").default("Next Quarter"),
  marketTrends: z.string().optional(),
});

type ProductDemandForecastFormData = z.infer<typeof productDemandForecastFormSchema>;

// Function to process mockSalesTransactions for a specific product
const getHistoricalProductSalesData = (productId: string): Array<{ date: string; quantitySold: number }> => {
  const monthlySales: Record<string, number> = {};

  mockSalesTransactions.forEach(transaction => {
    if (transaction.stockCode === productId && transaction.quantity > 0 && !transaction.isCancellation) {
      const monthYear = format(parseISO(transaction.invoiceDate), 'yyyy-MM');
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + transaction.quantity;
    }
  });

  return Object.entries(monthlySales)
    .map(([date, quantitySold]) => ({ date, quantitySold }))
    .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
};


export function InventoryDashboard() {
  const { toast } = useToast();
  const [forecastResult, setForecastResult] = useState<ProductDemandForecastOutput | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const form = useForm<ProductDemandForecastFormData>({
    resolver: zodResolver(productDemandForecastFormSchema),
    defaultValues: {
      productId: "",
      forecastHorizon: "Next Quarter",
      marketTrends: "",
    },
  });
  
  const countryMetrics = getCountryMetricsData();

  const onForecastSubmit = async (data: ProductDemandForecastFormData) => {
    setIsForecasting(true);
    setForecastError(null);
    setForecastResult(null);
    try {
      const selectedProduct = mockInventory.find(p => p.id === data.productId);
      if (!selectedProduct) {
        throw new Error("Selected product not found in mock inventory.");
      }

      const historicalProductSales = getHistoricalProductSalesData(data.productId);
      
      const aiInput: ProductDemandForecastInput = {
        productId: data.productId,
        productName: selectedProduct.name,
        historicalProductSales,
        forecastHorizon: data.forecastHorizon,
        marketTrends: data.marketTrends,
      };
      
      const result = await forecastProductDemand(aiInput);
      setForecastResult(result);
      toast({
        title: "Product Demand Forecast Generated",
        description: `Forecast for ${result.productName} (ID: ${result.productId}) has been successfully generated.`,
      });
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during product demand forecasting.";
      setForecastError(errorMessage);
      toast({
        variant: "destructive",
        title: "Forecasting Error",
        description: errorMessage,
      });
    } finally {
      setIsForecasting(false);
    }
  };


  const totalStockValue = mockInventory.reduce((sum, item) => sum + item.stock * item.price, 0);
  const stockTurnoverRate = 4.5; // Mock data

  // Data for the Treemap - calculates total value per category
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
  
  // Enhanced logic for at-risk inventory items
  const highDemandProductIds = ['22727', '22728', '84879', '22423']; // Mocked high-demand items
  const atRiskItems = mockInventory
    .map(item => {
      let atRiskReason = '';
      if (item.stock < 50) {
        atRiskReason = 'Critically Low Stock';
      } else if (item.stock < 100 && highDemandProductIds.includes(item.id)) {
        atRiskReason = 'High Forecasted Demand';
      }
      return { ...item, atRiskReason };
    })
    .filter(item => item.atRiskReason !== '')
    .sort((a,b) => (a.atRiskReason === 'Critically Low Stock' ? -1 : 1)); // Prioritize critical items

  const inventoryActionItems = [
    ...atRiskItems.slice(0,2).map(item => ({
        id: item.id,
        type: 'Inventory Alert',
        title: `${item.atRiskReason}: ${item.name}`,
        description: `Current stock is only ${item.stock} units. Recommend immediate reorder or review.`,
        status: 'Action Required',
        priority: 'High' as 'High' | 'Medium' | 'Low',
    })),
    {
        id: 'basket-1',
        type: 'Market Basket Insight',
        title: 'Cross-Sell Opportunity Detected',
        description: `High cross-sell potential between Mechanical Keyboards and Wireless Mice (85% confidence). Consider creating a product bundle.`,
        status: 'Needs Attention',
        priority: 'Low' as 'High' | 'Medium' | 'Low',
    }
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-headline font-semibold text-foreground">Inventory Dashboard</h2>
            <p className="text-muted-foreground -mt-4">Manage stock levels, turnover rates, and supply chain metrics.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard title="Total Stock Items" value={mockInventory.length.toString()} icon={Package} />
              <KpiCard title="Total Stock Value" value={`$${(totalStockValue / 1000).toFixed(1)}k`} icon={PackageCheck} />
              <KpiCard title="At-Risk Items" value={atRiskItems.length.toString()} icon={AlertTriangle} description="Require attention" />
              <KpiCard title="Stock Turnover Rate" value={stockTurnoverRate.toString()} icon={TrendingUp} description="Annualized" />
            </div>
         </div>
          <div className="lg:col-span-1 lg:row-span-2">
             <ActionCenter 
                title="Action & Insight Hub"
                description="Prioritized inventory alerts and opportunities."
                items={inventoryActionItems}
              />
          </div>
         <div className="lg:col-span-2">
            <CountryRadarChart data={countryMetrics.data} countries={countryMetrics.countries} />
         </div>
       </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SampleTreemap
          title="Stock Value by Category"
          description="Total value of inventory held in each product category."
          data={treemapData}
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Inventory At-Risk Alerts</CardTitle>
            <CardDescription>Items needing attention due to low stock or high forecasted demand.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskItems.slice(0,5).map(item => (
                  <TableRow key={item.id} className={item.atRiskReason === 'Critically Low Stock' ? "bg-red-500/10" : "bg-yellow-500/10"}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                       <Badge variant={item.atRiskReason === 'Critically Low Stock' ? 'destructive' : 'secondary'}>
                        {item.atRiskReason}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center"><Boxes className="mr-2 h-5 w-5 text-primary"/>Product Demand Forecasting</CardTitle>
            <CardDescription>Predict demand for key products using AI. Historical sales are derived from transaction data.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onForecastSubmit)}>
            <CardContent className="space-y-4">
              {forecastError && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle>Forecasting Error</AlertTitle>
                  <AlertDescription>{forecastError}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product to forecast" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockInventory.map((item: InventoryItemType) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (ID: {item.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose a product for demand forecasting.</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a forecast horizon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Next Month">Next Month</SelectItem>
                        <SelectItem value="Next Quarter">Next Quarter</SelectItem>
                        <SelectItem value="Next 6 Months">Next 6 Months</SelectItem>
                        <SelectItem value="Next Year">Next Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Trends/Specific Factors (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Upcoming promotion, new competitor, seasonal demand changes"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>Any known factors that might specifically impact this product's demand.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-wrap gap-2">
              <Button type="submit" disabled={isForecasting}>
                {isForecasting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Forecast Product Demand
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('marketTrends', inventoryMarketTrendsExample)}
              >
                Load Example Trends
              </Button>
            </CardFooter>
          </form>
        </Form>

        {forecastResult && (
          <CardContent className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold mb-2 text-primary">Forecast for: {forecastResult.productName} (ID: {forecastResult.productId})</h3>
            <div className="mb-4">
              <h4 className="font-medium">Commentary:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{forecastResult.commentary}</p>
              {forecastResult.confidenceLevel && <div className="text-sm mt-1">Confidence: <Badge>{forecastResult.confidenceLevel}</Badge></div>}
            </div>
            {forecastResult.forecastedDemand.length > 0 ? (
                <>
                <h4 className="font-medium mb-2">Predicted Demand:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {forecastResult.forecastedDemand.map((point, index) => (
                    <Card key={index} className="bg-muted/50 p-3">
                    <p className="text-sm font-medium text-foreground">{point.period}</p>
                    <p className="text-lg font-bold text-primary">{point.predictedQuantity} units</p>
                    </Card>
                ))}
                </div>
                <SampleLineChart
                    title={`Forecasted Demand Trend for ${forecastResult.productName}`}
                    description={`Predicted units to be sold over ${form.getValues().forecastHorizon}.`}
                    data={forecastResult.forecastedDemand.map(fd => ({ period: fd.period, quantity: fd.predictedQuantity }))}
                    xAxisKey="period"
                    xAxisLabel="Period"
                    yAxisLabel="Predicted Quantity"
                    dataKeys={[{ key: 'quantity', name: 'Predicted Quantity', color: '3' }]}
                    yAxisFormatter={(value) => value.toLocaleString()}
                />
                </>
            ) : (
                <p className="text-muted-foreground">No specific demand points were forecasted (this might indicate an issue or insufficient data for a detailed breakdown by the AI).</p>
            )}
          </CardContent>
        )}
        <Separator className="my-4" />
            <div>
              <CardHeader>
                <h4 className="text-md font-semibold mb-2 flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-muted-foreground"/>Model Performance (Illustrative)</h4>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">MAPE: 12.5%</Badge>
                    <Badge variant="outline">Overall Accuracy: 88%</Badge>
                    <Badge variant="outline">MAE (units): 50</Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mt-2">Note: These metrics visualize potential performance from a demand forecasting model.</p>
              </CardContent>
            </div>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <ShoppingBasket className="mr-2 h-5 w-5 text-primary" />
            Market Basket Analysis
          </CardTitle>
          <CardDescription>
            Discover which products are frequently purchased together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="heatmap">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="heatmap">Visual Heatmap</TabsTrigger>
              <TabsTrigger value="rules">Detailed Rules</TabsTrigger>
            </TabsList>
            <TabsContent value="heatmap" className="mt-4">
              <AssociationHeatmap
                rules={mockAssociationRules}
                title="Product Association Confidence"
                description="A visual guide to product relationships. Darker cells mean a stronger likelihood of being bought together."
              />
            </TabsContent>
            <TabsContent value="rules" className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                    The rules below show the likelihood of a customer buying one product given they have already bought another.
                    Higher confidence indicates a stronger association.
                </p>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>If You Buy (Antecedent)</TableHead>
                        <TableHead>Then You Buy (Consequent)</TableHead>
                        <TableHead className="text-right">Confidence</TableHead>
                        <TableHead className="text-right">Lift</TableHead>
                        <TableHead className="text-right">Support</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {mockAssociationRules.map((rule, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{rule.antecedents.join(', ')}</TableCell>
                        <TableCell>{rule.consequents.join(', ')}</TableCell>
                        <TableCell className="text-right font-bold text-primary">
                            {(rule.confidence * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell className="text-right">
                            <Badge variant={rule.lift > 1.5 ? "default" : "secondary"}>
                            {rule.lift.toFixed(2)}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {(rule.support * 100).toFixed(1)}%
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                    <AccordionTrigger>How to read this table?</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Confidence:</strong> The probability of buying the 'Consequent' if you buy the 'Antecedent'. A 75% confidence means that 75% of customers who bought the first item also bought the second.
                        </li>
                        <li>
                            <strong>Lift:</strong> How much more likely the 'Consequent' is to be purchased when the 'Antecedent' is purchased, compared to its overall popularity. A lift greater than 1 suggests a positive association.
                        </li>
                        <li>
                            <strong>Support:</strong> How frequently the items in the rule appear together in all transactions. A 25% support means this combination appears in a quarter of all purchases.
                        </li>
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
