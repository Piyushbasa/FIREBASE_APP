'use server';

import { getCommodityPrices, CommodityPricesInput, CommodityPricesOutput } from '@/ai/flows/commodity-price-tracking';
import { suggestCrop, SuggestCropInput, SuggestCropOutput } from '@/ai/flows/suggest-crop';

export async function fetchCommodityPrices(input: CommodityPricesInput): Promise<{ data: CommodityPricesOutput | null; error: string | null }> {
  try {
    if (!input.location || input.commodities.length === 0) {
        return { data: null, error: 'Please provide a location and select at least one commodity.' };
    }
    const result = await getCommodityPrices(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to fetch commodity prices: ${errorMessage}` };
  }
}

export async function fetchCropSuggestion(input: SuggestCropInput): Promise<{ data: SuggestCropOutput | null; error: string | null }> {
  try {
    const result = await suggestCrop(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to fetch crop suggestion: ${errorMessage}` };
  }
}
