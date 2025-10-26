'use server';

/**
 * @fileOverview An AI agent that fetches real-time weather, AQI, and alerts for a given city.
 *
 * - getWeatherData - A function that handles the retrieval of weather data.
 * - WeatherDataInput - The input type for the getWeatherData function.
 * - WeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WeatherDataInputSchema = z.object({
  city: z.string().describe('The city for which to retrieve weather data.'),
});
export type WeatherDataInput = z.infer<typeof WeatherDataInputSchema>;

const WeatherDataOutputSchema = z.object({
  weather: z.object({
    temperature: z.string().describe('The current temperature in Celsius.'),
    humidity: z.string().describe('The current humidity percentage.'),
    wind: z.string().describe('The current wind speed in km/h.'),
    precipitation: z.string().describe('The current precipitation percentage chance.'),
  }),
  aqi: z.object({
    value: z.number().describe('The Air Quality Index value.'),
    level: z.string().describe('The description of the AQI level (e.g., Good, Moderate, Unhealthy).'),
  }),
  alert: z.object({
    alert: z.string().describe('The active weather alert. Should be "None" if there are no alerts.'),
    source: z.string().describe('The source of the alert (e.g., IMD).'),
  }),
});
export type WeatherDataOutput = z.infer<typeof WeatherDataOutputSchema>;

export async function getWeatherData(input: WeatherDataInput): Promise<WeatherDataOutput> {
  return getWeatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherDataPrompt',
  input: { schema: WeatherDataInputSchema },
  output: { schema: WeatherDataOutputSchema },
  prompt: `You are a real-time weather and environmental data service for India.
Your task is to retrieve the current weather conditions, Air Quality Index (AQI), and any active weather alerts for the specified Indian city.
Use the most up-to-date information available from official sources like the IMD (Indian Meteorological Department).

City: {{{city}}}

Provide the data in a structured JSON format.
- For weather, provide temperature, humidity, wind, and precipitation.
- For AQI, provide the numerical value and a descriptive level.
- For alerts, provide the specific, active alert message (e.g., "Heavy rainfall warning", "Heatwave conditions expected"). If there are no active alerts, the alert message should be "None".
`,
});

const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: WeatherDataInputSchema,
    outputSchema: WeatherDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
