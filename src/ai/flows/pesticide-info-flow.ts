'use server';
/**
 * @fileOverview An AI agent that provides information and calculations for pesticides.
 *
 * - getPesticideInfo - A function that recommends pesticides based on crop, pest, and field size.
 * - PesticideInfoInput - The input type for the getPesticideInfo function.
 * - PesticideInfoOutput - The return type for the getPesticideInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PesticideInfoInputSchema = z.object({
  crop: z.string().describe('The specific crop that needs treatment (e.g., Rice, Cotton, Tomato).'),
  pestOrDisease: z.string().describe('The name of the pest or disease to be controlled (e.g., Aphids, Powdery Mildew, Bollworm).'),
  fieldArea: z.coerce.number().describe('The area of the field in acres.'),
  language: z.string().optional().default('English').describe('The language for the response.'),
});
export type PesticideInfoInput = z.infer<typeof PesticideInfoInputSchema>;

const PesticideInfoOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      pesticideName: z.string().describe('The commercial name of the recommended pesticide.'),
      chemicalName: z.string().describe('The active chemical ingredient in the pesticide.'),
      type: z.enum(['Insecticide', 'Fungicide', 'Herbicide', 'Organic']).describe('The type of pesticide.'),
      applicationRate: z.string().describe("The recommended application rate per acre (e.g., '500 ml/acre', '2 kg/acre')."),
      totalAmount: z.string().describe('The total calculated amount of pesticide needed for the specified field area (e.g., \'2.5 liters\', \'10 kg\').'),
      safetyPrecautions: z.string().describe('A brief summary of key safety precautions to follow during application.'),
    })
  ).describe('A list of suitable pesticide recommendations.'),
});
export type PesticideInfoOutput = z.infer<typeof PesticideInfoOutputSchema>;


export async function getPesticideInfo(input: PesticideInfoInput): Promise<PesticideInfoOutput> {
    return pesticideInfoFlow(input);
}


const prompt = ai.definePrompt({
    name: 'pesticideInfoPrompt',
    input: { schema: PesticideInfoInputSchema },
    output: { schema: PesticideInfoOutputSchema },
    prompt: `You are an expert agricultural entomologist and plant pathologist specializing in Indian farming conditions.
Your task is to provide pesticide recommendations for a given crop, pest/disease, and field area.
Your entire response MUST be in the user's preferred language: {{{language}}}.

Crop: {{{crop}}}
Pest or Disease: {{{pestOrDisease}}}
Field Area: {{{fieldArea}}} acres

Based on this information, provide 2-3 suitable and commonly available pesticide recommendations in India.
For each recommendation, you must provide:
1.  **Pesticide Name**: The commercial brand name.
2.  **Chemical Name**: The active chemical ingredient.
3.  **Type**: Classify it as Insecticide, Fungicide, Herbicide, or Organic.
4.  **Application Rate**: The standard rate per acre (e.g., ml/acre, kg/acre).
5.  **Total Amount**: Calculate the total amount of the product needed for the user's specified field area. Provide this in a user-friendly unit (e.g., liters, kg).
6.  **Safety Precautions**: Summarize the most critical safety precautions (e.g., "Wear gloves and a mask," "Do not spray during windy conditions").

Return the recommendations in a structured JSON format. Ensure the calculations are accurate.
`,
});

const pesticideInfoFlow = ai.defineFlow(
  {
    name: 'pesticideInfoFlow',
    inputSchema: PesticideInfoInputSchema,
    outputSchema: PesticideInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
