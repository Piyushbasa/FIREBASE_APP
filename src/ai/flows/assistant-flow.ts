'use server';
/**
 * @fileOverview A general purpose AI assistant for farming questions.
 *
 * - assistant - A function that handles assistant queries.
 * - AssistantInput - The input type for the assistant function.
 * - AssistantOutput - The return type for the assistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantInputSchema = z.object({
  prompt: z.string().describe('The user\'s question or prompt.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string().describe("The assistant's response."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function assistant(input: AssistantInput): Promise<AssistantOutput> {
  // Pass the current date to the prompt context.
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return assistantFlow({...input, currentDate});
}

// Define an internal schema that includes the currentDate.
const AssistantPromptInputSchema = AssistantInputSchema.extend({
  currentDate: z.string(),
});

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantPromptInputSchema},
  output: {schema: AssistantOutputSchema},
  prompt: `You are a helpful and knowledgeable AI assistant for farmers in India, powered by Gemini.
  Your goal is to provide accurate, concise, and easy-to-understand answers to questions related to Indian agriculture.
  
  Today's date is {{{currentDate}}}. Use this for any time-sensitive queries.

  When answering, cover topics such as:
  - Crop management techniques (sowing, irrigation, harvesting).
  - Pest and disease control, suggesting both chemical and organic solutions.
  - Market prices for various commodities (mentioning that these are estimates if real-time data isn't available through a tool).
  - Details on government schemes and subsidies for farmers.
  - Soil health and fertilization tips.

  Always maintain a supportive and encouraging tone. Keep your responses clear and actionable.

  User query: {{{prompt}}}
  `,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantPromptInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
