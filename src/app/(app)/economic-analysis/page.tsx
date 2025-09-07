// src/app/(app)/economic-analysis/page.tsx
'use client';

import { AdAsChart } from "@/components/charts/ad-as-chart";
import { DemandSupplyChart } from "@/components/charts/demand-supply-chart";
import { MonopolyChart } from "@/components/charts/monopoly-chart";
import { PhillipsCurveChart } from "@/components/charts/phillips-curve-chart";
import { mockMonopolyData, mockPhillipsCurveData } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EconomicAnalysisPage() {
    const demandSupplyData = Array.from({ length: 101 }, (_, i) => {
        const quantity = i * 10;
        const demand = 100 - 0.8 * quantity;
        const supply = 20 + 0.2 * quantity;
        const equilibrium = (quantity === 80) ? 36 : null; // D=S at Q=80, P=36
        return { quantity, demand, supply, equilibrium };
    });

     const adAsData = Array.from({ length: 101 }, (_, i) => {
        const output = 500000 + i * 10000;
        const ad = 120 - 0.00005 * output;
        const sras = 50 + 0.00002 * output;
        let equilibrium = null;
        // Find approximate equilibrium where AD=SRAS: 120 - 5e-5*O = 50 + 2e-5*O => 70 = 7e-5*O => O = 1,000,000
        if (output === 1000000) {
            equilibrium = 70;
        }
        return { output, ad, sras, equilibrium };
    });

    // Add trendline to Phillips Curve data
    const phillipsWithTrend = mockPhillipsCurveData.map(p => ({...p, trend: 10 - p.unemployment * 0.9 }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-semibold text-foreground">
                        Economic Analysis Models
                    </h2>
                    <p className="text-muted-foreground">
                        Interactive economic models to understand market dynamics and strategic positioning.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DemandSupplyChart data={demandSupplyData} className="shadow-lg" />
                <AdAsChart data={adAsData} className="shadow-lg" />
                <PhillipsCurveChart data={phillipsWithTrend} className="shadow-lg" />
                <MonopolyChart data={mockMonopolyData} className="shadow-lg" />
            </div>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">How to Use These Models</CardTitle>
                    <CardDescription>
                        These economic models are powerful tools for strategic decision-making.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">For Strategic Pricing:</h4>
                        <p className="text-sm text-muted-foreground">
                            Use the <strong>Demand & Supply</strong> and <strong>Monopoly</strong> charts to understand price elasticity and find the optimal price point that maximizes revenue without sacrificing demand.
                        </p>
                    </div>
                     <div>
                        <h4 className="font-semibold">For Macroeconomic Context:</h4>
                        <p className="text-sm text-muted-foreground">
                           The <strong>AD-AS</strong> and <strong>Phillips Curve</strong> charts provide a high-level view of the economy. Use them to anticipate how inflation, unemployment, and overall economic output might impact your business performance and investment strategy.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
