'use server';
/**
 * @fileOverview An AI agent that suggests optimal crops to plant based on location, soil conditions, and weather patterns.
 *
 * - aiCropSuggestion - A function that handles the crop suggestion process.
 * - AICropSuggestionInput - The input type for the aiCropSuggestion function.
 * - AICropSuggestionOutput - The return type for the aiCropSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICropSuggestionInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm.'),
  soilConditions: z.string().describe('The conditions of the soil, including type and nutrients.'),
  weatherPatterns: z.string().describe('The historical and current weather patterns of the location.'),
});
export type AICropSuggestionInput = z.infer<typeof AICropSuggestionInputSchema>;

const AICropSuggestionOutputSchema = z.object({
  suggestedCrops: z
    .string()
    .describe('A list of suggested crops to plant, based on the input parameters.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the crop suggestions, explaining why these crops are optimal.'),
});
export type AICropSuggestionOutput = z.infer<typeof AICropSuggestionOutputSchema>;

export async function aiCropSuggestion(input: AICropSuggestionInput): Promise<AICropSuggestionOutput> {
  return aiCropSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCropSuggestionPrompt',
  input: {schema: AICropSuggestionInputSchema},
  output: {schema: AICropSuggestionOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the location, soil conditions, and weather patterns provided, suggest the optimal crops to plant.

Location: {{{location}}}
Soil Conditions: {{{soilConditions}}}
Weather Patterns: {{{weatherPatterns}}}

Consider the following factors when making your suggestions:

*   Suitability of the crop to the location's climate
*   Nutrient requirements of the crop and availability in the soil
*   Historical weather data and potential risks

Suggested Crops: 
Reasoning:`, // Ensure that the LLM outputs the suggested crops and reasoning.
});

const aiCropSuggestionFlow = ai.defineFlow(
  {
    name: 'aiCropSuggestionFlow',
    inputSchema: AICropSuggestionInputSchema,
    outputSchema: AICropSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
