
'use client';
import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Leaf, Thermometer, Droplets, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function LiveFieldMonitorPreview() {
    const [temp, setTemp] = React.useState(24.2);
    const [moisture, setMoisture] = React.useState(55);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTemp(prevTemp => parseFloat((prevTemp + (Math.random() - 0.5) * 0.2).toFixed(1)));
            setMoisture(prevMoisture => Math.max(0, Math.min(100, Math.round(prevMoisture + (Math.random() - 0.5) * 2))));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Link href="/tools" className="block hover:shadow-lg transition-shadow rounded-lg">
            <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-6 h-6 text-primary" />
                            Live Field Monitor
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription>Real-time soil sensor data preview. Click to see more.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-md border bg-secondary/30">
                        <h4 className="font-semibold text-primary flex items-center gap-1 mb-2">
                            <Thermometer size={16} /> Temperature
                        </h4>
                        <p className="text-3xl font-bold">{temp}°C</p>
                    </div>
                    <div className="p-4 rounded-md border bg-secondary/30">
                        <h4 className="font-semibold text-primary flex items-center gap-1 mb-2">
                            <Droplets size={16} /> Soil Moisture
                        </h4>
                        <p className="text-3xl font-bold">{moisture}%</p>
                        <Progress value={moisture} className="h-2 mt-2" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

    