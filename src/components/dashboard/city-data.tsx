
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, Droplets, Wind, CloudRain, Gauge, Siren, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fetchWeatherData } from "@/app/actions";
import type { WeatherDataOutput } from "@/ai/flows/get-weather-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const indianCities = [
    // Andhra Pradesh
    "Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Kakinada", "Anantapur", "Eluru",
    // Arunachal Pradesh
    "Itanagar", "Tawang",
    // Assam
    "Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur",
    // Bihar
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga",
    // Chhattisgarh
    "Raipur", "Bhilai", "Bilaspur", "Korba",
    // Goa
    "Panaji", "Margao", "Vasco da Gama",
    // Gujarat
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
    // Haryana
    "Faridabad", "Gurugram", "Panipat", "Ambala", "Hisar", "Rohtak",
    // Himachal Pradesh
    "Shimla", "Manali", "Dharamshala", "Solan",
    // Jharkhand
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    // Karnataka
    "Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", "Gulbarga",
    // Kerala
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam",
    // Madhya Pradesh
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar",
    // Maharashtra
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur",
    // Manipur
    "Imphal",
    // Meghalaya
    "Shillong",
    // Mizoram
    "Aizawl",
    // Nagaland
    "Kohima", "Dimapur",
    // Odisha
    "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore",
    // Punjab
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
    // Rajasthan
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer",
    // Sikkim
    "Gangtok",
    // Tamil Nadu
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
    // Telangana
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
    // Tripura
    "Agartala",
    // Uttar Pradesh
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Ghaziabad", "Noida",
    // Uttarakhand
    "Dehradun", "Haridwar", "Nainital", "Rishikesh",
    // West Bengal
    "Kolkata", "Asansol", "Siliguri", "Durgapur",
    // Union Territories
    "New Delhi", "Delhi", "Chandigarh", "Puducherry", "Srinagar", "Jammu", "Leh", "Port Blair", "Kavaratti", "Daman"
];

const uniqueIndianCities = [...new Set(indianCities)].sort();


export function CityData({ defaultCity, userLanguage }: { defaultCity?: string; userLanguage?: string }) {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = React.useState(defaultCity || uniqueIndianCities.find(c => c === "Bhubaneswar") || uniqueIndianCities[0]);
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
    const result = await fetchWeatherData({ city, language: userLanguage || 'English' });
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
  }, [toast, userLanguage]);

  React.useEffect(() => {
    getWeatherData(selectedCity);
  }, [selectedCity, getWeatherData]);

  const isAlertActive = weatherData && weatherData.alert.alert.toLowerCase() !== 'no critical alerts' && weatherData.alert.alert.toLowerCase() !== 'none';
  const hasAdvice = isAlertActive && weatherData.alert.whatToDo && weatherData.alert.whatNotToDo;
  
  const getAqiColorClass = (value: number) => {
    if (value <= 50) return 'text-green-500';
    if (value <= 100) return 'text-yellow-500';
    if (value <= 150) return 'text-orange-500';
    if (value <= 200) return 'text-red-500';
    if (value <= 300) return 'text-purple-500';
    return 'text-rose-700';
  };

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
                {uniqueIndianCities.map(city => (
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
                     <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                        <Thermometer className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p className="text-lg font-semibold">{weatherData.weather.temperature}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10">
                        <Droplets className="w-6 h-6 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                            <p className="text-lg font-semibold">{weatherData.weather.humidity}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-500/10">
                        <Wind className="w-6 h-6 text-gray-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Wind</p>
                            <p className="text-lg font-semibold">{weatherData.weather.wind}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10">
                        <CloudRain className="w-6 h-6 text-cyan-500" />
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
                    <Gauge className={cn("w-8 h-8", getAqiColorClass(weatherData.aqi.value))} />
                    <div>
                        <p className="text-sm text-muted-foreground">AQI Value</p>
                        <p className="text-lg font-semibold">{weatherData.aqi.value} - <span className="text-base font-normal">{weatherData.aqi.level}</span></p>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="text-base font-medium mb-2 text-primary">Weather Alerts</h3>
                <div className={`flex items-center gap-4 p-4 rounded-lg ${isAlertActive ? 'bg-destructive/20' : 'bg-secondary/50'}`}>
                    <Siren className={`w-8 h-8 ${isAlertActive ? 'text-destructive' : 'text-accent-foreground'}`} />
                    <div>
                        <p className="text-sm text-muted-foreground">Active Alert</p>
                        <p className="text-lg font-semibold">{weatherData.alert.alert}</p>
                    </div>
                </div>
            </div>

            {hasAdvice && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/20">
                  <ThumbsUp className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300">What to Do</h4>
                    <p className="text-sm text-muted-foreground">{weatherData.alert.whatToDo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-red-500/20">
                  <ThumbsDown className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300">What Not to Do</h4>
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
