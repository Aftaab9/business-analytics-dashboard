'use server';
/**
 * @fileOverview An AI agent for answering natural language business questions.
 *
 * - askBusinessQuestion - A function that handles answering business questions.
 * - AskBusinessQuestionInput - The input type for the function.
 * - AskBusinessQuestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockFinancialData, mockTeamPerformance, mockInventory } from '@/lib/placeholder-data';

const AskBusinessQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s business question in natural language.'),
});
export type AskBusinessQuestionInput = z.infer<typeof AskBusinessQuestionInputSchema>;

const AskBusinessQuestionOutputSchema = z.object({
  answerText: z.string().describe('A direct, natural language answer to the user\'s question.'),
  keyDataPoints: z.array(z.object({
    label: z.string().describe('The name of the data point.'),
    value: z.string().describe('The value of the data point.'),
  })).optional().describe('Key metrics or data points that support the answer.'),
  suggestedChart: z.enum(['None', 'RevenueProfitTrend', 'TeamPerformance', 'StockValueByCategory']).optional().describe('A suggestion for a chart that would best visualize the answer.'),
});
export type AskBusinessQuestionOutput = z.infer<typeof AskBusinessQuestionOutputSchema>;

export async function askBusinessQuestion(
  input: AskBusinessQuestionInput
): Promise<AskBusinessQuestionOutput> {
  return askBusinessQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askBusinessQuestionPrompt',
  input: {schema: AskBusinessQuestionInputSchema},
  output: {schema: AskBusinessQuestionOutputSchema},
  prompt: `You are an expert business analyst AI assistant integrated into a BI dashboard. Your role is to answer a user's business question based on the provided JSON data. You must be concise and direct.

Analyze the user's question: "{{question}}"

Use the following JSON data to formulate your answer. Do not mention the JSON data source in your response.

**Financial Data (monthly):**
${JSON.stringify(mockFinancialData, null, 2)}

**Sales Team Performance:**
${JSON.stringify(mockTeamPerformance, null, 2)}

**Inventory Data:**
${JSON.stringify(mockInventory.slice(0, 5), null, 2)}

**Your Task:**
1.  **Answer the question directly** in the 'answerText' field. Provide a clear, natural language response.
2.  If the answer involves specific numbers, extract them and place them in the 'keyDataPoints' array. For example, if asked for the best sales month, include the month and the revenue figure.
3.  If a chart would help visualize the answer, suggest the most appropriate chart type in 'suggestedChart'.
    - Use 'RevenueProfitTrend' for questions about financials over time.
    - Use 'TeamPerformance' for questions about sales staff.
    - Use 'StockValueByCategory' for questions about inventory.
    - Use 'None' if no chart is relevant.

**Example Question:** "What was our highest revenue month?"
**Example Output:**
{
  "answerText": "The month with the highest revenue was December, reaching $2,800,000.",
  "keyDataPoints": [
    { "label": "Top Month", "value": "December" },
    { "label": "Revenue", "value": "$2,800,000" }
  ],
  "suggestedChart": "RevenueProfitTrend"
}

**Example Question:** "Who is our top sales performer?"
**Example Output:**
{
  "answerText": "The top sales performer is Noah Wilson, with sales of $62,000.",
  "keyDataPoints": [
    { "label": "Top Performer", "value": "Noah Wilson" },
    { "label": "Sales", "value": "$62,000" }
  ],
  "suggestedChart": "TeamPerformance"
}
`,
});

const askBusinessQuestionFlow = ai.defineFlow(
  {
    name: 'askBusinessQuestionFlow',
    inputSchema: AskBusinessQuestionInputSchema,
    outputSchema: AskBusinessQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
