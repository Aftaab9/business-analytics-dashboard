'use server';
/**
 * @fileOverview An AI agent for generating a comprehensive business analysis report.
 *
 * - generateBusinessAnalysis - A function that creates a detailed business report.
 * - BusinessAnalysisInput - The input type for the generateBusinessAnalysis function.
 * - BusinessAnalysisOutput - The return type for the generateBusinessAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessAnalysisInputSchema = z.object({
  keyMetrics: z.object({
    totalRevenue: z.number().describe('The total revenue for the period.'),
    totalExpenses: z.number().describe('The total expenses for the period.'),
    netProfit: z.number().describe('The net profit for the period.'),
    profitMargin: z.string().describe('The profit margin, e.g., "25.5%".'),
  }),
  inventoryMetrics: z.object({
      totalStockValue: z.number().describe('The total monetary value of all inventory.'),
      atRiskItemsCount: z.number().describe('The number of inventory items considered at-risk (e.g., low stock).'),
      stockTurnoverRate: z.number().describe('The stock turnover rate.'),
  }),
  salesMetrics: z.object({
      totalSalesYTD: z.number().describe('The total sales value year-to-date.'),
      topPerformer: z.string().describe('The name of the top-performing sales representative.'),
      conversionRate: z.string().describe('The sales conversion rate, e.g., "15.2%".'),
  }),
  period: z.string().describe("The period the summary is for, e.g., 'Q2 2024', 'Last 12 Months'"),
});
export type BusinessAnalysisInput = z.infer<typeof BusinessAnalysisInputSchema>;

const BusinessAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe('A high-level overview of the entire report, written for an executive audience.'),
  financialAnalysis: z.string().describe('A detailed analysis of the financial performance, including profitability and expense management.'),
  operationalAnalysis: z.string().describe('An analysis of operational efficiency, focusing on inventory and supply chain metrics.'),
  salesAndMarketAnalysis: z.string().describe('An analysis of sales performance and market position.'),
  strategicRecommendations: z.string().describe('A list of actionable recommendations and solutions for business improvement based on the analyses.'),
});
export type BusinessAnalysisOutput = z.infer<typeof BusinessAnalysisOutputSchema>;

export async function generateBusinessAnalysis(
  input: BusinessAnalysisInput
): Promise<BusinessAnalysisOutput> {
  return generateBusinessAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessAnalysisPrompt',
  input: {schema: BusinessAnalysisInputSchema},
  output: {schema: BusinessAnalysisOutputSchema},
  prompt: `You are a professional business analyst consultant. Your task is to write a comprehensive business analysis report for the period: {{{period}}}.

The report should be structured, insightful, and provide clear, actionable recommendations. Do not use markdown formatting, use plain text paragraphs.

Based on the following data:

## Key Financial Metrics:
- Total Revenue: {{{keyMetrics.totalRevenue}}}
- Total Expenses: {{{keyMetrics.totalExpenses}}}
- Net Profit: {{{keyMetrics.netProfit}}}
- Profit Margin: {{{keyMetrics.profitMargin}}}

## Inventory & Operational Metrics:
- Total Stock Value: {{{inventoryMetrics.totalStockValue}}}
- At-Risk Items Count: {{{inventoryMetrics.atRiskItemsCount}}}
- Stock Turnover Rate: {{{inventoryMetrics.stockTurnoverRate}}}

## Sales & Market Metrics:
- Total Sales (YTD): {{{salesMetrics.totalSalesYTD}}}
- Top Performer: {{{salesMetrics.topPerformer}}}
- Conversion Rate: {{{salesMetrics.conversionRate}}}

Generate the full report with the following sections:

1.  **Executive Summary:** A concise, high-level summary of the key findings and overall business health. (3-4 sentences)
2.  **Financial Analysis:** Analyze the financial data. Discuss profitability, revenue streams, and cost structure. What do the numbers say about the company's financial stability and performance?
3.  **Operational Analysis:** Analyze the inventory metrics. Discuss inventory value, potential risks from at-risk items, and the efficiency indicated by the turnover rate.
4.  **Sales and Market Analysis:** Analyze the sales data. Discuss the performance of the sales team, the effectiveness of the sales funnel (conversion rate), and what the top performer indicates.
5.  **Strategic Recommendations:** Based on ALL the analysis above, provide a few concrete, actionable solutions for how the business can improve. These should be strategic and address the identified weaknesses or opportunities. For example, if profit margin is low, suggest cost-control measures. If at-risk inventory is high, suggest inventory management strategies.
`,
});

const generateBusinessAnalysisFlow = ai.defineFlow(
  {
    name: 'generateBusinessAnalysisFlow',
    inputSchema: BusinessAnalysisInputSchema,
    outputSchema: BusinessAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
