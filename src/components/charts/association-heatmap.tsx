// src/components/charts/association-heatmap.tsx
"use client"

import { useMemo } from 'react';
import type { AssociationRule } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AssociationHeatmapProps {
    rules: AssociationRule[];
    className?: string;
    title: string;
    description: string;
}

// Helper to get color based on confidence. Using primary color's HSL values.
// Primary H: 282, S: 100%
const getBackgroundColor = (confidence: number) => {
    if (confidence === 0) return 'hsl(var(--background))';
    const lightness = 95 - (confidence * 54); // from 95% (light) to 41% (primary)
    return `hsl(282, 100%, ${lightness}%)`;
};

const getTextColor = (confidence: number) => {
    return confidence > 0.6 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))';
};

export function AssociationHeatmap({ rules, className, title, description }: AssociationHeatmapProps) {
    const { items, matrix } = useMemo(() => {
        const itemSet = new Set<string>();
        rules.forEach(rule => {
            rule.antecedents.forEach(item => itemSet.add(item));
            rule.consequents.forEach(item => itemSet.add(item));
        });

        const items = Array.from(itemSet).sort();

        const matrix = new Map<string, number>();
        rules.forEach(rule => {
            const key = `${rule.antecedents.join(',')}_${rule.consequents.join(',')}`;
            matrix.set(key, rule.confidence);
        });

        return { items, matrix };
    }, [rules]);

    return (
        <div className={className}>
            <h3 className="text-lg font-semibold font-headline mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <TooltipProvider>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className='bg-muted'>
                                <th className="border-b p-2 sticky left-0 z-10 bg-muted">If You Buy...</th>
                                {items.map(item => (
                                    <th key={item} className="p-1 border-b font-normal text-muted-foreground h-28 w-12">
                                        <div className='transform -rotate-45 origin-bottom-left ml-3 whitespace-nowrap'>{item}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(antecedent => (
                                <tr key={antecedent} className="hover:bg-muted/50">
                                    <td className="border-r p-2 font-semibold bg-muted sticky left-0 z-10">{antecedent}</td>
                                    {items.map(consequent => {
                                        if (antecedent === consequent) {
                                            return <td key={consequent} className="border-b border-r bg-muted/50"></td>;
                                        }
                                        const key = `${antecedent}_${consequent}`;
                                        const confidence = matrix.get(key) || 0;
                                        const bgColor = getBackgroundColor(confidence);
                                        const textColor = getTextColor(confidence);

                                        return (
                                            <td key={consequent} className="border-b border-r p-0 text-center transition-colors font-medium" style={{ backgroundColor: bgColor }}>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger className="w-full h-full p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring" style={{ color: textColor }}>
                                                        {confidence > 0 ? `${(confidence * 100).toFixed(0)}%` : ''}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>If a customer buys <strong>{antecedent}</strong>,</p>
                                                        <p>there is a <strong>{(confidence * 100).toFixed(0)}% chance</strong></p>
                                                        <p>they also buy <strong>{consequent}</strong>.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TooltipProvider>
            <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How to read this heatmap?</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>This heatmap shows the "confidence" that a customer will buy one item if they've already bought another.</li>
                            <li><strong>Rows (If You Buy...):</strong> The item already in the customer's cart.</li>
                            <li><strong>Columns:</strong> The item they might buy next.</li>
                            <li><strong>Color Intensity:</strong> Darker purple cells indicate a higher probability (higher confidence). Hover over a cell for details.</li>
                            <li><strong>Example:</strong> Find a dark cell where the "Mechanical Keyboard" row intersects the "Wireless Mouse" column. This means customers who buy a keyboard are very likely to also buy a mouse.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
