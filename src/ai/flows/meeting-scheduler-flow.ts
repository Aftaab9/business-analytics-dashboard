'use server';
/**
 * @fileOverview An AI agent for drafting meeting invitation emails.
 *
 * This file defines the server-side Genkit flow for processing a natural language
 * request to schedule a meeting, draft an invitation email, and create calendar details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { DraftMeetingEmailInput, DraftMeetingEmailOutput } from '@/types/meeting-scheduler';
import { DraftMeetingEmailInputSchema, DraftMeetingEmailOutputSchema } from '@/types/meeting-scheduler';


export async function draftMeetingEmail(
  input: DraftMeetingEmailInput
): Promise<DraftMeetingEmailOutput> {
  return draftMeetingEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftMeetingEmailPrompt',
  input: {schema: DraftMeetingEmailInputSchema},
  output: {schema: DraftMeetingEmailOutputSchema},
  prompt: `You are an expert executive assistant AI. Your task is to parse a user's request to schedule a meeting and draft a professional email invitation. You also need to extract structured data to create a calendar appointment.

Current Date: ${new Date().toISOString()}

User's Request: "{{userPrompt}}"

Based on the user's request, perform the following actions:
1.  Identify the recipient's email address.
2.  Create a clear and professional subject line.
3.  Write the email body. The tone should be professional but friendly. Clearly state the purpose and suggest a meeting time or ask for availability. End the email with "Sincerely," followed by the sender's name and company.
4.  The sender's name is: {{senderName}}. The company name is "InsightFlow".
5.  Generate a concise title for the calendar appointment.
6.  Determine a plausible date and time for the appointment based on the prompt. If the prompt is vague (e.g., "next week"), pick a reasonable day and time.
7.  Set the meeting link to the required placeholder URL.`,
});

const draftMeetingEmailFlow = ai.defineFlow(
  {
    name: 'draftMeetingEmailFlow',
    inputSchema: DraftMeetingEmailInputSchema,
    outputSchema: DraftMeetingEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
