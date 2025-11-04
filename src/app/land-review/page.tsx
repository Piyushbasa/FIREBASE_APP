
'use client';

import * as React from "react";
import Image from 'next/image';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Leaf, Droplets, Calendar, AreaChart } from 'lucide-react';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for different fields
const fields = [
  { 
    id: "field-1", 
    name: "Paddy Field, Punjab", 
    size: "15 Acres",
    lastUpdate: "Today, 10:30 AM",
    vegetationIndex: 0.85,
    moistureLevel: "65%",
    image: PlaceHolderImages.find(p => p.id === 'paddy-field')
  },
  { 
    id: "field-2", 
    name: "Cotton Field, Gujarat", 
    size: "25 Acres",
    lastUpdate: "Today, 10:45 AM",
    vegetationIndex: 0.72,
    moistureLevel: "48%",
    image: PlaceHolderImages.find(p => p.id === 'cotton-field')
  },
  { 
    id: "field-3", 
    name: "Sugarcane Farm, U.P.", 
    size: "50 Acres",
    lastUpdate: "Yesterday, 4:00 PM",
    vegetationIndex: 0.91,
    moistureLevel: "72%",
    image: PlaceHolderImages.find(p => p.id === 'sugarcane-farm')
  },
  {
    id: "field-4",
    name: "Wheat Field, Haryana",
    size: "20 Acres",
    lastUpdate: "Today, 11:00 AM",
    vegetationIndex: 0.78,
    moistureLevel: "55%",
    image: PlaceHolderImages.find(p => p.id === 'wheat-field')
  }
];

const generateNdviData = (base: number) => {
  return [
    { month: 'Jan', ndvi: base - 0.1 + Math.random() * 0.05 },
    { month: 'Feb', ndvi: base - 0.05 + Math.random() * 0.05 },
    { month: 'Mar', ndvi: base + Math.random() * 0.05 },
    { month: 'Apr', ndvi: base + 0.05 + Math.random() * 0.05 },
    { month: 'May', ndvi: base + 0.1 + Math.random() * 0.05 },
    { month: 'Jun', ndvi: base + 0.08 + Math.random() * 0.05 },
  ].map(d => ({ ...d, ndvi: parseFloat(d.ndvi.toFixed(2))}));
};


export default function LandReviewPage() {
  const [selectedFieldId, setSelectedFieldId] = React.useState(fields[0].id);
  const [isLoading, setIsLoading] = React.useState(false);
  const [displayField, setDisplayField] = React.useState(fields[0]);

  const ndviData = React.useMemo(() => generateNdviData(displayField.vegetationIndex), [displayField]);

  const handleFieldChange = (fieldId: string) => {
    setIsLoading(true);
    setSelectedFieldId(fieldId);
    // Simulate loading new data
    setTimeout(() => {
      const newField = fields.find(f => f.id === fieldId) || fields[0];
      setDisplayField(newField);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Review Your Land
                <Select value={selectedFieldId} onValueChange={handleFieldChange}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
              <CardDescription>
                Satellite-powered insights for your farm. Analyze crop health and land conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <Skeleton className="w-full aspect-[16/9] rounded-lg" />
              ) : (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border">
                   {displayField.image && (
                    <Image 
                      src={displayField.image.imageUrl}
                      alt={`Aerial view of ${displayField.name}`}
                      fill
                      className="object-cover"
                      data-ai-hint={displayField.image.imageHint}
                    />
                   )}
                   <div className="absolute bottom-0 left-0 bg-black/50 text-white p-2 rounded-tr-lg">
                      <h3 className="font-bold text-lg">{displayField.name}</h3>
                      <p className="text-sm">{displayField.size}</p>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {isLoading ? (
                    <>
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                        <Skeleton className="h-24" />
                    </>
                 ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Vegetation Index (NDVI)</CardTitle>
                                <Leaf className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{displayField.vegetationIndex}</div>
                                <p className="text-xs text-muted-foreground">Higher is generally healthier</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Soil Moisture</CardTitle>
                                <Droplets className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{displayField.moistureLevel}</div>
                                <p className="text-xs text-muted-foreground">Based on recent estimates</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Update</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{displayField.lastUpdate.split(',')[0]}</div>
                                <p className="text-xs text-muted-foreground">{displayField.lastUpdate.split(',')[1]}</p>
                            </CardContent>
                        </Card>
                    </>
                 )}
              </div>

               <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AreaChart className="w-5 h-5"/>
                            NDVI Trend (6 Months)
                        </CardTitle>
                        <CardDescription>Simulated crop growth cycle analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-[250px] w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={ndviData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 1]} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
               </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
