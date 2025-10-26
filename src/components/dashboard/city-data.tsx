"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, Droplets, Wind, CloudRain, Gauge, Siren, Loader2 } from 'lucide-react';
import { fetchWeatherData } from "@/app/actions";
import type { WeatherDataOutput } from "@/ai/flows/get-weather-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const indianCities = [
    "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur",
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"
];

export function CityData() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = React.useState(indianCities[0]);
  const [weatherData, setWeatherData] = React.useState<WeatherDataOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getWeatherData = React.useCallback(async (city: string) => {
    setIsLoading(true);
    setWeatherData(null);
    const result = await fetchWeatherData({ city });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error fetching weather data",
        description: result.error,
      });
    } else {
      setWeatherData(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  React.useEffect(() => {
    getWeatherData(selectedCity);
  }, [selectedCity, getWeatherData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather & Air Quality</span>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {indianCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
          </Select>
        </CardTitle>
        <CardDescription>{selectedCity}, India</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
            <div className="space-y-6">
                 <div>
                    <h3 className="text-base font-medium mb-2 text-accent">Current Weather</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-medium mb-2 text-accent">Air Quality Index (AQI)</h3>
                    <Skeleton className="h-[72px] rounded-lg" />
                </div>
                <div>
                    <h3 className="text-base font-medium mb-2 text-accent">Weather Alerts</h3>
                    <Skeleton className="h-[72px] rounded-lg" />
                </div>
            </div>
        )}

        {weatherData && !isLoading && (
          <>
            <div>
                <h3 className="text-base font-medium mb-2 text-accent">Current Weather</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                        <Thermometer className="w-6 h-6 text-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="text-lg font-semibold">{weatherData.weather.temperature}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                        <Droplets className="w-6 h-6 text-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                            <p className="text-lg font-semibold">{weatherData.weather.humidity}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                        <Wind className="w-6 h-6 text-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Wind</p>
                            <p className="text-lg font-semibold">{weatherData.weather.wind}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                        <CloudRain className="w-6 h-6 text-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Precipitation</p>
                            <p className="text-lg font-semibold">{weatherData.weather.precipitation}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-base font-medium mb-2 text-accent">Air Quality Index (AQI)</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                    <Gauge className="w-8 h-8 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">AQI Value</p>
                        <p className="text-lg font-semibold">{weatherData.aqi.value} - <span className="text-base font-normal">{weatherData.aqi.level}</span></p>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-base font-medium mb-2 text-accent">Weather Alerts</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                    <Siren className="w-8 h-8 text-destructive" />
                    <div>
                        <p className="text-sm text-muted-foreground">Active Alert</p>
                        <p className="text-lg font-semibold">{weatherData.alert.alert}</p>
                    </div>
                </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
