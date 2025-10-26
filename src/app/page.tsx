'use client';
import { Header } from '@/components/dashboard/header';
import { CropSuggestionCard } from '@/components/dashboard/crop-suggestion-card';
import { CityData } from '@/components/dashboard/city-data';
import { PlantHealthCard } from '@/components/dashboard/plant-health-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <CityData />
                <PlantHealthCard />
              </div>
              <div className="space-y-4">
                <CropSuggestionCard />
                <SunTimesCard />
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
