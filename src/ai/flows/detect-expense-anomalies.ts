'use server';
/**
 * @fileOverview An AI agent for detecting anomalies in expense transactions.
 *
 * - detectExpenseAnomalies - A function that handles the expense anomaly detection process.
 * - DetectExpenseAnomaliesInput - The input type for the detectExpenseAnomalies function.
 * - DetectExpenseAnomaliesOutput - The return type for the detectExpenseAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseTransactionSchema = z.object({
  id: z.string().describe('The unique ID of the transaction.'),
  date: z.string().describe('The date of the transaction (ISO format).'),
  amount: z.number().describe('The monetary value of the transaction.'),
  category: z.string().describe('The category of the expense (e.g., Travel, Meals, Software).'),
  description: z.string().describe('A description of the expense.'),
  vendor: z.string().describe('The vendor or merchant.'),
});

const DetectExpenseAnomaliesInputSchema = z.object({
  transactions: z.array(ExpenseTransactionSchema).describe('A list of expense transactions to analyze.'),
});
export type DetectExpenseAnomaliesInput = z.infer<
  typeof DetectExpenseAnomaliesInputSchema
>;

const AnomalySchema = z.object({
    transactionId: z.string().describe('The ID of the anomalous transaction.'),
    reason: z.string().describe('A detailed explanation of why the transaction is considered an anomaly.'),
    severity: z.enum(['High', 'Medium', 'Low']).describe('The severity level of the anomaly.'),
});

const DetectExpenseAnomaliesOutputSchema = z.object({
    anomalies: z.array(AnomalySchema).describe('A list of detected anomalies.'),
});
export type DetectExpenseAnomaliesOutput = z.infer<
  typeof DetectExpenseAnomaliesOutputSchema
>;

export async function detectExpenseAnomalies(
  input: DetectExpenseAnomaliesInput
): Promise<DetectExpenseAnomaliesOutput> {
  return detectExpenseAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectExpenseAnomaliesPrompt',
  input: {schema: DetectExpenseAnomaliesInputSchema},
  output: {schema: DetectExpenseAnomaliesOutputSchema},
  prompt: `You are an expert fraud detection analyst and financial auditor. Your task is to analyze a list of expense transactions and identify any anomalies.

An anomaly could be:
- An unusually high or low amount for a specific category.
- Expenses filed on non-business days (weekends) without clear justification.
- Vague or suspicious descriptions or vendors.
- Duplicate transactions (though you should focus on other types of anomalies for this task).
- Anything that deviates significantly from a standard pattern of corporate expenses.

Analyze the following transactions and identify any that are anomalous. For each anomaly, provide the transaction ID, a clear reason for your suspicion, and a severity level. If there are no anomalies, return an empty list.

Transactions:
{{#each transactions}}
- ID: {{id}}, Date: {{date}}, Amount: {{amount}}, Category: {{category}}, Vendor: "{{vendor}}", Description: "{{description}}"
{{/each}}
`,
});

const detectExpenseAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectExpenseAnomaliesFlow',
    inputSchema: DetectExpenseAnomaliesInputSchema,
    outputSchema: DetectExpenseAnomaliesOutputSchema,
  },
  async input => {
    if (input.transactions.length === 0) {
        return { anomalies: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
