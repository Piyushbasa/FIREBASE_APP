import { Header } from '@/components/dashboard/header';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';
import { FieldMonitoringCard } from '@/components/dashboard/field-monitoring-card';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <WeatherCard />
            <SunTimesCard />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <CommodityPrices />
            <FieldMonitoringCard />
          </div>
        </div>
      </main>
    </div>
  );
}
