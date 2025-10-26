"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, Droplets, Wind, CloudRain, Gauge, Siren, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fetchWeatherData } from "@/app/actions";
import type { WeatherDataOutput } from "@/ai/flows/get-weather-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const indianCities = [
    // Andhra Pradesh
    "Visakhapatnam", "Vijayawada", "Tirupati",
    // Arunachal Pradesh
    "Itanagar",
    // Assam
    "Guwahati", "Dibrugarh",
    // Bihar
    "Patna", "Gaya",
    // Chhattisgarh
    "Raipur", "Bhilai",
    // Goa
    "Panaji",
    // Gujarat
    "Ahmedabad", "Surat", "Vadodara", "Rajkot",
    // Haryana
    "Faridabad", "Gurugram",
    // Himachal Pradesh
    "Shimla",
    // Jharkhand
    "Ranchi", "Jamshedpur",
    // Karnataka
    "Bangalore", "Mysore", "Mangalore",
    // Kerala
    "Thiruvananthapuram", "Kochi", "Kozhikode",
    // Madhya Pradesh
    "Indore", "Bhopal", "Jabalpur",
    // Maharashtra
    "Mumbai", "Pune", "Nagpur", "Nashik",
    // Manipur
    "Imphal",
    // Meghalaya
    "Shillong",
    // Mizoram
    "Aizawl",
    // Nagaland
    "Kohima", "Dimapur",
    // Odisha
    "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur",
    // Punjab
    "Ludhiana", "Amritsar",
    // Rajasthan
    "Jaipur", "Jodhpur", "Udaipur",
    // Sikkim
    "Gangtok",
    // Tamil Nadu
    "Chennai", "Coimbatore", "Madurai",
    // Telangana
    "Hyderabad", "Warangal",
    // Tripura
    "Agartala",
    // Uttar Pradesh
    "Lucknow", "Kanpur", "Agra", "Varanasi",
    // Uttarakhand
    "Dehradun", "Haridwar",
    // West Bengal
    "Kolkata", "Asansol", "Siliguri",
    // Union Territories
    "Delhi", "Chandigarh", "Puducherry", "Srinagar", "Jammu", "Leh", "Port Blair"
].sort();

export function CityData({ defaultCity }: { defaultCity?: string }) {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = React.useState(defaultCity || indianCities.find(c => c === "Bhubaneswar") || indianCities[0]);
  const [weatherData, setWeatherData] = React.useState<WeatherDataOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (defaultCity) {
      setSelectedCity(defaultCity);
    }
  }, [defaultCity]);

  const getWeatherData = React.useCallback(async (city: string) => {
    if (!city) {
      setIsLoading(false);
      return;
    };
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

  const isAlertActive = weatherData && weatherData.alert.alert.toLowerCase() !== 'no critical alerts' && weatherData.alert.alert.toLowerCase() !== 'none';
  const hasAdvice = isAlertActive && weatherData.alert.whatToDo && weatherData.alert.whatNotToDo;

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
        <CardDescription>{selectedCity || 'Select a city to see data'}, India</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
            <div className="space-y-6">
                 <div>
                    <h3 className="text-base font-medium mb-2 text-primary">Current Weather</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                        <Skeleton className="h-[68px] rounded-lg" />
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-medium mb-2 text-primary">Air Quality Index (AQI)</h3>
                    <Skeleton className="h-[72px] rounded-lg" />
                </div>
                <div>
                    <h3 className="text-base font-medium mb-2 text-primary">Weather Alerts</h3>
                    <Skeleton className="h-[72px] rounded-lg" />
                </div>
            </div>
        )}

        {weatherData && !isLoading && (
          <>
            <div>
                <h3 className="text-base font-medium mb-2 text-primary">Current Weather</h3>
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
                <h3 className="text-base font-medium mb-2 text-primary">Air Quality Index (AQI)</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                    <Gauge className="w-8 h-8 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">AQI Value</p>
                        <p className="text-lg font-semibold">{weatherData.aqi.value} - <span className="text-base font-normal">{weatherData.aqi.level}</span></p>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-base font-medium mb-2 text-primary">Weather Alerts</h3>
                <div className={`flex items-center gap-4 p-4 rounded-lg ${isAlertActive ? 'bg-destructive/20' : 'bg-secondary/50'}`}>
                    <Siren className={`w-8 h-8 ${isAlertActive ? 'text-destructive' : 'text-accent'}`} />
                    <div>
                        <p className="text-sm text-muted-foreground">Active Alert</p>
                        <p className="text-lg font-semibold">{weatherData.alert.alert}</p>
                    </div>
                </div>
            </div>

            {hasAdvice && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/20">
                  <ThumbsUp className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-400">What to Do</h4>
                    <p className="text-sm text-muted-foreground">{weatherData.alert.whatToDo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/20">
                  <ThumbsDown className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-400">What Not to Do</h4>
                    <p className="text-sm text-muted-foreground">{weatherData.alert.whatNotToDo}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && !weatherData && (
             <div className="text-center p-4 border rounded-lg bg-secondary/50">
                <p className="text-muted-foreground">Please select a city to view weather data.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
