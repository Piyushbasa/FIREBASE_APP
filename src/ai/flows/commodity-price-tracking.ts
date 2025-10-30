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
  location: z.string().describe('The location for which to retrieve commodity prices. Can be a state (e.g., Odisha) or "all India" for a national summary.'),
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
      price: z.string().describe('The current price of the commodity.'),
      unit: z.string().describe('The unit of measurement for the price (e.g., INR/quintal).'),
      market: z.string().describe('The market (mandi) where this price was recorded.'),
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
  prompt: `You are an expert agricultural economist specializing in Indian markets. Your task is to retrieve the current price for each of the following commodities.

For each commodity, provide a single, representative price from a major mandi (market).

If the location is "all India", provide a representative national price.

If a specific Indian state is provided, retrieve a representative price from a main market within that state.

Use real, up-to-date Indian market data and price units like INR per quintal.

The user's preferred language is {{{language}}}. You MUST provide the commodity name and market in this language if appropriate, but keep the price and unit in standard format.

Location: {{{location}}}
Commodities: {{#each commodities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide the prices in a structured JSON format, including the commodity name, a single price, unit of measurement, and the market (mandi) it was sourced from.
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
