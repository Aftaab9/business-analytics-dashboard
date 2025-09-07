// Financial Forecasting Flow
'use server';

/**
 * @fileOverview An AI agent for financial forecasting.
 *
 * - forecastFinancials - A function that handles the financial forecasting process.
 * - FinancialForecastingInput - The input type for the forecastFinancials function.
 * - FinancialForecastingOutput - The return type for the forecastFinancials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialForecastingInputSchema = z.object({
  historicalSales: z
    .array(
      z.object({
        date: z.string().describe("Date of the sales data, e.g., YYYY-MM"),
        salesValue: z.number().describe("Total sales value for that period."),
      })
    )
    .describe('A time series of historical sales data, aggregated by period (e.g., monthly).'),
  marketTrends: z
    .string()
    .describe('Description of current market trends and conditions.'),
  forecastHorizon: z
    .string()
    .describe('The forecast horizon, e.g., next quarter, next year.'),
});
export type FinancialForecastingInput = z.infer<typeof FinancialForecastingInputSchema>;

const ImpactFactorSchema = z.object({
    factor: z.string().describe("The specific market trend or factor identified from the user's input."),
    impactType: z.enum(['Positive', 'Negative', 'Neutral']).describe("The type of impact this factor is likely to have."),
    impactStrength: z.enum(['High', 'Medium', 'Low']).describe("The qualitative strength of the factor's impact."),
    reasoning: z.string().describe("A brief explanation of why this factor has the predicted impact."),
});

const FinancialForecastingOutputSchema = z.object({
  revenueForecast: z.string().describe('The predicted future revenue.'),
  expenseForecast: z.string().describe('The AI-estimated future expenses based on revenue forecast and market trends.'),
  profitForecast: z.string().describe('The AI-estimated future profit based on revenue and expense forecasts.'),
  forecastCommentary: z.string().describe('General commentary on the financial outlook, including reasoning for the forecast.'),
  impactAnalysis: z.array(ImpactFactorSchema).describe("An analysis of how the provided market trends affect the forecast.")
});
export type FinancialForecastingOutput = z.infer<typeof FinancialForecastingOutputSchema>;

export async function generateFinancialForecastWithImpact(
  input: FinancialForecastingInput
): Promise<FinancialForecastingOutput> {
  return forecastFinancialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialForecastingPrompt',
  input: {schema: FinancialForecastingInputSchema},
  output: {schema: FinancialForecastingOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to create a financial forecast and analyze the impact of market trends.

Based on the provided historical sales data and market trends, forecast the future revenue, expenses, and profit for the given horizon.

Then, perform an impact analysis on the 'marketTrends' text provided. Identify each distinct economic or business factor mentioned. For each factor, determine if its impact on the business's performance will be Positive, Negative, or Neutral. Assess the strength of the impact as High, Medium, or Low. Provide a brief reasoning for your analysis of each factor.

Historical Sales Data:
{{#each historicalSales}}
- Period: {{date}}, Sales: {{salesValue}}
{{/each}}

Market Trends Text to Analyze:
"{{{marketTrends}}}"

Forecast Horizon:
{{{forecastHorizon}}}

Instructions:
1.  Analyze historical sales to identify trends.
2.  Generate a Revenue Forecast, Expense Forecast, and Profit Forecast with numerical estimates and reasoning.
3.  Carefully analyze the Market Trends text and populate the 'impactAnalysis' array.
4.  Offer a general Forecast Commentary.
`,
});

const forecastFinancialsFlow = ai.defineFlow(
  {
    name: 'generateFinancialForecastWithImpactFlow',
    inputSchema: FinancialForecastingInputSchema,
    outputSchema: FinancialForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
