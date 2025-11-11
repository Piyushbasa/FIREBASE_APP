
import { z } from 'zod';

export const AnalyzeSatelliteImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A satellite or drone image of a farm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().optional().describe('The type of crop planted in the field, if known.'),
  language: z.string().optional().default('English').describe('The language for the response.'),
});
export type AnalyzeSatelliteImageInput = z.infer<typeof AnalyzeSatelliteImageInputSchema>;

export const AnalyzeSatelliteImageOutputSchema = z.object({
  imageDescription: z.string().describe("A one-sentence overview of what is visible in the image."),
  cropHealth: z.string().describe("An assessment of the overall crop health. (e.g., 'Vigorous growth', 'Signs of moderate stress')."),
  waterStress: z.string().describe("An assessment of water distribution and potential stress. (e.g., 'Evenly hydrated', 'Evidence of dry patches')."),
  anomalyDetection: z.string().describe("Identification of any anomalies like pest infestations, nutrient deficiencies, or irrigation problems."),
  actionableRecommendations: z.array(z.string()).length(3).describe("A list of three clear, actionable recommendations for the farmer based on the analysis."),
});
export type AnalyzeSatelliteImageOutput = z.infer<typeof AnalyzeSatelliteImageOutputSchema>;
