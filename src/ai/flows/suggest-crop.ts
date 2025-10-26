'use server';
/**
 * @fileOverview An AI agent that suggests optimal crops to plant based on various agricultural parameters.
 *
 * - suggestCrop - A function that handles the crop suggestion process.
 * - SuggestCropInput - The input type for the suggestCrop function.
 * - SuggestCropOutput - The return type for the suggestCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCropInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm.'),
  soilType: z.string().describe('The type of soil (e.g., Loam, Clay, Sandy).'),
  season: z.string().describe('The current season (e.g., Spring, Summer, Autumn, Winter).'),
  temperature: z.string().describe('The current or average temperature (e.g., "25°C").'),
  weatherAlerts: z.string().describe('Any active weather alerts (e.g., "Heatwave warning", "None").'),
  fieldLength: z.coerce.number().optional(),
  fieldWidth: z.coerce.number().optional(),
});
export type SuggestCropInput = z.infer<typeof SuggestCropInputSchema>;

const SuggestCropOutputSchema = z.object({
  suggestedCrops: z
    .array(z.object({
        name: z.string().describe('The name of the suggested crop.'),
        reasoning: z.string().describe('The reasoning for suggesting this crop.'),
    }))
    .describe('A list of suggested crops to plant.'),
  plantingAdvice: z.string().describe('General advice for planting the suggested crops.'),
});
export type SuggestCropOutput = z.infer<typeof SuggestCropOutputSchema>;

export async function suggestCrop(input: SuggestCropInput): Promise<SuggestCropOutput> {
  return suggestCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCropPrompt',
  input: {schema: SuggestCropInputSchema},
  output: {schema: SuggestCropOutputSchema},
  prompt: `You are an expert agricultural advisor with a specialization in Indian agriculture. Based on the parameters provided, suggest optimal crops to plant. Provide a short reasoning for each suggestion and some general planting advice.

Location: {{{location}}}
Soil Type: {{{soilType}}}
Season: {{{season}}}
Temperature: {{{temperature}}}
Weather Alerts: {{{weatherAlerts}}}
{{#if fieldLength}}
Field Dimensions: {{{fieldLength}}}m x {{{fieldWidth}}}m
{{/if}}

Consider factors like climate suitability for Indian regions, soil compatibility, local water availability, and resilience to weather conditions. If field dimensions are provided, you can optionally factor that into your advice.
`,
});

const suggestCropFlow = ai.defineFlow(
  {
    name: 'suggestCropFlow',
    inputSchema: SuggestCropInputSchema,
    outputSchema: SuggestCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
