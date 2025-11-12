
import { Card, CardContent } from '@/components/ui/card';
import { Sun } from 'lucide-react';

export function WeatherCard() {
  return (
    <Card className="bg-secondary border-0">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="bg-white p-2 rounded-lg">
           <Sun className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="flex-1">
            <p className="text-3xl font-bold">35°C</p>
            <p className="text-sm text-muted-foreground">Sunny</p>
        </div>
      </CardContent>
    </Card>
  );
}
