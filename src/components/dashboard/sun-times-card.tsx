import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sunrise, Sunset } from 'lucide-react';

export function SunTimesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Sunrise & Sunset
        </CardTitle>
        <CardDescription>Plan your day effectively</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/50">
          <Sunrise className="w-10 h-10 text-accent" />
          <p className="text-sm text-muted-foreground">Sunrise</p>
          <p className="text-2xl font-bold">6:05 AM</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/50">
          <Sunset className="w-10 h-10 text-accent" />
          <p className="text-sm text-muted-foreground">Sunset</p>
          <p className="text-2xl font-bold">8:30 PM</p>
        </div>
      </CardContent>
    </Card>
  );
}
