import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Current Weather
        </CardTitle>
        <p className="text-sm text-muted-foreground">Napa Valley, CA</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <Thermometer className="w-6 h-6 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="text-lg font-semibold">72°F</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <Droplets className="w-6 h-6 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-lg font-semibold">45%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <Wind className="w-6 h-6 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Wind Speed</p>
            <p className="text-lg font-semibold">8 mph</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <CloudRain className="w-6 h-6 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Precipitation</p>
            <p className="text-lg font-semibold">0%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
