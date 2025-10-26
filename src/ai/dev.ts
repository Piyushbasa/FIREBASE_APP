import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-crop.ts';
import '@/ai/flows/get-weather-data.ts';
import '@/ai/flows/assistant-flow.ts';
import '@/ai/flows/commodity-price-tracking.ts';
import '@/ai/flows/diagnose-plant-flow.ts';
