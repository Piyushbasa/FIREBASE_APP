'use server';

/**
 * @fileOverview A commodity price tracking AI agent.
 *
 * - getCommodityPrices - A function that handles the retrieval of commodity prices for a specific location.
 * - CommodityPricesInput - The input type for the getCommodityPrices function.
 * - CommodityPricesOutput - The return type for the getCommodityPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommodityPricesInputSchema = z.object({
  location: z.string().describe('The location for which to retrieve commodity prices. Can be a city, district, state (e.g., Odisha), or "all India" for a national summary.'),
  commodities: z
    .array(z.string())
    .describe('The commodities for which to retrieve prices (e.g., rice, wheat, cotton).'),
  language: z.string().optional().default('English').describe('The language for the response.'),
});
export type CommodityPricesInput = z.infer<typeof CommodityPricesInputSchema>;

const CommodityPricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      commodity: z.string().describe('The name of the commodity.'),
      market: z.string().describe('The specific, named market (mandi) where this price was recorded.'),
      unit: z.string().describe("The unit for all prices (e.g., 'per quintal'). The price value should be in INR."),
      priceTiers: z.object({
        low: z.string().describe("The price for the low-quality or fair average quality (FAQ) grade. Should be a string representing a number, e.g., '1800'."),
        medium: z.string().describe("The price for the medium-quality grade. Should be a string representing a number, e.g., '2000'."),
        high: z.string().describe("The price for the high-quality or finest grade. Should be a string representing a number, e.g., '2200'."),
      }).describe('An object containing prices for different quality tiers.')
    })
  ),
});
export type CommodityPricesOutput = z.infer<typeof CommodityPricesOutputSchema>;

export async function getCommodityPrices(input: CommodityPricesInput): Promise<CommodityPricesOutput> {
  return commodityPriceTrackingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commodityPriceTrackingPrompt',
  input: {schema: CommodityPricesInputSchema},
  output: {schema: CommodityPricesOutputSchema},
  prompt: `You are an expert agricultural economist and real-time data service specializing in Indian markets. Your task is to retrieve the current market price for each of the following commodities.

Your response MUST be based on real, up-to-date data from a specific, named major mandi (market).

- If a state is provided (e.g., "Odisha"), retrieve a representative price from a main market within that state (e.g., "Bhubaneswar Mandi").
- If a city or district is provided, use the main mandi in that specific location.
- If the location is "all India", provide a representative national price from a major market (e.g., "Delhi Azadpur Mandi").

For each commodity, provide prices for three quality tiers: low, medium, and high.

The user's preferred language is {{{language}}}. You MUST provide the commodity name and market in this language if appropriate, but keep the price and unit in standard format (INR per unit).

Location: {{{location}}}
Commodities: {{#each commodities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide the prices in a structured JSON format, including the commodity name, the specific market name, unit, and an object with prices for 'low', 'medium', and 'high' quality tiers.
`,
});

const commodityPriceTrackingFlow = ai.defineFlow(
  {
    name: 'commodityPriceTrackingFlow',
    inputSchema: CommodityPricesInputSchema,
    outputSchema: CommodityPricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
