import { Header } from '@/components/dashboard/header';
import { CommodityPrices } from '@/components/dashboard/commodity-prices';

export default function MarketPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <CommodityPrices />
        </div>
      </main>
    </div>
  );
}
