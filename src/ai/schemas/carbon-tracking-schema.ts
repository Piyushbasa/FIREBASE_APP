
import { z } from 'zod';

export const CarbonSequestrationInputSchema = z.object({
  cropType: z.string().describe('The primary type of crop being grown (e.g., Wheat, Rice, Cotton).'),
  fieldSize: z.coerce.number().describe('The size of the field in acres.'),
  practices: z.array(z.string()).describe('A list of sustainable farming practices being used (e.g., "no-till", "cover-cropping").'),
  language: z.string().optional().default('English').describe('The language for the response.'),
});
export type CarbonSequestrationInput = z.infer<typeof CarbonSequestrationInputSchema>;

export const CarbonSequestrationOutputSchema = z.object({
  estimatedSequestration: z.coerce.number().describe('The estimated tons of CO2 equivalent sequestered per year. This should be a positive number.'),
  analysis: z.string().describe('A brief, encouraging analysis of the carbon impact and a suggestion for improvement. (1-2 sentences)'),
});
export type CarbonSequestrationOutput = z.infer<typeof CarbonSequestrationOutputSchema>;

    