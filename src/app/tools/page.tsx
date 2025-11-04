
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FlaskConical, Loader2, Info, ShieldAlert, Thermometer, Droplets, Leaf, Bluetooth, X, Camera } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchPesticideInfo } from '@/app/actions';
import type { PesticideInfoOutput } from "@/ai/flows/pesticide-info-flow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Progress } from "@/components/ui/progress";

const FormSchema = z.object({
  crop: z.string().min(2, { message: "Crop name is required." }),
  pestOrDisease: z.string().min(2, { message: "Pest or disease name is required." }),
  fieldArea: z.coerce.number().min(0.1, { message: "Field area must be at least 0.1 acres." }),
});

type UserProfile = {
  language?: string;
};

// Mock real-time data for the IoT monitor
const initialChartData = [
    { time: '10s ago', temp: 24, moisture: 55, nitrogen: 12 },
    { time: '8s ago', temp: 24.1, moisture: 56, nitrogen: 12.1 },
    { time: '6s ago', temp: 24.2, moisture: 55.5, nitrogen: 12.2 },
    { time: '4s ago', temp: 24.1, moisture: 55, nitrogen: 12.1 },
    { time: '2s ago', temp: 24.3, moisture: 56.5, nitrogen: 12.3 },
];

function LiveFieldMonitor() {
    const [chartData, setChartData] = React.useState(initialChartData);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [bluetoothDevice, setBluetoothDevice] = React.useState<BluetoothDevice | null>(null);
    const simulationIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    const lastDataPoint = chartData[chartData.length - 1];

    const stopSimulation = React.useCallback(() => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
            simulationIntervalRef.current = null;
        }
    }, []);

    const startSimulation = React.useCallback(() => {
        stopSimulation(); // Ensure no multiple intervals are running
        simulationIntervalRef.current = setInterval(() => {
            setChartData(prevData => {
                const lastPoint = prevData[prevData.length - 1];
                const newTemp = parseFloat((lastPoint.temp + (Math.random() - 0.5) * 0.2).toFixed(1));
                const newMoisture = Math.max(0, Math.min(100, Math.round(lastPoint.moisture + (Math.random() - 0.5) * 2)));
                const newNitrogen = parseFloat((lastPoint.nitrogen + (Math.random() - 0.5) * 0.2).toFixed(1));

                const newData = [...prevData.slice(1), {
                    time: 'now',
                    temp: newTemp,
                    moisture: newMoisture,
                    nitrogen: newNitrogen,
                }];
                // Correctly update time labels
                return newData.map((d, i) => ({...d, time: `${(newData.length - 1 - i) * 2}s ago`}));
            });
        }, 2000);
    }, [stopSimulation]);
    
    React.useEffect(() => {
        if (!isConnected) {
            startSimulation();
        }
        return () => stopSimulation();
    }, [isConnected, startSimulation, stopSimulation]);


    const handleNotifications = React.useCallback((event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (!value) return;

        const characteristicUUID = (event.target as BluetoothRemoteGATTCharacteristic).uuid;
        
        let newTemp = chartData[chartData.length - 1].temp;
        let newMoisture = chartData[chartData.length - 1].moisture;

        // Standard UUIDs for Temperature and Humidity
        const tempUUID = '00002a6e-0000-1000-8000-00805f9b34fb';
        const humidityUUID = '00002a6f-0000-1000-8000-00805f9b34fb';

        if (characteristicUUID.includes(tempUUID)) { 
            newTemp = value.getInt16(0, true) / 100;
        } else if (characteristicUUID.includes(humidityUUID)) { 
            newMoisture = value.getUint16(0, true) / 100;
        }

        setChartData(prevData => {
            const lastPoint = prevData[prevData.length - 1];
            const newData = [...prevData.slice(1), {
                time: 'now',
                temp: newTemp,
                moisture: newMoisture,
                nitrogen: lastPoint.nitrogen, // Nitrogen not from standard BT service, keep it from simulation
            }];
            return newData.map((d, i) => ({...d, time: `${(newData.length - 1 - i) * 2}s ago`}));
        });
    }, [chartData]);
    
    const onDisconnected = React.useCallback(() => {
        setIsConnected(false);
        setBluetoothDevice(null);
        toast({ title: "Device Disconnected", description: "The connection to the IoT device was lost." });
    }, [toast]);

    const handleConnect = React.useCallback(async () => {
        if (!navigator.bluetooth) {
            toast({ variant: "destructive", title: "Web Bluetooth not supported", description: "Your browser doesn't support Web Bluetooth. Try Chrome on desktop or Android." });
            return;
        }

        setIsConnecting(true);
        stopSimulation();

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['environmental_sensing'] }],
            });

            if (!device.gatt) {
                throw new Error("GATT server not available.");
            }
            
            setBluetoothDevice(device);
            device.addEventListener('gattserverdisconnected', onDisconnected);
            const server = await device.gatt.connect();
            
            const service = await server.getPrimaryService('environmental_sensing');
            
            const tempChar = await service.getCharacteristic('temperature'); // UUID 0x2A6E
            const humidityChar = await service.getCharacteristic('humidity'); // UUID 0x2A6F

            await tempChar.startNotifications();
            tempChar.addEventListener('characteristicvaluechanged', handleNotifications);
            
            await humidityChar.startNotifications();
            humidityChar.addEventListener('characteristicvaluechanged', handleNotifications);
            
            setIsConnected(true);
            toast({ title: "Connected!", description: `Now receiving data from ${device.name || 'your device'}.` });

        } catch (error: any) {
            toast({ variant: "destructive", title: "Connection Failed", description: error.message || "Could not connect to device. Ensure it's discoverable." });
            startSimulation(); // Restart simulation if connection fails
        } finally {
            setIsConnecting(false);
        }
    }, [toast, stopSimulation, startSimulation, onDisconnected, handleNotifications]);
    

    const handleDisconnect = React.useCallback(() => {
        if (bluetoothDevice && bluetoothDevice.gatt) {
            bluetoothDevice.gatt.disconnect();
        }
    }, [bluetoothDevice]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-primary" />
                        Live Field Monitor
                    </div>
                    <div>
                        {isConnected ? (
                             <Button variant="destructive" onClick={handleDisconnect} size="sm">
                                <X className="mr-2 h-4 w-4" /> Disconnect
                            </Button>
                        ) : (
                            <Button onClick={handleConnect} disabled={isConnecting} size="sm">
                                {isConnecting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Bluetooth className="mr-2 h-4 w-4" />
                                )}
                                Connect Device
                            </Button>
                        )}
                    </div>
                </CardTitle>
                <CardDescription>
                    {isConnected ? `Live data from ${bluetoothDevice?.name || 'your device'}` : 'Real-time data from your connected IoT soil sensor.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-md border bg-secondary/30">
                        <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Thermometer size={16}/> Temperature</h4>
                        <p className="text-2xl font-bold">{lastDataPoint.temp}°C</p>
                    </div>
                     <div className="p-3 rounded-md border bg-secondary/30">
                        <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Droplets size={16}/> Moisture</h4>
                        <p className="text-2xl font-bold">{lastDataPoint.moisture}%</p>
                        <Progress value={lastDataPoint.moisture} className="h-2 mt-1"/>
                    </div>
                     <div className="p-3 rounded-md border bg-secondary/30">
                        <h4 className="font-semibold text-primary">Nitrogen (N)</h4>
                        <p className="text-2xl font-bold">{lastDataPoint.nitrogen} ppm</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Sensor Data Trend (Last 10s)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="temp" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Temp (°C)" dot={false}/>
                            <Line yAxisId="right" type="monotone" dataKey="moisture" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Moisture (%)" dot={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground">
                <Info className="w-4 h-4 mr-2"/>
                {isConnected ? 'Displaying live data. Nitrogen level is simulated.' : 'This is a simulation. Connect a real device via Bluetooth for live data.'}
            </CardFooter>
        </Card>
    );
}

export default function ToolsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [pesticideInfo, setPesticideInfo] = React.useState<PesticideInfoOutput | null>(null);
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'userProfile', user.uid);
    }, [firestore, user]);

    const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            crop: "",
            pestOrDisease: "",
            fieldArea: 1,
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        setPesticideInfo(null);
        const result = await fetchPesticideInfo({
            ...data,
            language: userProfile?.language || 'English',
        });

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        } else {
            setPesticideInfo(result.data);
        }
        setIsLoading(false);
    }

  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-4xl space-y-6">
            <LiveFieldMonitor />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-primary" />
                        AI Pesticide Calculator
                    </CardTitle>
                    <CardDescription>Get AI-powered pesticide recommendations and dosage calculations for your specific needs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="crop"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Crop Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Tomato, Cotton" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pestOrDisease"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pest or Disease</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Aphids, Blight" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="fieldArea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Field Area (in acres)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Get Recommendations
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          
            {isLoading && (
                <div className="mt-6 flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card border">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="font-semibold">AI is calculating recommendations...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
            )}

            {pesticideInfo && pesticideInfo.recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="item-0">
                            {pesticideInfo.recommendations.map((rec, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="font-semibold text-base hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <span>{rec.pesticideName}</span>
                                        <Badge variant={rec.type === 'Organic' ? 'default' : 'secondary'}>{rec.type}</Badge>
                                    </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-2">
                                        <div className="p-3 rounded-md border bg-secondary/30">
                                            <h4 className="font-semibold text-primary">Chemical Composition</h4>
                                            <p className="text-sm text-muted-foreground">{rec.chemicalName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-md border bg-secondary/30">
                                                <h4 className="font-semibold text-primary">Application Rate</h4>
                                                <p className="text-sm text-muted-foreground">{rec.applicationRate}</p>
                                            </div>
                                            <div className="p-3 rounded-md border bg-secondary/30">
                                                <h4 className="font-semibold text-primary">Total for {form.getValues('fieldArea')} acres</h4>
                                                <p className="text-sm text-muted-foreground font-bold">{rec.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                            <ShieldAlert className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-destructive">Safety Precautions</h4>
                                                <p className="text-sm text-muted-foreground">{rec.safetyPrecautions}</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        <Info className="w-4 h-4 mr-2"/>
                        Disclaimer: Always read and follow the manufacturer's label and local regulations. The recommendations provided are for informational purposes only.
                    </CardFooter>
                </Card>
            )}

            {pesticideInfo && pesticideInfo.recommendations.length === 0 && !isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card border">
                <p className="font-semibold">No specific recommendations found.</p>
                <p className="text-sm text-muted-foreground">Please try different search terms or consult a local expert.</p>
            </div>
            )}
        </div>
      </main>
    </div>
  );
}

    