
// src/ai/flows/product-demand-forecast.ts
'use server';
/**
 * @fileOverview An AI agent for product-specific demand forecasting.
 *
 * - forecastProductDemand - A function that handles the product demand forecasting process.
 * - ProductDemandForecastInput - The input type for the forecastProductDemand function.
 * - ProductDemandForecastOutput - The return type for the forecastProductDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSalesDataSchema = z.object({
  date: z.string().describe("Date of the sales data, e.g., YYYY-MM"),
  quantitySold: z.number().describe("Total quantity sold for that period."),
});

const ProductDemandForecastInputSchema = z.object({
  productId: z.string().describe('The ID or StockCode of the product to forecast.'),
  productName: z.string().describe('The name/description of the product.'),
  historicalProductSales: z
    .array(ProductSalesDataSchema)
    .describe('A time series of historical sales data (quantity sold) for the specific product, aggregated by period (e.g., monthly).'),
  marketTrends: z
    .string()
    .optional()
    .describe('General market trends or specific factors affecting this product (e.g., upcoming promotions, competitor actions).'),
  forecastHorizon: z
    .string()
    .describe('The forecast horizon, e.g., next month, next quarter, next 6 months.'),
});
export type ProductDemandForecastInput = z.infer<typeof ProductDemandForecastInputSchema>;

const ForecastedDemandPointSchema = z.object({
    period: z.string().describe("The future period for the forecast (e.g., '2024-09', 'Next Month')"),
    predictedQuantity: z.number().describe("The forecasted quantity for that period.")
});

const ProductDemandForecastOutputSchema = z.object({
  productId: z.string().describe('The ID or StockCode of the product forecasted.'),
  productName: z.string().describe('The name/description of the product.'),
  forecastedDemand: z.array(ForecastedDemandPointSchema).describe('An array of predicted future demand quantities for the product over the horizon.'),
  commentary: z.string().describe('General commentary on the demand outlook, including reasoning, assumptions, or potential influencing factors.'),
  confidenceLevel: z.string().optional().describe("An optional qualitative confidence level in the forecast (e.g., High, Medium, Low).")
});
export type ProductDemandForecastOutput = z.infer<typeof ProductDemandForecastOutputSchema>;

export async function forecastProductDemand(
  input: ProductDemandForecastInput
): Promise<ProductDemandForecastOutput> {
  return forecastProductDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productDemandForecastPrompt',
  input: {schema: ProductDemandForecastInputSchema},
  output: {schema: ProductDemandForecastOutputSchema},
  prompt: `You are an expert inventory demand planner. Based on the provided historical sales data for a specific product and any relevant market trends, forecast the future demand (quantity to be sold) for this product.

Product ID: {{{productId}}}
Product Name: {{{productName}}}

Historical Sales Data (quantity sold per period):
{{#each historicalProductSales}}
- Period: {{date}}, Quantity Sold: {{quantitySold}}
{{/each}}

{{#if marketTrends}}
Market Trends/Specific Factors:
{{{marketTrends}}}
{{else}}
No specific market trends provided for this product beyond its historical sales.
{{/if}}

Forecast Horizon:
{{{forecastHorizon}}}

Instructions:
1. Analyze the historical sales data for the product ({{{productName}}}) to identify trends, seasonality, and sales velocity.
2. If market trends are provided, consider their potential impact on future demand for this specific product.
3. Generate a series of forecasted demand points (period and predicted quantity) for the specified forecast horizon.
4. Provide commentary explaining your forecast, including any assumptions made, seasonality noted, or specific factors considered.
5. Optionally, provide a qualitative confidence level for your forecast (e.g., High, Medium, Low).

Output the product ID and name along with the forecast.
`,
});

const forecastProductDemandFlow = ai.defineFlow(
  {
    name: 'forecastProductDemandFlow',
    inputSchema: ProductDemandForecastInputSchema,
    outputSchema: ProductDemandForecastOutputSchema,
  },
  async input => {
    if (input.historicalProductSales.length === 0) {
        return {
            productId: input.productId,
            productName: input.productName,
            forecastedDemand: [],
            commentary: `Cannot generate forecast for ${input.productName} (ID: ${input.productId}) as no historical sales data was provided. At least one sales data point is required.`,
            confidenceLevel: "N/A"
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

