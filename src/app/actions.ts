'use server';

import { suggestCrop, SuggestCropInput, SuggestCropOutput } from '@/ai/flows/suggest-crop';
import { getWeatherData, WeatherDataInput, WeatherDataOutput } from '@/ai/flows/get-weather-data';
import { assistant, AssistantInput, AssistantOutput } from '@/ai/flows/assistant-flow';
import { getCommodityPrices, CommodityPricesInput, CommodityPricesOutput } from '@/ai/flows/commodity-price-tracking';


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

export async function fetchWeatherData(input: WeatherDataInput): Promise<{ data: WeatherDataOutput | null; error: string | null }> {
    try {
        const result = await getWeatherData(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to fetch weather data: ${errorMessage}` };
    }
}

export async function askAssistant(input: AssistantInput): Promise<{ data: AssistantOutput | null; error: string | null }> {
    try {
        const result = await assistant(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to ask assistant: ${errorMessage}` };
    }
}

export async function fetchCommodityPrices(input: CommodityPricesInput): Promise<{ data: CommodityPricesOutput | null; error: string | null }> {
    try {
        const result = await getCommodityPrices(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to fetch commodity prices: ${errorMessage}` };
    }
}
