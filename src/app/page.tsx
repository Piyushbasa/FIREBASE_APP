import { Header } from '@/components/dashboard/header';
import { LocationSelector } from '@/components/dashboard/location-selector';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { SoilHealthCard } from '@/components/dashboard/soil-health-card';
import { CropInfoCard } from '@/components/dashboard/crop-info-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { MarketPricesCard } from '@/components/dashboard/market-prices-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <main className="flex-1 bg-card rounded-t-[2rem] p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Home</h1>
        <LocationSelector />
        <div className="grid grid-cols-2 gap-4">
          <WeatherCard />
          <SoilHealthCard />
        </div>
        <CropInfoCard />
        <QuickActions />
        <MarketPricesCard />
      </main>
    </div>
  );
}
