import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Droplets, ShieldCheck } from 'lucide-react';

export function PlantHealthCard() {
  return (
    <Card className="relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1587334274328-64186a82393d?q=80&w=1974&auto=format&fit=crop"
        alt="Watering a plant"
        fill
        className="object-cover -z-10"
        data-ai-hint="watering plant"
      />
       <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10">
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
      </div>
    </Card>
  );
}
