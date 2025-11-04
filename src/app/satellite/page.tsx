
'use client';

import * as React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/dashboard/header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Leaf, CloudDrizzle, Sun } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "uva",
    title: "Bhoonidhi Geoportal",
    description: "Access and visualize satellite imagery from ISRO's vast archives, including IRS, Resourcesat, and Cartosat data.",
    image: PlaceHolderImages.find(p => p.id === 'uva-map'),
    link: "https://bhoonidhi.nrsc.gov.in/bhoonidhi/index.html",
    linkText: "Visit Official Site",
    icon: Map
  },
  {
    id: "vegetation",
    title: "VEDAS Platform",
    description: "Track crop health, growth stages, and vegetation stress using near real-time Normalized Difference Vegetation Index (NDVI) data.",
    image: PlaceHolderImages.find(p => p.id === 'vegetation-monitoring'),
    link: "https://vedas.sac.gov.in/",
    linkText: "Visit Official Site",
    icon: Leaf
  },
  {
    id: "drought",
    title: "MOSDAC Weather Data",
    description: "Utilize near real-time weather and atmospheric data including temperature, wind speed, and humidity from ISRO's meteorological satellites.",
    image: PlaceHolderImages.find(p => p.id === 'drought-portal'),
    link: "https://mosdac.gov.in/",
    linkText: "Visit Official Site",
    icon: CloudDrizzle
  },
  {
    id: "energy",
    title: "VEDAS Renewable Energy",
    description: "Assess solar and wind energy potential for your location to support sustainable farming practices and energy independence.",
    image: PlaceHolderImages.find(p => p.id === 'renewable-energy'),
    link: "https://vedas.sac.gov.in/vedas/en/energy.html",
    linkText: "Visit Official Site",
    icon: Sun,
  }
];


export default function SatellitePage() {
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
                </CardContent>
                <CardFooter className="p-4 bg-secondary/30">
                  <Link href={feature.link} className="w-full" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      {feature.linkText}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
