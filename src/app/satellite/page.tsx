
'use client';

import * as React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Leaf, CloudDrizzle, Sun, Wind } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "uva",
    title: "Unified Visualization and Analysis (UVA)",
    description: "Access and visualize satellite imagery from ISRO's vast archives, including IRS, Resourcesat, and Cartosat data.",
    image: PlaceHolderImages.find(p => p.id === 'uva-map'),
    link: "/land-review",
    linkText: "Analyze Fields",
    icon: Map
  },
  {
    id: "vegetation",
    title: "Vegetation and Crop Monitoring",
    description: "Track crop health, growth stages, and vegetation stress using near real-time Normalized Difference Vegetation Index (NDVI) data.",
    image: PlaceHolderImages.find(p => p.id === 'vegetation-monitoring'),
    link: "/land-review",
    linkText: "Monitor Crops",
    icon: Leaf
  },
  {
    id: "drought",
    title: "Krishi-DSS: Drought Portal",
    description: "Utilize the Drought Early Warning System to monitor soil moisture and get advisories. Access drought assessment reports.",
    image: PlaceHolderImages.find(p => p.id === 'drought-portal'),
    link: "/mock-drought-report.pdf",
    linkText: "Download Report",
    icon: CloudDrizzle
  },
  {
    id: "energy",
    title: "New and Renewable Energy",
    description: "Assess solar and wind energy potential for your location to support sustainable farming practices and energy independence.",
    image: PlaceHolderImages.find(p => p.id === 'renewable-energy'),
    link: "#",
    linkText: "Coming Soon",
    icon: Sun,
    isComingSoon: true,
  }
];

const droughtLevels = [
    { severity: "Low", color: "bg-green-500/20 text-green-700 border-green-500/30", description: "Normal Conditions" },
    { severity: "Moderate", color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30", description: "Watch Advisory" },
    { severity: "Severe", color: "bg-red-500/20 text-red-700 border-red-500/30", description: "Warning Issued" },
];

export default function SatellitePage() {
    const [droughtIndex, setDroughtIndex] = React.useState(0);
    const [solarPotential, setSolarPotential] = React.useState(5.5);
    const [windPotential, setWindPotential] = React.useState(6.2);
    const [lastUpdated, setLastUpdated] = React.useState(new Date());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setDroughtIndex(prev => (prev + 1) % droughtLevels.length);
            setSolarPotential(parseFloat((5.0 + Math.random()).toFixed(1)));
            setWindPotential(parseFloat((5.5 + Math.random() * 1.5).toFixed(1)));
            setLastUpdated(new Date());
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentDroughtLevel = droughtLevels[droughtIndex];

  return (
    <div className="flex flex-col min-h-screen">
      <Header rightContent={<SidebarTrigger />} />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">ISRO Satellite Center</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Leveraging India's space technology for advanced agricultural insights.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="flex flex-col overflow-hidden group">
                <div className="relative h-48 w-full">
                   {feature.image && (
                    <Image
                        src={feature.image.imageUrl}
                        alt={feature.description}
                        fill
                        className="object-cover"
                        data-ai-hint={feature.image.imageHint}
                    />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-4 left-4">
                        <CardTitle className="text-white flex items-center gap-2">
                            <feature.icon className="w-6 h-6"/>
                            {feature.title}
                        </CardTitle>
                   </div>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
                   
                   {feature.id === "drought" && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Current Status:</span>
                                <Badge className={cn("text-xs", currentDroughtLevel.color)}>{currentDroughtLevel.severity}</Badge>
                            </div>
                             <div className="p-3 rounded-md border text-center" >
                                <h4 className="font-semibold text-primary">Statewide Soil Moisture</h4>
                                <p className="text-2xl font-bold">34% <span className="text-sm font-normal text-muted-foreground">(-3% from avg)</span></p>
                            </div>
                            <p className="text-xs text-muted-foreground text-center pt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                        </div>
                   )}

                   {feature.id === "energy" && (
                       <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                            <div className="p-3 rounded-md border bg-secondary/30">
                                <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Sun size={16}/> Solar Potential</h4>
                                <p className="text-xl font-bold">{solarPotential} <span className="text-xs">kWh/m²</span></p>
                            </div>
                             <div className="p-3 rounded-md border bg-secondary/30">
                                <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Wind size={16}/> Wind Potential</h4>
                                <p className="text-xl font-bold">{windPotential} <span className="text-xs">m/s</span></p>
                            </div>
                        </div>
                   )}

                </CardContent>
                <CardFooter className="p-4 bg-secondary/30">
                  <Link href={feature.link} className="w-full" target={feature.link === "/mock-drought-report.pdf" ? "_blank" : "_self"} rel={feature.link === "/mock-drought-report.pdf" ? "noopener noreferrer" : ""}>
                    <Button className="w-full" disabled={feature.isComingSoon}>
                      {feature.linkText}
                      {!feature.isComingSoon && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

    