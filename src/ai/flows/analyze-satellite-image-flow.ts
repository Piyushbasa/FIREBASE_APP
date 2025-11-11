
'use server';
/**
 * @fileOverview An AI agent that analyzes satellite or drone imagery of a farm.
 *
 * - analyzeSatelliteImage - A function that provides an analysis of a farm image.
 * - AnalyzeSatelliteImageInput - The input type for the function.
 * - AnalyzeSatelliteImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { 
    AnalyzeSatelliteImageInputSchema, 
    AnalyzeSatelliteImageOutputSchema, 
    type AnalyzeSatelliteImageInput, 
    type AnalyzeSatelliteImageOutput 
} from '@/ai/schemas/analyze-satellite-image-schema';


export async function analyzeSatelliteImage(input: AnalyzeSatelliteImageInput): Promise<AnalyzeSatelliteImageOutput> {
  return analyzeSatelliteImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSatelliteImagePrompt',
  input: { schema: AnalyzeSatelliteImageInputSchema },
  output: { schema: AnalyzeSatelliteImageOutputSchema },
  prompt: `You are an expert remote sensing agronomist. Your task is to analyze a satellite or drone image of a farm field and provide a detailed analysis for the farmer.
Your entire response MUST be in the user's preferred language: {{{language}}}.

Image: {{media url=imageDataUri}}
{{#if cropType}}
Crop Type: {{{cropType}}}
{{/if}}

Based on the image, provide the following analysis:
1.  **Image Description**: Briefly describe the image in one sentence.
2.  **Crop Health**: Analyze the vegetation color and density to assess overall health. Look for variations in greenness.
3.  **Water Stress**: Identify areas that may be under-watered (lighter/browner patches) or over-watered (dark, saturated patches).
4.  **Anomaly Detection**: Pinpoint any specific problem areas, such as patterns suggesting pest damage, disease spread, or equipment malfunction (e.g., irrigation lines).
5.  **Actionable Recommendations**: Provide three concise and practical recommendations. For example, "Investigate the circular patch in the northeast corner for potential pest activity," or "Increase irrigation in the southern section where the crop appears lighter."

Return the analysis in a structured JSON format.
`,
});

const analyzeSatelliteImageFlow = ai.defineFlow(
  {
    name: 'analyzeSatelliteImageFlow',
    inputSchema: AnalyzeSatelliteImageInputSchema,
    outputSchema: AnalyzeSatelliteImageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
