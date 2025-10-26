"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, Droplets, Wind, CloudRain, Gauge } from 'lucide-react';

const indianCities = [
    "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur",
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"
];

const mockWeatherData = {
    temperature: "28°C",
    humidity: "75%",
    wind: "12 km/h",
    precipitation: "5%",
};

const mockAqiData = {
    value: 78,
    level: "Moderate",
};

export function CityData() {
  const [selectedCity, setSelectedCity] = React.useState(indianCities[0]);

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
        <div>
            <h3 className="text-base font-medium mb-2 text-accent">Current Weather</h3>
            <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <Thermometer className="w-6 h-6 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-lg font-semibold">{mockWeatherData.temperature}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <Droplets className="w-6 h-6 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="text-lg font-semibold">{mockWeatherData.humidity}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <Wind className="w-6 h-6 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">Wind</p>
                        <p className="text-lg font-semibold">{mockWeatherData.wind}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <CloudRain className="w-6 h-6 text-accent" />
                    <div>
                        <p className="text-sm text-muted-foreground">Precipitation</p>
                        <p className="text-lg font-semibold">{mockWeatherData.precipitation}</p>
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
                    <p className="text-lg font-semibold">{mockAqiData.value} - <span className="text-base font-normal">{mockAqiData.level}</span></p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
