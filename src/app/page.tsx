import { Header } from '@/components/dashboard/header';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { SunTimesCard } from '@/components/dashboard/sun-times-card';
import { FieldMonitoringCard } from '@/components/dashboard/field-monitoring-card';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl grid gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <WeatherCard />
            <SunTimesCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <CommodityPrices />
            </div>
            <div className="lg:col-span-2">
              <FieldMonitoringCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
