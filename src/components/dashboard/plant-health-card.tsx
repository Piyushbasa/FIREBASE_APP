import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Droplets, ShieldCheck } from 'lucide-react';

export function PlantHealthCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plant Health Status</CardTitle>
        <CardDescription>Current status of your primary crop</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <HeartPulse className="w-8 h-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Current Health</p>
            <p className="text-lg font-semibold">Excellent</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <Droplets className="w-8 h-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Last Watering</p>
            <p className="text-lg font-semibold">Yesterday, 5:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <ShieldCheck className="w-8 h-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Last Pesticides</p>
            <p className="text-lg font-semibold">3 days ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
