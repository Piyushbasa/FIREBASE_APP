'use server';

/**
 * @fileOverview An AI agent that fetches real-time weather, AQI, and alerts for a given city.
 *
 * - getWeatherData - A function that handles the retrieval of weather data.
 * - WeatherDataInput - The input type for the getWeatherData function.
 * - WeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WeatherDataInputSchema = z.object({
  city: z.string().describe('The city for which to retrieve weather data.'),
  language: z.string().optional().default('English').describe('The language for the response.'),
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
    whatToDo: z.string().describe('Actionable advice for farmers on what to do based on the weather alert.'),
    whatNotToDo: z.string().describe('Actionable advice for farmers on what not to do based on the weather alert.'),
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
  prompt: `You are a real-time weather and agricultural advisory service for Indian farmers.
Your primary task is to retrieve current weather conditions, the Air Quality Index (AQI), and any critical weather alerts.
Based on the alert, you must provide actionable advice for farmers on "what to do" and "what not to do".

The user's preferred language is {{{language}}}. You MUST provide your entire response in this language, except for the numerical values for weather and AQI.

Use the most up-to-date information available from official sources like the IMD (Indian Meteorological Department).

City: {{{city}}}

Provide the data in a structured JSON format.
- For weather, provide the current temperature, humidity, wind, and precipitation.
- For AQI, provide the numerical value and a descriptive level.
- For alerts, provide specific, actionable, and timely warnings (e.g., "Cyclone Yaas making landfall in 24 hours", "Heatwave conditions expected for the next 48 hours", "Warning for heavy to very heavy rainfall").
- If there are no critical alerts, the alert message should be "No critical alerts", and the "whatToDo" and "whatNotToDo" fields should be empty strings.
- If there is an alert, provide practical advice. For example, for a heatwave:
  - whatToDo: "Ensure frequent irrigation for crops, especially during early morning or late evening. Provide shade for young or sensitive plants."
  - whatNotToDo: "Avoid spraying pesticides or fertilizers during peak sun hours as it can scorch the plants. Do not perform strenuous fieldwork during midday."
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
