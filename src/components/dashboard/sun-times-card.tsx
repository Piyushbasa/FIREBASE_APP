
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
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-orange-500/10 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200">
            <div className="p-3 bg-white/50 rounded-full">
                <Sunrise className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-sm font-medium">Sunrise</p>
            <p className="text-2xl font-bold">6:05 AM</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-indigo-500/10 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200">
           <div className="p-3 bg-white/50 rounded-full">
                <Sunset className="w-10 h-10 text-indigo-500" />
            </div>
            <p className="text-sm font-medium">Sunset</p>
            <p className="text-2xl font-bold">8:30 PM</p>
        </div>
      </CardContent>
    </Card>
  );
}
