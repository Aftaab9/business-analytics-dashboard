// src/app/(app)/strategic-pricing/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { generateDuopolyData, mockMonopolyData } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DuopolyDataPoint, GeneratePricingStrategyOutput } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePricingStrategy } from '@/ai/flows/pricing-strategy-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Loader2, AlertCircle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { MonopolyChart } from '@/components/charts/monopoly-chart';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) return `$${(tickItem / 1000).toFixed(0)}k`;
    return `$${tickItem}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const ourData = payload.find(p => p.dataKey === 'ourRevenue');
    const competitorData = payload.find(p => p.dataKey === 'competitorRevenue');

    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg text-sm">
        <p className="label font-semibold">{`Our Price: $${label}`}</p>
        {ourData && <p style={{ color: ourData.color }}>{`Our Revenue: ${formatYAxis(ourData.value)}`}</p>}
        {competitorData && <p style={{ color: competitorData.color }}>{`Comp. Revenue: ${formatYAxis(competitorData.value)}`}</p>}
      </div>
    );
  }
  return null;
};

type MarketScenario = 'rational' | 'price_war' | 'brand_loyal';

export default function StrategicPricingPage() {
    const { toast } = useToast();
    const [ourPrice, setOurPrice] = useState(100);
    const [competitorPrice, setCompetitorPrice] = useState(100);
    const [marketScenario, setMarketScenario] = useState<MarketScenario>('rational');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<GeneratePricingStrategyOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const duopolyData = useMemo(() => generateDuopolyData(ourPrice, competitorPrice, marketScenario), [ourPrice, competitorPrice, marketScenario]);
    
    const nashEquilibriumPrice = 100;
    const nashEquilibriumPoint = duopolyData.find(d => d.ourPrice === nashEquilibriumPrice);

    const handleAnalyzeStrategy = async () => {
        setIsLoading(true);
        setError(null);
        setAiResponse(null);
        try {
            const result = await generatePricingStrategy({
                ourPrice,
                competitorPrice,
                marketType: 'duopoly',
                scenario: marketScenario,
            });
            setAiResponse(result);
            toast({
                title: 'Analysis Complete',
                description: 'AI has provided a strategic recommendation for the selected scenario.',
            });
        } catch (e: any) {
            const errorMessage = e.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast({
                variant: 'destructive',
                title: 'Analysis Error',
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-semibold text-foreground">
                        Strategic Pricing Canvas
                    </h2>
                    <p className="text-muted-foreground">
                        Model competitive pricing scenarios using game theory and AI-driven analysis.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="font-headline">Duopoly Pricing Model (Bertrand Competition)</CardTitle>
                        <CardDescription>
                            Simulate how your pricing decisions affect revenue under different market scenarios. Adjust parameters and analyze the outcome.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Controls */}
                        <div className="md:col-span-1 space-y-6">
                             <div>
                                <Label className="text-base font-semibold">Market Scenario</Label>
                                <RadioGroup value={marketScenario} onValueChange={(v) => setMarketScenario(v as MarketScenario)} className="mt-2 space-y-2">
                                    <div>
                                        <RadioGroupItem value="rational" id="rational" className="peer sr-only" />
                                        <Label htmlFor="rational" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", {"border-primary": marketScenario === 'rational'})}>
                                            Rational Market
                                            <span className="text-xs font-normal text-muted-foreground mt-1">Competitors react logically.</span>
                                        </Label>
                                    </div>
                                     <div>
                                        <RadioGroupItem value="price_war" id="price_war" className="peer sr-only" />
                                        <Label htmlFor="price_war" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", {"border-primary": marketScenario === 'price_war'})}>
                                            Price War
                                            <span className="text-xs font-normal text-muted-foreground mt-1">Competitors aggressively undercut.</span>
                                        </Label>
                                    </div>
                                     <div>
                                        <RadioGroupItem value="brand_loyal" id="brand_loyal" className="peer sr-only" />
                                        <Label htmlFor="brand_loyal" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", {"border-primary": marketScenario === 'brand_loyal'})}>
                                            High Brand Loyalty
                                            <span className="text-xs font-normal text-muted-foreground mt-1">Customers are less price-sensitive.</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label htmlFor="our-price" className="text-base">Our Price: <span className="font-bold text-primary">${ourPrice}</span></Label>
                                <Slider
                                    id="our-price"
                                    min={50}
                                    max={150}
                                    step={10}
                                    value={[ourPrice]}
                                    onValueChange={(value) => setOurPrice(value[0])}
                                />
                            </div>
                            <div>
                                <Label htmlFor="competitor-price" className="text-base">Competitor's Price: <span className="font-bold text-accent">${competitorPrice}</span></Label>
                                <Slider
                                    id="competitor-price"
                                    min={50}
                                    max={150}
                                    step={10}
                                    value={[competitorPrice]}
                                    onValueChange={(value) => setCompetitorPrice(value[0])}
                                />
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="md:col-span-2">
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={duopolyData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="ourPrice" name="Our Price" unit="$" />
                                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" name="Revenue" tickFormatter={formatYAxis} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="ourRevenue" name="Our Revenue" fill="hsl(var(--primary))" />
                                    <Line yAxisId="left" type="monotone" dataKey="competitorRevenue" name="Competitor Revenue" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                                    {nashEquilibriumPoint && marketScenario === 'rational' && (
                                        <ReferenceLine yAxisId="left" x={nashEquilibriumPrice} stroke="hsl(var(--destructive))" strokeDasharray="3 3" strokeWidth={2}>
                                            <Label value="Nash Equilibrium" position="insideTop" fill="hsl(var(--destructive))" fontSize={12}/>
                                        </ReferenceLine>
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-4">
                         <Button onClick={handleAnalyzeStrategy} disabled={isLoading}>
                              {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Strategy...</>
                              ) : (
                                <><BrainCircuit className="mr-2 h-4 w-4" />AI Analyze Current Strategy</>
                              )}
                        </Button>
                    </CardFooter>
                </Card>

                 {(isLoading || error || aiResponse) && (
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><BrainCircuit className="text-primary"/>AI Strategic Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <p>AI is analyzing the scenario...</p>
                                </div>
                            )}
                             {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {aiResponse && (
                                <Alert className="border-primary bg-primary/5">
                                    <AlertTitle className="text-primary text-lg">{aiResponse.headline}</AlertTitle>
                                    <AlertDescription className="space-y-4 mt-2">
                                       <p className="text-base">{aiResponse.detailedAnalysis}</p>
                                       <div>
                                           <h4 className="font-semibold text-foreground mb-2">Key Strategic Factors Considered:</h4>
                                           <div className="flex flex-wrap gap-2">
                                              {aiResponse.keyFactors.map((factor, index) => (
                                                  <Badge key={index} variant="secondary">{factor}</Badge>
                                              ))}
                                           </div>
                                       </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}

                 <div className="lg:col-span-3">
                    <MonopolyChart data={mockMonopolyData} className="shadow-lg" />
                 </div>
            </div>
        </div>
    );
}
