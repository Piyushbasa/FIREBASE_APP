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
  location: z.string().describe('The location for which to retrieve commodity prices.'),
  commodities: z
    .array(z.string())
    .describe('The commodities for which to retrieve prices (e.g., rice, corn, grapes, potatoes, olives).'),
});
export type CommodityPricesInput = z.infer<typeof CommodityPricesInputSchema>;

const CommodityPricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      commodity: z.string().describe('The name of the commodity.'),
      price: z.string().describe('The current price of the commodity.'),
      unit: z.string().describe('The unit of measurement for the price (e.g., INR/quintal).'),
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
  prompt: `You are an expert agricultural economist specializing in Indian markets. Your task is to retrieve the current prices for the following commodities in the specified location. If the location is in India, use Indian market data (e.g., from mandis) and price units like INR per quintal. Make reasonable assumptions if the location is not specific enough.

Location: {{{location}}}
Commodities: {{#each commodities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide the prices in a structured JSON format, including the commodity name, price, and unit of measurement.
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
