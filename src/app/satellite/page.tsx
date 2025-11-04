
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

const features = [
  {
    title: "Unified Visualization and Analysis (UVA)",
    description: "Access and visualize satellite imagery from ISRO's vast archives, including IRS, Resourcesat, and Cartosat data.",
    image: PlaceHolderImages.find(p => p.id === 'uva-map'),
    link: "/land-review",
    linkText: "Analyze Fields",
    icon: Map
  },
  {
    title: "Vegetation and Crop Monitoring",
    description: "Track crop health, growth stages, and vegetation stress using near real-time Normalized Difference Vegetation Index (NDVI) data.",
    image: PlaceHolderImages.find(p => p.id === 'vegetation-monitoring'),
    link: "/land-review",
    linkText: "Monitor Crops",
    icon: Leaf
  },
  {
    title: "Krishi-DSS: Drought Portal",
    description: "Utilize the Drought Early Warning System to monitor soil moisture and get advisories. Access drought assessment reports.",
    image: PlaceHolderImages.find(p => p.id === 'drought-portal'),
    link: "/api/mock-drought-report.pdf", // Mock link
    linkText: "Download Report",
    icon: CloudDrizzle
  },
  {
    title: "New and Renewable Energy",
    description: "Assess solar and wind energy potential for your location to support sustainable farming practices and energy independence.",
    image: PlaceHolderImages.find(p => p.id === 'renewable-energy'),
    link: "#",
    linkText: "Coming Soon",
    icon: Sun,
    isComingSoon: true,
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
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col overflow-hidden group">
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
                   {feature.title === "New and Renewable Energy" && (
                       <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                            <div className="p-3 rounded-md border bg-secondary/30">
                                <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Sun size={16}/> Solar Potential</h4>
                                <p className="text-xl font-bold">5.5 kWh/m²</p>
                            </div>
                             <div className="p-3 rounded-md border bg-secondary/30">
                                <h4 className="font-semibold text-primary flex items-center justify-center gap-1"><Wind size={16}/> Wind Potential</h4>
                                <p className="text-xl font-bold">6.2 m/s</p>
                            </div>
                        </div>
                   )}
                </CardContent>
                <CardFooter className="p-4 bg-secondary/30">
                  <Link href={feature.link} className="w-full" target={feature.link.startsWith('/api') ? '_blank' : '_self'}>
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
