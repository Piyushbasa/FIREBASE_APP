import { Header } from '@/components/dashboard/header';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';
import { PlantHealthCard } from '@/components/dashboard/plant-health-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <WeatherCard />
            <SunTimesCard />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <CommodityPrices />
            <PlantHealthCard />
          </div>
        </div>
      </main>
    </div>
  );
}
