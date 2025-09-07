// src/ai/flows/executive-summary.ts
'use server';
/**
 * @fileOverview A flow for generating an executive summary based on key metrics and trends.
 *
 * - generateExecutiveSummary - A function that generates an executive summary.
 * - GenerateExecutiveSummaryInput - The input type for the generateExecutiveSummary function.
 * - GenerateExecutiveSummaryOutput - The return type for the generateExecutiveSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExecutiveSummaryInputSchema = z.object({
  keyMetrics: z.object({
    totalRevenue: z.number().describe('The total revenue for the period.'),
    totalExpenses: z.number().describe('The total expenses for the period.'),
    netProfit: z.number().describe('The net profit for the period.'),
    profitMargin: z.string().describe('The profit margin, e.g., "25.5%".'),
  }),
  observedTrends: z.array(z.string()).describe("Brief descriptions of key observed trends, e.g., 'Revenue increased by 10% this quarter', 'New product line performing well'"),
  period: z.string().describe("The period the summary is for, e.g., 'Q2 2024', 'Last 12 Months'"),
});
export type GenerateExecutiveSummaryInput = z.infer<
  typeof GenerateExecutiveSummaryInputSchema
>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('The executive summary of the report, highlighting key insights based on the provided metrics and trends.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<
  typeof GenerateExecutiveSummaryOutputSchema
>;

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: {schema: GenerateExecutiveSummaryInputSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: `You are an executive assistant helping a manager generate an executive summary for the period: {{{period}}}.

Based on the following data:

Key Metrics:
- Total Revenue: {{{keyMetrics.totalRevenue}}}
- Total Expenses: {{{keyMetrics.totalExpenses}}}
- Net Profit: {{{keyMetrics.netProfit}}}
- Profit Margin: {{{keyMetrics.profitMargin}}}

Observed Trends:
{{#each observedTrends}}
- {{{this}}}
{{/each}}

Generate a concise executive summary (around 3-5 sentences) highlighting the most important insights and findings from this data. Focus on performance and key takeaways.`,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
