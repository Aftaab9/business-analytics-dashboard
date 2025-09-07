'use server';
/**
 * @fileOverview An AI agent for analyzing competitive pricing strategies.
 *
 * This file defines a Genkit flow that uses AI to provide strategic advice
 * based on pricing inputs in a competitive market, simulating game theory concepts.
 */

import { ai } from '@/ai/genkit';
import type { GeneratePricingStrategyInput, GeneratePricingStrategyOutput } from '@/types';
import { GeneratePricingStrategyInputSchema, GeneratePricingStrategyOutputSchema } from '@/types';


export async function generatePricingStrategy(
  input: GeneratePricingStrategyInput
): Promise<GeneratePricingStrategyOutput> {
  return generatePricingStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePricingStrategyPrompt',
  input: { schema: GeneratePricingStrategyInputSchema },
  output: { schema: GeneratePricingStrategyOutputSchema },
  prompt: `You are an expert business strategist with a deep understanding of microeconomics and game theory. Your task is to analyze a competitive pricing scenario and provide a strategic recommendation.

Analyze the scenario based on the following information:

Market Structure: {{marketType}}
Our Price: \${{ourPrice}}
Competitor's Price: \${{competitorPrice}}
Market Scenario: {{scenario}}

**Scenario Descriptions:**
- **rational**: Competitors are logical. Customers are price-sensitive. Products are similar. This is classic Bertrand competition.
- **price_war**: Competitors will aggressively match or undercut any price drop you make. A race to the bottom is likely.
- **brand_loyal**: Your customers have high brand loyalty and are less sensitive to price increases. Your product has perceived differentiation.

**Your Task:**
1.  **Generate a Headline:** Write a sharp, one-sentence headline that captures the essence of your strategic advice for the *given scenario*.
2.  **Provide Detailed Analysis:** Write a paragraph explaining the likely outcome of this pricing decision *within the context of the selected scenario*. Discuss the specific trade-offs (e.g., market share vs. profit margin).
3.  **Identify Key Factors:** List the key game theory or economic concepts at play *relevant to this specific scenario*.

**Example for Our Price = $90, Competitor Price = $100, Scenario = 'price_war':**
{
  "headline": "Warning: Undercutting in a price war scenario will likely trigger immediate retaliation, eroding profit margins for all.",
  "detailedAnalysis": "While setting our price at $90 seems advantageous, the 'Price War' scenario dictates that the competitor will not let this stand. They are expected to immediately match or beat our price, initiating a downward spiral. This move sacrifices long-term profitability for a fleeting moment of market share gain. The focus should shift from aggressive pricing to non-price competition or holding the current price to signal a desire to avoid mutual destruction.",
  "keyFactors": ["Price War Trigger", "Retaliatory Pricing", "Profit Margin Erosion", "First-Mover Disadvantage"]
}

**Example for Our Price = $120, Competitor Price = $100, Scenario = 'brand_loyal':**
{
  "headline": "Leverage brand loyalty to command a price premium, capturing higher margins from your dedicated customer base.",
  "detailedAnalysis": "In a 'High Brand Loyalty' scenario, pricing at $120 is a viable strategy. Your loyal customers are less likely to switch to the competitor despite their lower price, allowing you to capture a significant profit margin on each sale. While you may concede some market share among the most price-sensitive consumers, the increased profitability from your core audience will likely offset this. This strategy banks on the strength of your brand and product differentiation.",
  "keyFactors": ["Price Inelasticity", "Brand Equity", "Profit Maximization", "Market Segmentation"]
}
`,
});

const generatePricingStrategyFlow = ai.defineFlow(
  {
    name: 'generatePricingStrategyFlow',
    inputSchema: GeneratePricingStrategyInputSchema,
    outputSchema: GeneratePricingStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
