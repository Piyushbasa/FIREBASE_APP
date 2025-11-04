'use server';
/**
 * @fileOverview An AI agent that analyzes simulated field data to provide insights.
 *
 * - analyzeField - A function that provides an analysis of a user's field.
 * - AnalyzeFieldInput - The input type for the analyzeField function.
 * - AnalyzeFieldOutput - The return type for the analyzeField function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeFieldInputSchema = z.object({
  fieldName: z.string().describe("The name of the user's field."),
  vegetationIndex: z.coerce.number().describe('The simulated Normalized Difference Vegetation Index (NDVI) of the field. Ranges from 0 to 1.'),
  moistureLevel: z.coerce.number().describe('The simulated soil moisture percentage.'),
});
export type AnalyzeFieldInput = z.infer<typeof AnalyzeFieldInputSchema>;


const AnalyzeFieldOutputSchema = z.object({
  analysis: z.string().describe("A concise, one or two-sentence summary of the field's current condition."),
  recommendations: z.array(z.string()).length(3).describe("A list of 3 actionable recommendations for the farmer based on the data."),
});
export type AnalyzeFieldOutput = z.infer<typeof AnalyzeFieldOutputSchema>;

export async function analyzeField(input: AnalyzeFieldInput): Promise<AnalyzeFieldOutput> {
  return analyzeFieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFieldPrompt',
  input: { schema: AnalyzeFieldInputSchema },
  output: { schema: AnalyzeFieldOutputSchema },
  prompt: `You are an expert agronomist providing a quick analysis of a farmer's field based on remote sensor data.

Field Name: {{{fieldName}}}
Vegetation Index (NDVI): {{{vegetationIndex}}}
Soil Moisture: {{{moistureLevel}}}%

Based on the data:
1.  Provide a short, easy-to-understand analysis of the field's health. (e.g., "The crop appears healthy but is experiencing some water stress.")
2.  Give three clear, actionable recommendations for the farmer.

-   If NDVI is low (e.g., < 0.65), suggest checking for pests, diseases, or nutrient deficiencies.
-   If NDVI is high (e.g., > 0.8), confirm that the crop is in a healthy growth stage.
-   If moisture is low (e.g., < 50%), recommend irrigation.
-   If moisture is high (e.g., > 70%), warn about potential waterlogging or fungal risks.
-   Combine these insights for a holistic recommendation.
-   Keep the language simple and direct.
`,
});


const analyzeFieldFlow = ai.defineFlow(
  {
    name: 'analyzeFieldFlow',
    inputSchema: AnalyzeFieldInputSchema,
    outputSchema: AnalyzeFieldOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    