
'use server';
/**
 * @fileOverview An AI agent that estimates carbon sequestration for a farm.
 *
 * - getCarbonSequestration - A function that calculates carbon sequestration.
 * - CarbonSequestrationInput - The input type for the function.
 * - CarbonSequestrationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { CarbonSequestrationInputSchema, CarbonSequestrationOutputSchema, type CarbonSequestrationInput, type CarbonSequestrationOutput } from '@/ai/schemas/carbon-tracking-schema';

export async function getCarbonSequestration(input: CarbonSequestrationInput): Promise<CarbonSequestrationOutput> {
    return carbonTrackingFlow(input);
}

const prompt = ai.definePrompt({
    name: 'carbonSequestrationPrompt',
    input: { schema: CarbonSequestrationInputSchema },
    output: { schema: CarbonSequestrationOutputSchema },
    prompt: `You are an expert in soil science and sustainable agriculture, specializing in carbon sequestration.
Your task is to estimate the annual carbon sequestration in tons of CO2 equivalent for a farm based on the provided data.
Your entire response MUST be in the user's preferred language: {{{language}}}.

Crop Type: {{{cropType}}}
Field Size: {{{fieldSize}}} acres
Practices: {{#each practices}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Base your estimation on these general principles:
-   A standard farm with conventional tilling might sequester a baseline of 0.1 tons of CO2e per acre per year.
-   **No-Till Farming**: Adds ~0.3-0.6 tons/acre/year.
-   **Cover Cropping**: Adds ~0.2-0.5 tons/acre/year.
-   **Crop Rotation**: Adds ~0.1-0.3 tons/acre/year.
-   **Agroforestry** (if mentioned): Adds ~1.0-2.0 tons/acre/year.
-   **Composting** (if mentioned): Adds ~0.2-0.4 tons/acre/year.

Calculate the total sequestration by adding the impact of each practice to a baseline and multiplying by the field size.
Then, provide a brief, positive analysis of their efforts and suggest one additional practice they could adopt.

Example: For a 10-acre wheat farm using No-Till and Cover Cropping:
-   Baseline (0.1) + No-Till (0.4) + Cover Cropping (0.3) = 0.8 tons/acre.
-   Total: 0.8 * 10 acres = 8.0 tons CO2e/year.
-   Analysis: "Great job implementing sustainable practices! Your farm is making a positive impact. Consider adding crop rotation to further boost soil health and carbon capture."

Ensure the final output is a valid JSON object.
`,
});

const carbonTrackingFlow = ai.defineFlow(
  {
    name: 'carbonTrackingFlow',
    inputSchema: CarbonSequestrationInputSchema,
    outputSchema: CarbonSequestrationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    