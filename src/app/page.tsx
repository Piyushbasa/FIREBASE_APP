'use client';
import { Header } from '@/components/dashboard/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CropSuggestionCard } from '@/components/dashboard/crop-suggestion-card';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';
import { CityData } from '@/components/dashboard/city-data';
import { PlantHealthCard } from '@/components/dashboard/plant-health-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="prices">Commodity Prices</TabsTrigger>
              <TabsTrigger value="suggester">AI Crop Suggester</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <CityData />
              <PlantHealthCard />
              <SunTimesCard />
            </TabsContent>
            <TabsContent value="prices">
              <CommodityPrices />
            </TabsContent>
            <TabsContent value="suggester">
              <CropSuggestionCard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
