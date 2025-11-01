'use server';

import { suggestCrop, SuggestCropInput, SuggestCropOutput } from '@/ai/flows/suggest-crop';
import { getWeatherData, WeatherDataInput, WeatherDataOutput } from '@/ai/flows/get-weather-data';
import { assistant, AssistantInput, AssistantOutput } from '@/ai/flows/assistant-flow';
import { getCommodityPrices, CommodityPricesInput, CommodityPricesOutput } from '@/ai/flows/commodity-price-tracking';
import { diagnosePlant, DiagnosePlantInput, DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { getPesticideInfo, PesticideInfoInput, PesticideInfoOutput } from '@/ai/flows/pesticide-info-flow';
import { getQuizQuestion, QuizQuestionInput, QuizQuestionOutput } from '@/ai/flows/quiz-flow';


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

export async function diagnosePlantAction(input: DiagnosePlantInput): Promise<{ data: DiagnosePlantOutput | null; error: string | null }> {
    try {
        const result = await diagnosePlant(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to diagnose plant: ${errorMessage}` };
    }
}

export async function fetchPesticideInfo(input: PesticideInfoInput): Promise<{ data: PesticideInfoOutput | null; error: string | null }> {
    try {
        const result = await getPesticideInfo(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to fetch pesticide info: ${errorMessage}` };
    }
}

export async function fetchQuizQuestion(input: QuizQuestionInput): Promise<{ data: QuizQuestionOutput | null; error: string | null }> {
    try {
        const result = await getQuizQuestion(input);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { data: null, error: `Failed to fetch quiz question: ${errorMessage}` };
    }
}
