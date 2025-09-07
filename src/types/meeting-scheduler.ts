import {z} from 'genkit';

export const DraftMeetingEmailInputSchema = z.object({
  userPrompt: z.string().describe('The user\'s natural language request to schedule a meeting. For example: "Draft an email to sales@example.com to schedule a Q4 planning session for next week."'),
  senderName: z.string().describe("The name of the person sending the email, who is the logged-in user."),
});
export type DraftMeetingEmailInput = z.infer<typeof DraftMeetingEmailInputSchema>;


export const DraftMeetingEmailOutputSchema = z.object({
  recipientEmail: z.string().describe("The recipient's email address, extracted from the prompt."),
  subject: z.string().describe("A concise and professional subject line for the meeting invitation email."),
  body: z.string().describe("The full, professionally written body of the email. It should be friendly and clearly state the purpose of the meeting. It MUST end with a sign-off including the sender's name and company."),
  appointmentTitle: z.string().describe("A title for the calendar appointment, derived from the meeting's purpose."),
  appointmentDate: z.string().describe("The proposed date for the meeting in YYYY-MM-DD format. If the prompt specifies a relative date (e.g., 'next week'), calculate a plausible future date."),
  appointmentTime: z.string().describe("A plausible proposed time for the meeting in HH:MM format (e.g., 10:00, 14:30)."),
  meetingLink: z.string().describe("A placeholder for the meeting link. This should always be 'https://meet.google.com/new-meeting-placeholder'."),
});
export type DraftMeetingEmailOutput = z.infer<typeof DraftMeetingEmailOutputSchema>;
